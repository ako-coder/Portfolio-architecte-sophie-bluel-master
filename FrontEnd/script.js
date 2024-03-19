import { closeModal } from "./app.js";

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

async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();

        if (Array.isArray(works)) {
            4
        } else {
            console.error('La réponse JSON n\'est pas un tableau.');
        }
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
    }
};

getWorks();

let worksStorageString = localStorage.getItem("works");
let works = JSON.parse(worksStorageString);

function afficherWorks() {
    for (const photo of works) {
        integrerWorks(photo);
    }
};

afficherWorks();

// partie 1.2: filtres par catégorie

function afficherWorksFiltered(category) {
    for (const photo of works) {
        if (photo.categoryId === category.id) {
            integrerWorks(photo);
        }
    }
};

async function getCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        if (Array.isArray(categories)) {
            localStorage.setItem("categories", JSON.stringify(categories));
        } else {
            console.error('La réponse JSON n\'est pas un tableau.');
        }
    } catch {
        (error => console.error('Erreur lors de la requête fetch :', error));
    }
};

getCategories();

let categoriesStorageString = localStorage.getItem("categories");
let categories = JSON.parse(categoriesStorageString);

function integrerBoutons(article) {
    const divButtons = document.querySelector(".buttons");
    const button = document.createElement("button");
    button.innerText = article.name;
    button.setAttribute("id", article.id);
    button.addEventListener("click", () => {
        cleanWorks();
        afficherWorksFiltered(article);
        cleanButtons();
        document.getElementById("boutton_tous").classList.remove("filter_clicked");
        button.classList.add("filter_clicked");
    });

    divButtons.appendChild(button);
};

function cleanWorks() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
};

function cleanButtons() {
    let buttons = document.querySelectorAll(".buttons button");
    buttons.forEach(function (button) {
        button.classList.remove("filter_clicked");
    });
};

const buttonTous = document.getElementById("boutton_tous");
buttonTous.addEventListener("click", () => {
    cleanWorks();
    afficherWorks();
    cleanButtons();
    buttonTous.classList.add("filter_clicked");
});

for (let i = 0; i < 3; i++) {
    integrerBoutons(categories[i]);
};


// partie 2 : login + app.js

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('token') !== null) {
        document.getElementById("buttons_categories").style.display = "none";
        document.getElementById("m_edition").style.display = "flex";
        document.getElementById("modal_edition").style.display = "block";
        document.getElementById("menu_login").style.display = "none";
        document.getElementById("menu_logout").style.display = "block";
    }
});

const boutonLogout = document.getElementById("menu_logout");
boutonLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
});

// partie 3: modale

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

afficherMiniWorks();

async function supprimerWorks(idImage) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${idImage}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        
        if (response.ok) {
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
    } catch (error) {
        console.error("Erreur: ", error);
    }
};

function cleanMiniWorks() {
    const gallery = document.querySelector(".mini-gallery");
    gallery.innerHTML = "";
};

// deuxième modale
const boutonAjouterPhoto = document.getElementById('bouton_ajouter_photo');
boutonAjouterPhoto.addEventListener('click', () => {
    const divGalleryPhoto = document.getElementById('galerie_photo');
    divGalleryPhoto.style.display = 'none';
    const divAjoutPhoto = document.getElementById('ajout_photo');
    divAjoutPhoto.style.display = 'block';
    const modalReturn = document.querySelector('.modal-return');
    modalReturn.style.display = 'flex';
    const modalXmarkDiv = document.querySelector('.modal-xmark');
    modalXmarkDiv.style.justifyContent = 'space-between';

    // selection fichier
    document.getElementById('add-file').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('preview-image').src = e.target.result;

                // chacher le reste de la div
                document.getElementById('add-file').style.display = 'none';
                document.querySelector('label[for="add-file"]').style.display = 'none';
                document.querySelector('.text-10px').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
});

// inverser
const boutonReturn = document.querySelector('.modal-return');
boutonReturn.addEventListener('click', () => {
    const divGalleryPhoto = document.getElementById('galerie_photo');
    divGalleryPhoto.style.display = 'block';
    const divAjoutPhoto = document.getElementById('ajout_photo');
    divAjoutPhoto.style.display = 'none';
    const modalReturn = document.querySelector('.modal-return');
    modalReturn.style.display = 'none';
    const modalXmarkDiv = document.querySelector('.modal-xmark');
    modalXmarkDiv.style.justifyContent = 'flex-end';
});

function categoriesAjoutPhoto(cat) {
    const addCategorie = document.getElementById('add-categorie');
    const optionCategorie = document.createElement('option');
    optionCategorie.innerText = cat.name;
    optionCategorie.value = cat.id;

    addCategorie.appendChild(optionCategorie);
}

for (let i = 0; i < 3; i++) {
    categoriesAjoutPhoto(categories[i]);
}

const form = document.getElementById('form-new-work');

form.addEventListener('input', function () {
    const addTitle = document.getElementById('add-title');
    const addFile = document.getElementById('add-file');
    const addCategorie = document.getElementById('add-categorie');
    
    const isTitleFilled = addTitle.value.trim() !== '';
    const isFileSelected = addFile.files.length > 0;
    const isCategorySelected = addCategorie.value.trim() !== '';

    if (isTitleFilled && isFileSelected && isCategorySelected) {
        console.log("Tous les champs sont remplis !");
        let submitButtonM = document.getElementById('submit-button-modale2');
        submitButtonM.style.backgroundColor = '#1D6154';
        submitButtonM.style.cursor = 'pointer';
        submitButtonM.removeAttribute("disabled");
    }
});

// formulaire
form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const formData = new FormData();

    formData.append("title", document.getElementById('add-title').value)
    formData.append("image", document.getElementById('add-file').files[0])
    formData.append("category", document.getElementById('add-categorie').value)
    console.log(formData);
    console.log(`${document.getElementById('add-title').value}`)
    console.log(`${document.getElementById('add-file').files[0]}`)
    console.log(`${document.getElementById('add-categorie').value}`)

    try {
        const response = await fetch('http://localhost:5678/api/works/', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });

        if (response.ok) {
            console.log('Données envoyées avec succès !');
            const data = await response.json();
            console.log(data);
            integrerWorks(data);
            integrerMiniWorks(data);
            works.push(data);
            console.log(works);
            localStorage.setItem("works", JSON.stringify(works));
            closeModal(event);        

        } else {
            console.error('Échec de l\'envoi des données.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
    }
});