function creationPanier() {
  // on récupère les articles choisis par le client et stockés dans le localStorage
  // dans le localStorage les données sont stockées en JSON, avec JSON.parse on les convertis en données JS
  let panier = JSON.parse(localStorage.getItem("articles"));
  // on crée une variable cartItems qui sera utilisée plus tard pour modifier les infos du HTML
  const cartItems = document.querySelector("#cart__items");
  cartItems.innerHTML = "";
  // redirection vers la page d'accueil si panier vide
  if (panier.length < 1) {
    document.location.href = "./index.html";
    alert("Votre panier est vide");
  }
  // pour le calcul du prix total et de la quantité

  // on choisit de faire une boucle : pour chaque canapé du panier
  for (let canape of panier) {
    console.log(canape);

    // on récupère les infos du canapé depuis l'API
    fetch(`http://localhost:3000/api/products/${canape.id}`)
      .then((response) => response.json())
      .then((data) => {
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
                      <p class="deleteItem" data-id="${canape.id}" data-color="${canape.couleur}" >Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
                `;
        // on appelle la fonction de calcul du prix total après chaque boucle de canapé puisque JS est asynchrone
        calculPriceOneCanape();
        // on appelle la fonction suppression article
        supprimerProduit();

        // on appelle la fonction pour le changement de quantité dans le panier
        changerQuantite();
      });
  }
};

// calcul du prix total et quantité
// on crée une fonction
calculPriceOneCanape = function () {
  // puis les variables qui vont varier dans le HTML en fonction de la quantité et du prix
  const allCanapes = document.querySelectorAll("article");
  const spanQuantity = document.querySelector("#totalQuantity");
  const spanPrice = document.querySelector("#totalPrice");

  // au démarrage, la valeur du panier tant en quantité qu'en prix est égale à 0
  let total = 0;
  let nbeArticles = 0;

  // on boucle
  for (let canape of allCanapes) {
    // on crée les variables qui vont servir à calculer les totaux
    // parseInt permet de convertir une chaine de caracrtère en nombres
    let quantity = parseInt(canape.querySelector(".itemQuantity").value);
   if (quantity < 1) {
      document.querySelector(".cart__order__form").style.display = "none";
    } else {
      document.querySelector(".cart__order__form").style.display = "block";
    }
   
    if (quantity < 1) {
      document.querySelector(".cart__order__form").style.display = "none";
    } else {
      document.querySelector(".cart__order__form").style.display = "block";
    }
    if (quantity < 1) {
      canape.querySelector(".itemQuantity").value = 0;
      total = 0;
      /*document.querySelector("data.price").value = 1;*/
      return alert("Veuillez indiquer une quantité > 0 !");
    }
    
    // comme on a ajouté la propriété data-price dans le HTML, dataset permet d'aller rechercher cette propriété
    let price = canape.dataset.price;
    total = total + quantity * price;
    nbeArticles = nbeArticles + quantity;
  }

  // on affiche au panier la quantité totale et le prix total
  spanQuantity.textContent = nbeArticles;
  spanPrice.textContent = total;
};

// Fonction pour supprimer un article

function supprimerProduit() {
  const suppressionArticle = document.querySelectorAll(".deleteItem");

  for (let i = 0; i < suppressionArticle.length; i++) {
    suppressionArticle[i].addEventListener("click", (event) => {
      // j'isole l'id et la couleur des canapés à supprimer
      // en même temps j'isole l'élément parent
      let parent = event.target.closest(".cart__item");
      // je créé les variables sur les informations que je souhaite récupérer : l'id et la couleur des canapés à supprimer
      let id = parent.dataset.id;
      let color = parent.dataset.color;
      // pour supprimer un article je regarde dans le panier si un article a cet id et cette couleur : si oui, je le supprime, sinon il reste dans le panier
      // j'appelle le panier
      let panier = JSON.parse(localStorage.getItem("articles"));
      console.log(panier);
      // je redéfinis le panier
      // avec la fonction filter je définis les conditions de suppression de l'article : je filtre l'ancien panier, ne garde que le canape si canape.id est différent de l'id ou que la couler du canapé soit différente de la couleur
      let newPanier = panier.filter(
        (canape) => canape.id !== id || canape.couleur !== color
      );

      // je sauvegarde dans le localStorage
      localStorage.setItem("articles", JSON.stringify(newPanier));
      parent.remove();
      creationPanier();
      console.log(newPanier);
      //console.log(parent.dataset)
      console.log(parent.dataset.id);
      console.log(parent.dataset.color);
      return;
    });
  }
}
//Fonction pour changer la quantité d'un article
function changerQuantite() {
  let selectionQuantite = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < selectionQuantite.length; i++) {
    selectionQuantite[i].addEventListener("change", (event) => {
      event.preventDefault();
      let parent = event.target.closest(".cart__item");
      let panier = JSON.parse(localStorage.getItem("articles"));

      let articleQuantite = event.target.value;
      let nouveauCanape = {
        id: parent.dataset.id,
        quantité: articleQuantite,
        couleur: parent.dataset.color,
      };
      let newPanier = panier.filter(
        (canape) =>
          canape.id !== parent.dataset.id ||
          canape.couleur !== parent.dataset.color
      );
      newPanier.push(nouveauCanape);
      localStorage.clear();
      localStorage.setItem("articles", JSON.stringify(newPanier));
      creationPanier();
    });
  }
};
// remplissage du formulaire //

// sélection du bouton 'commander' repéré sur cart.html par l'id "order" //
const boutonCommander = document.querySelector("#order");
const form = document.querySelector(".cart__order__form");

// écouter la modification du prénom
form.firstName.addEventListener("change", function () {
  validFirstName(this);
});

// écouter la modification du nom
form.lastName.addEventListener("change", function () {
  validLastName(this);
  console.log(this);
});

// écouter la modification de l'adresse
form.address.addEventListener("change", function () {
  validAddress(this);
});

// écouter la modification de la ville
form.city.addEventListener("change", function () {
  validCity(this);
});

// écouter la modification de l'email
form.email.addEventListener("change", function () {
  validEmail(this);
});

// écouter la soumission du formulaire
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    validFirstName(form.firstName) &&
    validLastName(form.lastName) &&
    validAddress(form.address) &&
    validCity(form.city) &&
    validEmail(form.email)
  ) {
    form.submit();
  }
});

// Validation des entrées création des RegExp

// Vérification du prénom
const validFirstName = function (inputFirstName) {
  // création de l'expression régulière pour la validation du prénom
  const firstNameRegExp = new RegExp("^[a-zA-Z-]+$", "g");

  //on teste l'expression régulière
  const testFirstName = firstNameRegExp.test(inputFirstName.value);
  console.log(testFirstName);
  const small = inputFirstName.nextElementSibling;

  if (testFirstName === true) {
    small.innerHTML = "Saisie Prénom valide";
    small.classList.remove("text-danger");
    small.classList.add("text-succes");
    inputFirstName.style.border = "medium solid #74f774";
    return true;
  } else {
    small.innerHTML = "Saisie Prénom non valide";
    small.classList.remove("text-succes");
    small.classList.add("text-danger");
    inputFirstName.style.border = "medium solid #f77474";
    return false;
  }
};

// Vérification du Nom
const validLastName = function (inputLastName) {
  // création de l'expression régulière pour la validation du prénom
  const lastNameRegExp = new RegExp("^[a-zA-Z-]+$", "g");

  //on teste l'expression régulière
  const testLastName = lastNameRegExp.test(inputLastName.value);
  console.log(testLastName);
  const small = inputLastName.nextElementSibling;

  if (testLastName === true) {
    small.innerHTML = "Saisie Nom valide";
    small.classList.remove("text-danger");
    small.classList.add("text-succes");
    inputLastName.style.border = "medium solid #74f774";
    return true;
  } else {
    small.innerHTML = "Saisie Nom non valide";
    small.classList.remove("text-succes");
    small.classList.add("text-danger");
    inputLastName.style.border = "medium solid #f77474";
    return false;
  }
};

// Vérification de l'adresse
const validAddress = function (inputAddress) {
  // création de l'expression régulière pour la validation du prénom
  const addressRegExp = new RegExp("^[a-zA-Z0-9-°, ]+$", "g");

  //on teste l'expression régulière
  const testAddress = addressRegExp.test(inputAddress.value);
  console.log(testAddress);
  const small = inputAddress.nextElementSibling;

  if (testAddress === true) {
    small.innerHTML = "Saisie Adresse valide";
    small.classList.remove("text-danger");
    small.classList.add("text-succes");
    inputAddress.style.border = "medium solid #74f774";
    return true;
  } else {
    small.innerHTML = "Saisie Adresse non valide";
    small.classList.remove("text-succes");
    small.classList.add("text-danger");
    inputAddress.style.border = "medium solid #f77474";
    return false;
  }
};

// Vérification de la ville
const validCity = function (inputCity) {
  // création de l'expression régulière pour la validation du prénom
  const cityRegExp = new RegExp("^[a-zA-Z-]+$", "g");

  //on teste l'expression régulière
  const testCity = cityRegExp.test(inputCity.value);
  console.log(testCity);
  const small = inputCity.nextElementSibling;

  if (testCity === true) {
    small.innerHTML = "Saisie Ville valide";
    small.classList.remove("text-danger");
    small.classList.add("text-succes");
    inputCity.style.border = "medium solid #74f774";
    return true;
  } else {
    small.innerHTML = "Saisie Ville non valide";
    small.classList.remove("text-succes");
    small.classList.add("text-danger");
    inputCity.style.border = "medium solid #f77474";
    return false;
  }
};

// Vérification de l'email
const validEmail = function (inputEmail) {
  // création de l'expression régulière pour la validation de l'email
  const emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );

  //on teste l'expression régulière
  const testEmail = emailRegExp.test(inputEmail.value);
  const small = inputEmail.nextElementSibling;

  if (testEmail === true) {
    small.innerHTML = "Saisie Adresse mail valide";
    small.classList.remove("text-danger");
    small.classList.add("text-succes");
    inputEmail.style.border = "medium solid #74f774";
    return true;
  } else {
    small.innerHTML = "Saisie Adresse mail non valide";
    small.classList.remove("text-succes");
    small.classList.add("text-danger");
    inputEmail.style.border = "medium solid #f77474";
    return false;
  }
};

//Fonction pour finaliser la commande
function validerCommande() {
  let panier = JSON.parse(localStorage.getItem("articles"));
  const boutonCommande = document.getElementById("order");
  boutonCommande.addEventListener("click", (event) => {
    event.preventDefault();
    //Si le formulaire ne comporte aucune erreur
    if (
      validFirstName(form.firstName) &&
      validLastName(form.lastName) &&
      validAddress(form.address) &&
      validCity(form.city) &&
      validEmail(form.email)
    ) {
      //Création d'un tableau de produits
      const produits = [];
      for (let i = 0; i < panier.length; i++) {
        produits.push(panier[i].id);
      }
      if (produits.length < 1) {
        return alert("Votre panier est vide !")
      }
      //Création d'un objet contact à partir des données du formulaire
      const objetContact = {
        contact: {
          firstName: form.firstName.value,
          lastName: form.lastName.value,
          address: form.address.value,
          city: form.city.value,
          email: form.email.value,
        },
        products: produits,
      };
      //Requete POST pour envoyer les données à l'API et récupérer l'identifiant de commande
      const post = {
        method: "POST",
        body: JSON.stringify(objetContact),
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch("http://localhost:3000/api/products/order", post)
        .then((response) => response.json())
        .then((data) => {
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);
          document.location.href = "./confirmation.html?id=" + data.orderId;
        })
        .catch((erreur) => alert("Une erreur est survenue"));
    } else {
      alert("Le formulaire comporte des erreurs");
    }
  });
};
creationPanier();
validerCommande();
