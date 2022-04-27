// on récupère les articles choisis par le client et stockés dans le localStorage
// dans le localStorage les données sont stockées en JSON, avec JSON.parse on les convertis en données JS
let panier = JSON.parse(localStorage.getItem('articles'))
// on crée une variable cartItems qui sera utilisée plus tard pour modifier les infos du HTML
let cartItems = document.querySelector('#cart__items')


// pour le calcul du prix total et de la quantité

// on choisit de faire une boucle : pour chaque canapé du panier
for (let canape of panier) {
  console.log(canape)
  
  // on récupère les infos du canapé depuis l'API
fetch(`http://localhost:3000/api/products/${canape.id}`)
.then(response => response.json())
.then(data => {

  // puis on modifie dans le HTML les infos de la variable cartItems
  cartItems.innerHTML += `
  <article class="cart__item" data-id="${canape.id}" data-color="${canape.couleur}" data-price="${data.price}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${canape.couleur}</p>
                    <p>${data.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${canape.quantité}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
                `
                // on appelle la fonction de calcul du prix total après chaque boucle de canapé puisque JS est asynchrone
                calculPriceOneCanape()
                supprimerProduit()
                //supprimerPanier()
                changerQuantite()
                //supprimerPanier()
}); 
} 


// calcul du prix total et quantité
// on crée une fonction 
calculPriceOneCanape = function () {
    // puis les variables qui vont varier dans le HTML en fonction de la quantité et du prix
  let allCanapes = document.querySelectorAll('article')
  let spanQuantity = document.querySelector('#totalQuantity')
  let spanPrice = document.querySelector('#totalPrice')

  // au démarrage, la valeur du panier tant en quantité qu'en prix est égale à 0
  let total = 0
  let nbeArticles = 0

  // on boucle 
  for (let canape of allCanapes) {
    // on crée les variables qui vont servir à calculer les totaux
    // parseInt permet de convertir une chaine de caracrtère en nombres
        let quantity = parseInt(canape.querySelector ('.itemQuantity').value)
        // comme on a ajouté la propriété data-price dans le HTML, dataset permet d'aller rechercher cette propriété
        let price = canape.dataset.price
        total = total + quantity * price
        nbeArticles = nbeArticles + quantity

  }

  // on affiche au panier la quantité totale et le prix total
  spanQuantity.textContent = nbeArticles
  spanPrice.textContent = total
  }

// Fonction pour supprimer un article

function supprimerProduit() {
  const suppressionArticle = document.querySelectorAll(".deleteItem");
  
  for (let i = 0; i < suppressionArticle.length; i++) {
    suppressionArticle[i].addEventListener("click", (event) => {
      event.preventDefault();
      panier.splice(i, 1);
      localStorage.setItem("articles", JSON.stringify(panier));
      alert("Votre produit a été supprimé");
      location.reload();
    });
  }
}
;

//Fonction pour vider entierement le panier
/*function supprimerPanier() {
  const viderPanier = document.getElementById(".cart__delete");
  viderPanier.addEventListener("click", (event) => {
   event.preventDefault();
   localStorage.clear();
   alert("Le panier a été supprimé");
   location.href = "index.html";
  });
 }
 ; 
 */

//Fonction pour changer la quantité d'un article
function changerQuantite() {
  let selectionQuantite = document.querySelectorAll(".itemQuantity");
    for(let i = 0; i < selectionQuantite.length; i ++) {
      selectionQuantite[i].addEventListener("change", (event) => {
        event.preventDefault();
        let articleQuantite = event.target.value;
        let nouveauPanier = {
          id: panier[i].id,
          quantité: articleQuantite,
          couleur: panier[i].couleur,
          img: panier[i].img,
          alt: panier[i].alt,
          nom: panier[i].nom,
          prix: panier[i].prix
        };
        panier[i] = nouveauPanier;
        localStorage.clear();
        localStorage.setItem("articles", JSON.stringify(panier));
        location.reload();
    }); 
  }
}
;

// remplissage du formulaire //

// sélection du bouton 'commander' repéré sur cart.html par l'id "order" //
const boutonCommander = document.querySelector('#order')
let form = document.querySelector('.cart__order__form')

// sélection des input du formulaire et création des variables //
/*let prenomInput = document.getElementById('fistName')
let nomInput = document.getElementById('lastName')
let adresseInput = document.getElementById('address')
let villeInput = document.getElementById('city')
let emailInput = document.getElementById('email')*/


// écouter la modification du prénom
form.firstName.addEventListener('change', function () {
  validFirstName(this);
});

// écouter la modification du nom
form.lastName.addEventListener('change', function () {
  validLastName(this);
});

// écouter la modification de l'adresse
form.address.addEventListener('change', function () {
  validAddress(this);
});

// écouter la modification de la ville
form.city.addEventListener('change', function () {
  validCity(this);
});

// écouter la modification de l'email
form.email.addEventListener('change', function () {
  validEmail(this);
});

// écouter la soumission du formulaire
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if(validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email)) {
      form.submit();
          }
});

// C. Validation des entrées création des RegEX

//    Vérification du prénom
let validFirstName = function(inputFirstName){
  // création de l'expression régulière pour la validation du prénom
let firstNameRegExp = new RegExp(
  '^[a-zA-Z-]+$', 'g');

  //on teste l'expression régulière
  let testFirstName = firstNameRegExp.test(inputFirstName.value);
  console.log(testFirstName);
  let small = inputFirstName.nextElementSibling; 

  if(testFirstName == true) {
      small.innerHTML = 'Saisie Prénom valide';
      small.classList.remove('text-danger');
      small.classList.add('text-succes');
      inputFirstName.style.border = "medium solid #74f774";
      return true;
  } else {
      small.innerHTML = 'Saisie Prénom non valide';
      small.classList.remove('text-succes');
      small.classList.add('text-danger');
      inputFirstName.style.border = "medium solid #f77474";
      return false;
  }
};

//    Vérification du Nom
let validLastName = function(inputLastName){
  // création de l'expression régulière pour la validation du prénom
let nameRegExp = new RegExp(
  '^[a-zA-Z-]+$', 'g');

  //on teste l'expression régulière
  let testNom = nameRegExp.test(inputLastName.value);
  console.log(testNom);
  let small = inputLastName.nextElementSibling; 

  if(testNom == true) {
      small.innerHTML = 'Saisie Nom valide';
      small.classList.remove('text-danger');
      small.classList.add('text-succes');
      inputLastName.style.border = "medium solid #74f774";
      return true;
  } else {
      small.innerHTML = 'Saisie Nom non valide';
      small.classList.remove('text-succes');
      small.classList.add('text-danger');
      inputLastName.style.border = "medium solid #f77474";
      return false;
  }
};

//    Vérification de l'adresse
let validAddress = function(inputAddress){
  // création de l'expression régulière pour la validation du prénom
let addressRegExp = new RegExp(
  '^[a-zA-Z0-9- ]+$', 'g');

  //on teste l'expression régulière
  let testAddress = addressRegExp.test(inputAddress.value);
  console.log(testAddress);
  let small = inputAddress.nextElementSibling; 

  if(testAddress == true) {
      small.innerHTML = 'Saisie Adresse valide';
      small.classList.remove('text-danger');
      small.classList.add('text-succes');
      inputAddress.style.border = "medium solid #74f774";
      return true;
  } else {
      small.innerHTML = 'Saisie Adresse non valide';
      small.classList.remove('text-succes');
      small.classList.add('text-danger');
      inputAddress.style.border = "medium solid #f77474";
      return false;
  }
};

//    Vérification de la ville
let validCity = function(inputCity){
  // création de l'expression régulière pour la validation du prénom
let cityRegExp = new RegExp(
  '^[a-zA-Z-]+$', 'g');

  //on teste l'expression régulière
  let testCity = cityRegExp.test(inputCity.value);
  console.log(testCity);
  let small = inputCity.nextElementSibling; 

  if(testCity == true) {
      small.innerHTML = 'Saisie Ville valide';
      small.classList.remove('text-danger');
      small.classList.add('text-succes');
      inputCity.style.border = "medium solid #74f774";
      return true;
  } else {
      small.innerHTML = 'Saisie Ville non valide';
      small.classList.remove('text-succes');
      small.classList.add('text-danger');
      inputCity.style.border = "medium solid #f77474";
      return false;
  }
};


// ***** Validation EMAIL *****
const validEmail= function(inputEmail){
  // création de l'expression régulière pour la validation de l'email
let emailRegExp = new RegExp(
  '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');

  //on teste l'expression régulière
  let testEmail = emailRegExp.test(inputEmail.value);
  let small = inputEmail.nextElementSibling; 

  if(testEmail == true) {
      small.innerHTML = 'Saisie Adresse mail valide';
      small.classList.remove('text-danger');
      small.classList.add('text-succes');
      inputEmail.style.border = "medium solid #74f774";
      return true;
  } else {
      small.innerHTML = 'Saisie Adresse mail non valide';
      small.classList.remove('text-succes');
      small.classList.add('text-danger');
      inputEmail.style.border = "medium solid #f77474";
      return false;
  }
};

// Création du client

boutonCommander.addEventListener("click", (e) => {
  e.preventDefault();

  if (validFirstName() && validLastName() && validCity() && validAddress() && validEmail()) {
    let contact = {
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value,
    };

    //localStorage.setItem("contact", JSON.stringify(contact));

    if (localStorage.products === undefined) {
      alert("Votre panier est vide, retrouvez nos produits sur la page d'Accueil");
      location.href = "./index.html";
    } else {
      PostAPI(contact, products);
    }
  } else {
    alert("Veuillez revoir la saisie du formulaire s'il vous plait");
    validFirstName();
    validLastName();
    validCity();
    validAddress();
    validEmail();
  }
});

// Envoi à l'API du client et des produits + récupération du numéro de commande
function PostAPI(contact, products) {
  fetch(
    `http://localhost:3000/api/products/order`,

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, products }),
    }
  )
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })

    .then(function (api) {
      location.href = `./confirmation.html?id=${api.orderId}`; // Redirige vers la page confirmation avec l'orderId pour pouvoir le récupérer sans le stocker
    })

    .catch(function (err) {
      alert("Nous sommes désolés mais une erreur s'est produite, nous n'avons pas pu finalier votre commande, veuillez réessayer plus tard");
      location.href = "./index.html";
    });
}
