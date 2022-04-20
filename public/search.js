const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const resultsList = document.querySelector('#results');
const BASE_URL = 'http://localhost:3000/';


form.addEventListener('submit', formsubmitted);

function formsubmitted(event) {
    event.preventDefault();

    const searchTerm = searchInput.value;
    getSearchResults(searchTerm)
        .then(showResults);
}

function getSearchResults(searchTerm) {
    return fetch(`${BASE_URL}search/${searchTerm}`)
        .then(res => res.json());

}

function showResults(results) {
    results.forEach(movie => {
        const ul = document.createElement('ul');
        ul.className = "list-group";
        ul.id = "ul";
        const li = document.createElement('li');
        li.className = "list-group-item";
        li.id = "lis";
        ul.appendChild(li);
        const img = document.createElement('img');
        img.className = "rounded";
        li.appendChild(img);
        img.src = movie.image;
        const a = document.createElement('a');
        a.textContent = movie.title;
        a.href = 'movie.html?imdbId=' + movie.imdbId;
        li.appendChild(a);


        resultsList.appendChild(li);
    });
}
