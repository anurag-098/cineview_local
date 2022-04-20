const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const resultsList = document.querySelector('#results');
const BASE_URL = 'http://localhost:3000/';
// http://localhost:3000/

form.addEventListener('submit', formsubmitted);

function formsubmitted(event) {
    event.preventDefault();

    const searchTerm = searchInput.value;
    getSearchResults(searchTerm)
        .then(showResults);
}

function getSearchResults(searchTerm) {
    return fetch(`${BASE_URL}searhShow/${searchTerm}`)
        .then(res => res.json());
}

function showResults(results) {
    results.forEach(show => {
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
        img.src = show.image;
        const a = document.createElement('a');
        a.textContent = show.title;
        a.href = 'show.html?imdbId=' + show.imdbId;
        li.appendChild(a);


        resultsList.appendChild(li);
    });
}
