const main = document.querySelector('main');
const imdbId = window.location.search.match(/imdbId=(.*)/)[1];
const BASE_URL = 'http://localhost:3000/';

const trailer_url = 'https://imdb-api.com/en/API/YouTubeTrailer/k_8kz40a5u/';
const ratings_url = 'https://imdb-api.com/en/API/Ratings/k_t93kn9l9/'



function getShow(imdbId) {
    return fetch(`${BASE_URL}show/${imdbId}`)
        .then(res => res.json());
}

async function showShow(show) {

    const section = document.createElement('section');
    document.title = `${show.title}`;
    main.appendChild(section);
    const properties = [
        {
            title: 'PG-Rating',
            property: 'rating'
        },
        {
            title: 'Cineview-Rating',
            property: 'irating'
        },
        {
            title: 'Release Date',
            property: 'rdate'
        },
        {
            title: 'Release Info',
            property: 'releaseinfo'
        },
        {
            title: 'Genre',
            property: 'genres'
        }
    ];

    const descriptionHTML = properties.reduce((html, property) => {
        html += `
        <dt class="col-sm-4">${property.title}</dt>
        <dd class="col-sm-8">${show[property.property]}</dd>`;
        return html;
    }, '');

    const bproperties = [
        {
            title: 'Director',
            bproperty: 'director'
        },
        {
            title: 'Writer',
            bproperty: 'writer'
        },
        {
            title: 'Plot',
            bproperty: 'plot'
        }
    ];

    const writedirect = bproperties.reduce((html, bproperty) => {
        html += `<dt class="col-sm-3">${bproperty.title}</dt>
            <dd class="col-sm-9">${show[bproperty.bproperty]}</dd>`;
        return html;
    }, '');

    let list = "";
    for (let i = 0; i < show.cast.length; i++) {
        list += ` <div class="row" id="castblock">
        <img src="${show.cast[i].image}" class="img-fluid col-5" />
        <div class="col-7">
        <h5>${show.cast[i].title}</h5>
        <figcaption class="blockquote-footer mt-1">
        <cite title="Source Title">${show.cast[i].role}</cite>
        </figcation>
        </div>
        </div>`
    };

    const res = await axios.get(`${trailer_url}${imdbId}`);
    const href = res.data.videoUrl;

    const ref = await axios.get(`${ratings_url}${imdbId}`);

    const imdb = ref.data.imDb;
    const metacritic = ref.data.metacritic;
    const tmdb = ref.data.theMovieDb;
    const rT = ref.data.rottenTomatoes;
    const fa = ref.data.filmAffinity;

    section.outerHTML = `
            <section class="container" id="details" >
            
                <h1 class="text-center mb-5" id="title">${show.title}</h1>
                <div id="compare" class="mb-5"></div>
                <section id="description">
                    <div class="row">    
                        <div class="col-sm-4" id="poster">
                            <img src="${show.poster}" class="img-fluid" />
                        </div>
                        <div class="col-sm-8 pt-5" id="pdescription">
                            <dl class="row">
                                ${descriptionHTML}
                            </dl>
                        </div>
                    </div>
                    <div class="mt-5" id="description2">
                    <dl class="row">
                    <dt class="col-sm-3">Trailer</dt>
                    <dd class="col-sm-9"  id="details2"></dd>
                    </dl>
                        <dl class="row">
                            ${writedirect}
                        </dl>
                        <h3>Storyline</h3>
                        <p>${show.storyline}</p>
                    </div>
                    <section id="starcast" class="container">
                    <div>
                    <h3>Star Casts<h3>
                     <div id="casts" class="container-fluid">
                        ${list}
                    </div>
                    </div>
                    </section>   
                </section>
            </section>
        `;
    const properties2 = [
        {
            src: './images/filmaffinity_64.png',
            // property: fa
        },
        {
            src: './images/imdb.png',
            // property: imdb
        },
        {
            src: './images/kisspng-metacritic-video-game-review-aggregator-app-5ac97e4e15eeb3.5097039115231545100899.png',
            // property: metacritic
        },
        {
            src: './images/rotten tomatoes.png',
            // property: rT
        },
        {
            src: './images/icons8-the-movie-database-tmdb-a-popular,-user-editable-database-for-movies-and-tv-shows.-24.png',
            // property: tmdb
        },
    ];
    const srcHTML = properties2.reduce((html, property) => {
        html += `
            <th scope="col"><img src="${property.src}" class="img-fluid" style="width:2.5rem"/></th>`;
        return html;
    }, '');

    const table = `
            <table class=".table-responsive table-bordered-md container m-4 m-md-1" style="color:white">
            <thead>
                <tr>
                ${srcHTML}
                </tr >
            </thead >
        <tbody>
            <tr>
            <td>${fa}</td>
            <td>${imdb}</td>
            <td>${metacritic}</td>
            <td>${rT}</td>
            <td>${tmdb}</td>
            </tr>
        </tbody>
            </table > `;

    const compare = document.querySelector("#compare");
    compare.innerHTML = table;
    const section2 = document.querySelector('#details2');
    const link = document.createElement("a");
    link.innerText = "Trailer";
    link.setAttribute("href", `${href} `);
    link.classList.add("btn", "btn-secondary");
    section2.insertAdjacentElement('afterbegin', link);
}





getShow(imdbId)
    .then(showShow)




