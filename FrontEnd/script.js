// partie 1: affichage dynamique des travaux
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

// function getWorks() {
//     fetch('http://localhost:5678/api/works')
//         .then(response => response.json())
//         .then(works => {
//             if (Array.isArray(works)) {
//                 localStorage.setItem("works", JSON.stringify(works));
//             } else {
//                 console.error('La réponse JSON n\'est pas un tableau.');
//             }
//         })
//         .catch(error => console.error('Erreur lors de la requête fetch :', error));
// };

async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();

        if (Array.isArray(works)) {
            localStorage.setItem("works", JSON.stringify(works));
        } else {
            console.error('La réponse JSON n\'est pas un tableau.');
        }
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
    }
}

getWorks();

let worksStorageString = localStorage.getItem("works");
let works = JSON.parse(worksStorageString);

function afficherWorks() {
    for (const photo of works) {      
        integrerWorks(photo);
    };
};

afficherWorks();

// partie 2: filtres par catégorie

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
console.log(categories)

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
    trashPic.addEventListener("click", (event) => {
        event.preventDefault();
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
    // fetch delete
    fetch(`http://localhost:5678/api/works/${idImage}`, {
        method: "DELETE",
        headers: {
            "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }        
    })
    .then(response => {
        if(response.ok) {
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
    })
    .catch(error => console.error("Erreur: ", error))    
}

function cleanMiniWorks() {
    const gallery = document.querySelector(".mini-gallery");
    gallery.innerHTML = "";
}

// deuxième modale
const boutonAjouterPhoto = document.getElementById('bouton_ajouter_photo')
boutonAjouterPhoto.addEventListener('click', () => {
    const divGalleryPhoto = document.getElementById('galerie_photo')
    divGalleryPhoto.style.display = 'none' 
    const divAjoutPhoto = document.getElementById('ajout_photo')
    divAjoutPhoto.style.display = 'block' 
    const modalReturn = document.querySelector('.modal-return')
    modalReturn.style.display = 'flex'
    const modalXmarkDiv = document.querySelector('.modal-xmark')
    modalXmarkDiv.style.justifyContent = 'space-between'
})

// inverser
const boutonReturn = document.querySelector('.modal-return')
boutonReturn.addEventListener('click', () => {
    divGalleryPhoto = document.getElementById('galerie_photo')
    divGalleryPhoto.style.display = 'block' 
    divAjoutPhoto = document.getElementById('ajout_photo')
    divAjoutPhoto.style.display = 'none' 
    modalReturn = document.querySelector('.modal-return')
    modalReturn.style.display = 'none'
    modalXmarkDiv = document.querySelector('.modal-xmark')
    modalXmarkDiv.style.justifyContent = 'flex-end'
})

function categoriesAjoutPhoto(cat) {
    const addCategorie = document.getElementById('add-categorie')
    const optionCategorie = document.createElement('option')
    optionCategorie.innerText = cat.name

    addCategorie.appendChild(optionCategorie)
}

for (i = 0; i < 3; i++) {
    categoriesAjoutPhoto(categories[i]);    
}