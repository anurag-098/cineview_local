import fetch from 'node-fetch';
import request from 'request';
import * as cheerio from 'cheerio';
import { response } from 'express';
import axios from 'axios';


const showSearchUrl = "https://www.imdb.com/find?s=tt&ttype=tv&ref_=fn_tv&q=";
const searchurl = "https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=";
const celebSearchUrl = "https://www.imdb.com/find?s=nm&ref_=fn_nm&q="
const movieurl = "https://www.imdb.com/title/";
const celebUrl = "https://imdb-api.com/en/API/Name/k_926a00hc/";
const bourl = "https://imdb-api.com/en/API/BoxOffice/k_926a00hc";
const comingsoon = "https://imdb-api.com/en/API/ComingSoon/k_8kz40a5u";


const searchCache = {};
const movieCache = {};
const showCache = {};
const celebCache = {};

// Movie search Page Data

async function searchMovies(searchTerm) {
    if (searchCache[searchTerm]) {
        console.log('Serving from cache:', searchTerm);
        return Promise.resolve(searchCache[searchTerm]);
    }
    const response = await fetch(`${searchurl}${searchTerm}`);
    const body = await response.text();
    const movies = [];
    const $ = cheerio.load(body);
    $('.findResult').each(function (i, element) {
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');

        const imdbId = $title.attr('href').match(/title\/(.*)\//)[1];
        const movie = {
            image: $image.attr('src'),
            title: $title.text(),
            imdbId
        };
        movies.push(movie);
    });
    searchCache[searchTerm] = movies;
    return movies;
}

// Show Search Page Data

async function searchShows(searchTerm) {
    if (searchCache[searchTerm]) {
        console.log('Serving from cache:', searchTerm);
        return Promise.resolve(searchCache[searchTerm]);
    }
    const response = await fetch(`${showSearchUrl}${searchTerm}`);
    const body = await response.text();
    const shows = [];
    const $ = cheerio.load(body);
    $('.findResult').each(function (i, element) {
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');

        const imdbId = $title.attr('href').match(/title\/(.*)\//)[1];
        const show = {
            image: $image.attr('src'),
            title: $title.text(),
            imdbId
        };
        shows.push(show);
    });
    searchCache[searchTerm] = shows;
    return shows;
}


// Celeb Search Page Data

async function searchCelebs(searchTerm) {
    if (searchCache[searchTerm]) {
        console.log('Serving from cache:', searchTerm);
        return Promise.resolve(searchCache[searchTerm]);
    }
    const response = await fetch(`${celebSearchUrl}${searchTerm}`);
    const body = await response.text();
    const celebs = [];
    const $ = cheerio.load(body);
    $('.findResult').each(function (i, element) {
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');

        const imdbId = $title.attr('href').match(/name\/(.*)\//)[1];
        const celeb = {
            image: $image.attr('src'),
            title: $title.text(),
            imdbId
        };
        celebs.push(celeb);
    });
    searchCache[searchTerm] = celebs;
    return celebs;
}


// Data for Movie Page

function getMovie(imdbId) {

    if (movieCache[imdbId]) {
        console.log('Serving from cache:', imdbId)
        return Promise.resolve(movieCache[imdbId]);
    }
    return fetch(`${movieurl}${imdbId}`)

        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);


            const title = $('[data-testid="hero-title-block__title"]').text();

            const rating = $('[data-testid="hero-title-block__metadata"] li:nth-child(2) a').text();
            const runtime = $('[data-testid="hero-title-block__metadata"] li:nth-child(3) ').text();

            const irating = [];
            while (irating.length <= 1) {
                $('div[data-testid="hero-rating-bar__aggregate-rating__score"] ').each(function (i, element) {
                    const irate = $(element).text();
                    irating.push(irate);

                });
            }
            let rate = parseFloat(irating) - 3 / 10;
            rate = rate + "/10";

            const rdate = $('[data-testid="title-details-releasedate"] div ul li a').text();
            const poster = $('[data-testid="hero-media__poster"] div img').attr('src');
            const $genre1 = $('div[data-testid="genres"] a:nth-child(1)').text();
            const $genre2 = $('div[data-testid="genres"] a:nth-child(2)').text();
            const $genre3 = $('div[data-testid="genres"] a:nth-child(3)').text();
            const plot = $('[data-testid="plot"] span:nth-child(3)').text();

            const directors = [];
            $('[data-testid="title-pc-principal-credit"]:nth-child(1) div ul li').each(function (i, element) {
                const director = $(element).text();
                directors.push(director);

            });
            const writers = [];
            $('[data-testid="title-pc-principal-credit"]:nth-child(2) div ul li').each(function (i, element) {
                const writer = $(element).text();
                writers.push(writer);

            });

            const storyline = $('[data-testid="storyline-plot-summary"] div div').text();

            const budget = $('[data-testid="title-boxoffice-budget"]').text();

            const casts = [];

            $('[data-testid="title-cast-item"]').each(function (i, element) {
                const $element = $(element);
                const $image = $element.find('[data-testid="title-cast-item__avatar"] div div img');
                const $name = $element.find('[data-testid="title-cast-item__actor"]');
                const $role = $element.find('[data-testid="cast-item-characters-with-as"]');
                const cast = {
                    image: $image.attr('src'),
                    title: $name.text(),
                    role: $role.text()
                };
                casts.push(cast);
            });

            const movie = {
                title,

                poster,
                rating,
                runtime,
                genres: [$genre1, $genre2, $genre3],
                irating: rate,
                rdate,
                plot,
                storyline,
                budget,
                cast: casts,
                director: directors.slice(0, (directors.length) / 2),
                writer: writers.slice(0, (writers.length) / 2),

            };

            movieCache[imdbId] = movie;
            return movie;
        });
}


// Data for Show Page

function getShow(imdbId) {
    if (showCache[imdbId]) {
        console.log('Serving from cache:', imdbId)
        return Promise.resolve(showCache[imdbId]);
    }
    return fetch(`${movieurl}${imdbId}`)
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);

            const title = $('[data-testid="hero-title-block__title"]').text();

            const rating = $('[data-testid="hero-title-block__metadata"] li:nth-child(3) a').text();
            const releaseinfo = $('[data-testid="hero-title-block__metadata"] li:nth-child(2) a ').text();


            const irating = [];
            while (irating.length <= 1) {
                $('div[data-testid="hero-rating-bar__aggregate-rating__score"] ').each(function (i, element) {
                    const irate = $(element).text();
                    irating.push(irate);
                });
            }
            const rdate = $('[data-testid="title-details-releasedate"] div ul li a').text();
            const poster = $('[data-testid="hero-media__poster"] div img').attr('src');
            const $genre1 = $('div[data-testid="genres"] a:nth-child(1)').text();
            const $genre2 = $('div[data-testid="genres"] a:nth-child(2)').text();
            const $genre3 = $('div[data-testid="genres"] a:nth-child(3)').text();
            const plot = $('[data-testid="plot"] span:nth-child(3)').text();

            const directors = [];
            $('[data-testid="title-pc-principal-credit"]:nth-child(1) div ul li').each(function (i, element) {
                const director = $(element).text();
                directors.push(director);

            });
            const writers = [];
            $('[data-testid="title-pc-principal-credit"]:nth-child(2) div ul li').each(function (i, element) {
                const writer = $(element).text();
                writers.push(writer);

            });

            const storyline = $('[data-testid="storyline-plot-summary"] div div').text();

            const casts = [];

            $('[data-testid="title-cast-item"]').each(function (i, element) {
                const $element = $(element);
                const $image = $element.find('[data-testid="title-cast-item__avatar"] div div img');
                const $name = $element.find('[data-testid="title-cast-item__actor"]');
                const $role = $element.find('[data-testid="cast-item-characters-with-as"]');
                const cast = {
                    image: $image.attr('src'),
                    title: $name.text(),
                    role: $role.text()
                };
                casts.push(cast);
            });

            const show = {
                title,
                poster,
                rating,
                releaseinfo,
                genres: [$genre1, $genre2, $genre3],
                irating: irating[0],
                rdate,
                plot,
                storyline,
                cast: casts,
                director: directors.slice(0, (directors.length) / 2),
                writer: writers.slice(0, (writers.length) / 2),
            };

            showCache[imdbId] = show;
            return show;
        });
}


// Data for Celeb Page

const getCeleb = async (imdbId) => {
    try {
        if (celebCache[imdbId]) {
            console.log('Serving from cache:')
            return Promise.resolve(celebCache[imdbId]);
        }
        const res = await axios.get(`${celebUrl}${imdbId}`);

        const name = res.data.name;
        const role = res.data.role;
        const image = res.data.image;
        const summary = res.data.summary;
        const birthDate = res.data.birthDate;
        const awards = res.data.awards;
        const height = res.data.height;
        const knownFor = [];
        for (let i = 0; i < res.data.knownFor.length; i++) {
            const id = res.data.knownFor[i].id;
            const title = res.data.knownFor[i].fullTitle;
            const role = res.data.knownFor[i].role;
            const image = res.data.knownFor[i].image;
            const kf = {
                id,
                title,
                role,
                image
            };
            knownFor.push(kf);
        }

        const moremovies = [];
        for (let i = 0; i < res.data.castMovies.length; i++) {
            const id = res.data.castMovies[i].id;
            const title = res.data.castMovies[i].title;
            const role = res.data.castMovies[i].role;

            const mm = {
                id,
                title,
                role,

            };
            moremovies.push(mm);
        }
        const celeb = {
            name,
            role,
            image,
            summary,
            birthDate,
            awards,
            height,
            knownFor,
            moremovies
        };

        celebCache[imdbId] = celeb;
        return celeb;
    }
    catch (e) {
        console.log(e);
    }
}



//Data for homepage


async function home() {
    try {
        const res = await axios.get(bourl);
        const ref = await axios.get(comingsoon);
        const collec = [];
        const box = [];
        for (let i = 0; i < res.data.items.length; i++) {
            const image = res.data.items[i].image;
            const id = res.data.items[i].id;
            const title = res.data.items[i].title;
            const gross = res.data.items[i].gross;
            const obj = {
                image,
                id,
                title,
                gross
            };
            box.push(obj);
        }
        const com = [];
        for (let i = 0; i < ref.data.items.length; i++) {
            const image = ref.data.items[i].image;
            const id = ref.data.items[i].id;
            const title = ref.data.items[i].title;
            const release = ref.data.items[i].releaseState;
            const obj2 = {
                image,
                id,
                title,
                release
            };
            com.push(obj2);
        }

        collec.push(box);
        collec.push(com);

        return collec;
    } catch (e) {
        console.log(e);
    }
}


export default {
    searchMovies,
    getMovie,
    searchShows,
    searchCelebs,
    getShow,
    getCeleb,
    home
}


