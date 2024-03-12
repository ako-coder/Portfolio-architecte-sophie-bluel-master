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
        integrerWorks(photo);
    };
};

afficherWorks();

function afficherWorksFiltered(category) {
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

function integrerBoutons(article) {
    const divButtons = document.querySelector(".buttons");
    const button = document.createElement("button");
    button.innerText = article.name;
    button.setAttribute("id", article.id);
    button.addEventListener("click", ()=> {
        cleanWorks();
        afficherWorksFiltered(article);
        cleanButtons();  
        document.getElementById("boutton_tous").classList.remove("filter_clicked");   
        button.classList.add("filter_clicked");
    })

    divButtons.appendChild(button);
};

function cleanWorks() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
}

function cleanButtons() {
    let buttons = document.querySelectorAll(".buttons button");
    buttons.forEach(function(button){
        button.classList.remove("filter_clicked"); 
    }) 
}

const buttonTous = document.getElementById("boutton_tous");
buttonTous.addEventListener("click", () => {
    cleanWorks();
    afficherWorks();
    cleanButtons();
    buttonTous.classList.add("filter_clicked");
})

for (i = 0; i < 3; i++) {
    integrerBoutons(categories[i]);    
}


// mode edition

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem('token') !== null){
        document.getElementById("buttons_categories").style.display = "none";
        document.getElementById("m_edition").style.display = "flex";
        document.getElementById("modal_edition").style.display = "block";
        document.getElementById("menu_login").style.display = "none";
        document.getElementById("menu_logout").style.display = "block";
    }
})

const boutonLogout = document.getElementById("menu_logout");
boutonLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
})

const boutonEdit = document.getElementById("modal_edition");
boutonEdit.addEventListener('click', () => {

})

function integrerMiniWorks(article) {
    const miniGallery = document.querySelector(".mini-gallery");
    const miniFig = document.createElement("figure");
    const miniPic = document.createElement("img");
    const trashPic = document.createElement("img");
    miniPic.src = article.imageUrl;
    trashPic.src = "assets/icons/trash.png";
    miniFig.classList.add("mini-fig");
    miniPic.classList.add("mini-pic");
    trashPic.classList.add("trash-pic");
    trashPic.addEventListener("click", () => {
        supprimerWorks(article.id);
    });

    miniGallery.appendChild(miniFig);
    miniFig.appendChild(miniPic);
    miniFig.appendChild(trashPic);

};

function afficherMiniWorks() {
    for (const photo of works) {        
        integrerMiniWorks(photo);
    };
};

afficherMiniWorks()

function supprimerWorks(idImage) {
    //TODO: fetch delete
    let localWorks = JSON.parse(localStorage.getItem("works"));
    localWorks = localWorks.filter(work => work.id !== idImage);
    localStorage.setItem("works", JSON.stringify(localWorks));
    worksStorageString = localStorage.getItem("works");
    works = JSON.parse(worksStorageString);
    cleanWorks();
    cleanMiniWorks();
    afficherWorks();
    afficherMiniWorks();
}

function cleanMiniWorks() {
    const gallery = document.querySelector(".mini-gallery");
    gallery.innerHTML = "";
}