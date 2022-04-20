const bosection = document.querySelector('#featured');
const bourl = 'https://imdb-api.com/en/API/BoxOffice/k_8kz40a5u';
const comingsoon = 'https://imdb-api.com/en/API/ComingSoon/k_8kz40a5u';
const cssection = document.querySelector('#comingSoon');
const baseUrl = 'http://localhost:3000/home';

function getboxcom() {
    return fetch(baseUrl)
        .then(res => res.json());
}

function showboxcom(collec) {

    let list = '';
    for (let i = 0; i < collec[0].length; i++) {
        list += `
            <div id="bcard">
            <a href="http://localhost:3000/movie.html?imdbId=${collec[0][i].id}">
        <div class="card bg-dark" style="width: 13rem;">
            <img src="${collec[0][i].image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${collec[0][i].title}</h5>
                </div>
             <ul class="list-group list-group-flush ">
                <li class="list-group-item bg-dark">${collec[0][i].gross}</li>
            </ul>
        </div>
    </a>
    </div>`;
    };
    bosection.innerHTML = list;

    let list2 = '';
    for (let i = 0; i < collec[1].length; i++) {
        list2 += `
        <div id="bcard">
        <a href="https://cineview-rose.vercel.app/movie.html?imdbId=${collec[1][i].id}">
<div class="card bg-dark" style="width: 13rem;">
    <img src="${collec[1][i].image}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${collec[1][i].title}</h5>
        </div>
        <ul class="list-group list-group-flush ">
            <li class="list-group-item bg-dark">${collec[1][i].release}</li>
        </ul>
</div>
</a> 
</div>`;
    };
    cssection.innerHTML = list2;
}

getboxcom()
    .then(showboxcom)








// function getboxoff() {
//     return fetch(bourl)
//         .then(res => res.json());
// }

// function showboxoff(BoxOfficeWeekendDataDetail) {
//     console.log(BoxOfficeWeekendDataDetail);


//     let list = '';
//     for (let i = 0; i < BoxOfficeWeekendDataDetail.items.length; i++) {
//         list += `
//         <div id="bcard">
//         <a href="http://localhost:3000/movie.html?imdbId=${BoxOfficeWeekendDataDetail.items[i].id}">
//     <div class="card bg-dark" style="width: 13rem;">
//         <img src="${BoxOfficeWeekendDataDetail.items[i].image}" class="card-img-top" alt="...">
//             <div class="card-body">
//                 <h5 class="card-title">${BoxOfficeWeekendDataDetail.items[i].title}</h5>
//             </div>
//          <ul class="list-group list-group-flush ">
//             <li class="list-group-item bg-dark">${BoxOfficeWeekendDataDetail.items[i].gross}</li>
//         </ul>
//     </div>
// </a>
// </div>`;
//     };
//     bosection.innerHTML = list;
// }



// function getComSoon() {
//     return fetch(comingsoon)
//         .then(res => res.json());
// }

// function showComSoon(NewMovieDataDetail) {
//     console.log(NewMovieDataDetail);

//     let list = '';
//     for (let i = 0; i < NewMovieDataDetail.items.length; i++) {
//         list += `
//         <div id="bcard">
//         <a href="http://localhost:3000/movie.html?imdbId=${NewMovieDataDetail.items[i].id}">
// <div class="card bg-dark" style="width: 13rem;">
//     <img src="${NewMovieDataDetail.items[i].image}" class="card-img-top" alt="...">
//         <div class="card-body">
//             <h5 class="card-title">${NewMovieDataDetail.items[i].title}</h5>
//         </div>
//         <ul class="list-group list-group-flush ">
//             <li class="list-group-item bg-dark">${NewMovieDataDetail.items[i].releaseState}</li>
//         </ul>
// </div>
// </a>
// </div>`;
//     };
//     cssection.innerHTML = list;
// }

// /* <div id="bcard">
//         <a href="movie.html?imdbId=${NewMovieDataDetail.items[i].id}">
//         <div>
//         <img src="${NewMovieDataDetail.items[i].image}">
//         </div>
//         <h3>${NewMovieDataDetail.items[i].title}</h3>
//         <h4>${NewMovieDataDetail.items[i].releaseState}</h4>
//         <a>
//         </div> */



// // getboxoff()
// //     .then(showboxoff)

// getComSoon()
//     .then(showComSoon)