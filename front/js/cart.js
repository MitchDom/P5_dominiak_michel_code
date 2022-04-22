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
  