function integrerWorks(article) {
    const gallery = document.querySelector(".gallery");
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = article.imageUrl;
    const caption = document.createElement("figcaption");
    caption.innerText = article.title;

    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(caption);
};

function getWorks() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            if (Array.isArray(works)) {
                localStorage.setItem("works", JSON.stringify(works));
            } else {
                console.error('La réponse JSON n\'est pas un tableau.');
            }
        })
        .catch(error => console.error('Erreur lors de la requête fetch :', error));
};

getWorks();

let worksStorageString = localStorage.getItem("works");
let works = JSON.parse(worksStorageString);

function afficherWorks() {
    for (const photo of works) {
        console.log(photo);
        integrerWorks(photo);
    };
};

afficherWorks();

function afficherWorksFiltered(category) {
    console.log(category);
    for (const photo of works) {
        if (photo.categoryId === category.id) {            
            integrerWorks(photo);
        }
    };
};

function getCategories() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            if (Array.isArray(categories)) {
                localStorage.setItem("categories", JSON.stringify(categories));
            } else {
                console.error('La réponse JSON n\'est pas un tableau.');
            }
        })
        .catch(error => console.error('Erreur lors de la requête fetch :', error));
};

getCategories();

let categoriesStorageString = localStorage.getItem("categories");
let categories = JSON.parse(categoriesStorageString);
console.log(categories);

function integrerBoutons(article) {
    const divButtons = document.querySelector(".buttons");
    const button = document.createElement("button");
    button.innerText = article.name;
    button.setAttribute("id", article.id);
    button.addEventListener("click", ()=> {
        cleanWorks();
        afficherWorksFiltered(article);
    })

    divButtons.appendChild(button);
};

function cleanWorks() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
}

document.getElementById("boutton_tous").addEventListener("click", () => {
    cleanWorks();
    afficherWorks();
})

for (i = 0; i < 3; i++) {
    integrerBoutons(categories[i]);    
}
