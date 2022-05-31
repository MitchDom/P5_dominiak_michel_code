//Récupération des paramètres d'URL
const url = new URL(window.location.href);
//Récupération de l'id du produit
const requeteId = url.searchParams.get("id");
console.log(requeteId);

//Récupération des détails du produit depuis l'API
fetch(`http://localhost:3000/api/products/${requeteId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    //Ajout des détails dans la page produit
    function ajoutProduit() {
      document.querySelector(
        ".item__img"
      ).innerHTML = `<img  id="image" src="${data.imageUrl}" alt="${data.altTxt}">`;
      document.getElementById(
        "title"
      ).innerHTML = `<h1 id="title">${data.name}</h1>`;
      document.getElementById(
        "price"
      ).innerHTML = `<span id="price">${data.price}</span>`;
      document.getElementById(
        "description"
      ).innerHTML = `<p id="description">${data.description}</p>`;
      const couleurs = data.colors;
      //Boucle pour parcourir les differentes couleurs
      function ajoutCouleurs() {
        for (let couleur of couleurs) {
          document.getElementById(
            "colors"
          ).innerHTML += `<option value="${couleur}">${couleur}</option>`;
        }
      }
      ajoutCouleurs();
    }
    ajoutProduit();
  });

// ajout au panier

//Ecouter l'évènement au clic
const ajoutPanier = document.getElementById("addToCart");
ajoutPanier.addEventListener("click", (event) => {
  event.preventDefault();

  //Je créé un objet à ajouter au panier
  const quantite = document.getElementById("quantity").value;
  const choixCouleur = document.getElementById("colors").value;

  if (parseInt(quantite) === 0 || choixCouleur === "") {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  let produitsPanier = {
    id: requeteId,
    quantité: quantite,
    couleur: choixCouleur,
  };

  //J'initialise le Local Storage
  let ajoutProduitStorage = JSON.parse(localStorage.getItem("articles"));

  //Je fais apparaître une fenêtre de confirmation
  let fenetreConfirmation = () => {
    if (
      window.confirm(
        "Votre article a bien été ajouté au panier, pour consulter votre panier cliquer sur OK"
      )
    ) {
      window.location.href = "cart.html";
    }
  };

  // S'il y a des articles dans le panier
  if (ajoutProduitStorage) {
    let panierTrouvé = ajoutProduitStorage.find(
      (article) => article.id === requeteId && article.couleur === choixCouleur
    );

    // J'incrémente la quantité du même produit au panier
    if (panierTrouvé) {
      panierTrouvé.quantité =
        parseInt(produitsPanier.quantité) + parseInt(panierTrouvé.quantité);
    }

    //Si le produit ajouté au panier n'est pas déjà dans le panier
    else {
      ajoutProduitStorage.push(produitsPanier);
    }
    localStorage.setItem("articles", JSON.stringify(ajoutProduitStorage));
    fenetreConfirmation();
  }

  //Si panier vide
  else {
    ajoutProduitStorage = [];
    ajoutProduitStorage.push(produitsPanier);
    localStorage.setItem("articles", JSON.stringify(ajoutProduitStorage));
    fenetreConfirmation();
  }
});
