const main = document.querySelector('main');
const imdbId = window.location.search.match(/imdbId=(.*)/)[1];
const BASE_URL = 'http://localhost:3000/';
// http://localhost:3000/

function getCeleb(imdbId) {
    return fetch(`${BASE_URL}celeb/${imdbId}`)
        .then(res => res.json());
}

async function showceleb(celeb) {

    const section = document.createElement('section');
    document.title = `${celeb.name}`;
    main.appendChild(section);

    const properties = [
        {
            title: 'Birth Date',
            property: 'birthDate'
        },
        {
            title: 'Role',
            property: 'role'
        },
        {
            title: 'Height',
            property: 'height'
        },

    ];

    const descriptionHTML = properties.reduce((html, property) => {
        html += `
            <dt class="col-sm-4">${property.title}</dt>
            <dd class="col-sm-8">${celeb[property.property]}</dd>`;
        return html;
    }, '');


    const bproperties = [
        {
            title: 'Awards',
            bproperty: 'awards'
        },
        {
            title: 'Summary',
            bproperty: 'summary'
        },
    ];

    const bottomhtml = bproperties.reduce((html, bproperty) => {
        html += `<dt class="col-sm-3">${bproperty.title}</dt>
                <dd class="col-sm-9">${celeb[bproperty.bproperty]}</dd>`;
        return html;
    }, '');


    let list = "";
    for (let i = 0; i < celeb.knownFor.length; i++) {
        list += `  <div id="bcard">
        <a href="http://localhost:3000/movie.html?imdbId=${celeb.knownFor[i].id}">
    <div class="card bg-dark" style="width: 14rem;">
        <img src="${celeb.knownFor[i].image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${celeb.knownFor[i].title}</h5>
            </div>
         <ul class="list-group list-group-flush ">
            <li class="list-group-item bg-dark">${celeb.knownFor[i].role}</li>
        </ul>
    </div>
</a>
</div>`
    };

    let morelist = "";
    for (let i = 0; i < celeb.moremovies.length; i++) {
        if (celeb.moremovies[i].role === "Actor") {
            morelist += `
        <a href="http://localhost:3000/movie.html?imdbId=${celeb.moremovies[i].id}" style="text-decoration:none">
  <li class="list-group-item bg-dark" style="color:white">${celeb.moremovies[i].title}</li >
            <a>`;
        } else {
            continue;
        }
    };

    section.outerHTML = `
                <section class="container" id="details" >

                    <h1 class="text-center mb-5" id="title">${celeb.name}</h1>

                    <section id="description">
                        <div class="row">
                            <div class="col-sm-4" id="poster">
                                <img src="${celeb.image}" class="img-fluid" />
                            </div>
                            <div class="col-sm-8 pt-5" id="pdescription">
                                <dl class="row">
                                    ${descriptionHTML}
                                </dl>
                            </div>
                        </div>
                        <div class="mt-5" id="description2">
                            <dl class="row">
                                ${bottomhtml}
                            </dl>
                        </div>
                        <section class="container-fluid">
                        <div id="more">
                            <h3 class="text-center mb-2" id="crhead">Known For</h3>
                                <div id="morelist" class="container">
                                    ${list}
                                </div>
                        </div>        
                        </section>
                        <section class="container-fluid">
                            <div id="more2">
                                <h3 class="text-center mb-2" id="crhead">More Movies</h3>
                                    <div id="moremovies" class="container">
                                        <ul class="list-group list-group-flush bg-dark" id="moremovlist">
                                            ${morelist}
                                        </ul>
                                    </div>
                             </div>
                        </section>
                    </section>
                </section>
                                `;

}

getCeleb(imdbId)
    .then(showceleb)

























