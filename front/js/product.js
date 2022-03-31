//  Je récupère l'id via les paramètres de l'url
const idProduct = new URL(window.location.href).searchParams.get("id");

//J'isole les sélecteurs en prévision des futures modifications
let titleProduct = document.getElementById("title");
let priceProduct = document.getElementById("price");
let descriptionProduct = document.getElementById("description");
let colorsProduct = document.getElementById("colors");
let imgProduct = document.querySelector(".item__img img");

//  Je récupère l'article grâce à son id et j'affiche les données de ce dernier
getArticle();

async function getArticle() {
     await fetch("http://localhost:3000/api/products/" + idProduct)
    .then((response) => response.json())    
    .then(product => {
        imgProduct.setAttribute("src", product.imageUrl);
        imgProduct.setAttribute("alt", product.altTxt);    
        titleProduct.innerText = product.name;
        priceProduct.innerText = product.price;
        descriptionProduct.innerText = product.description;
        document.title = product.name;

        //  Je créé un menu déroulant pour les couleurs
        for (let i=0; i < product.colors.length; i++) {
            let color = document.createElement("option");
            color.setAttribute("value", product.colors[i]);
            color.innerHTML = product.colors[i];
            colorsProduct.appendChild(color);
        } 
    });          
}

// ajout au panier

function addToCart(articles) {
    //Définition des champs à renseigner
  
    const addBtn = document.getElementById("addToCart");
    const quantity = document.getElementById("quantity");
    const color = document.getElementById("colors");
  
    // Au clic, l'évènement s'effectue si les champs sont renseignés
  
    addBtn.addEventListener("click", () => {
      if (color.value !== "" && quantity.value != 0 && quantity.value <= 100) {
        //Si les champs sont renseignés : stockage des données dans des variables
  
        let userProductId = productId;
        let userProductColor = color.value;
        let userProductQty = quantity.value;
  
        // Création d'un objet produit
  
        let userProductArray = {
          userProductId: userProductId,
          userProductColor: userProductColor,
          userProductQty: userProductQty,
        };
  
        // Mise à disposition du localStorage si existant
  
        let productLocalStorage = JSON.parse(
          localStorage.getItem("userProducts")
        );
  
        // Comportement si il n'y a pas de localStorage (il n'a ni valeur ni type défini : donc null)
  
        if (productLocalStorage == null) {
          productLocalStorage = [];
          productLocalStorage.push(userProductArray);
          localStorage.setItem(
            "userProducts",
            JSON.stringify(productLocalStorage)
          );
        } else {
          // Comportement si il existe des données dans le localStorage
  
          // Condition si le produit comporte le même Id et la même couleur. Méthode find dans le localStorage et comparaison avec les valeurs de l'objet userProductArray
  
          let mappingProducts = productLocalStorage.find(
            (el) =>
              el.userProductId === userProductId &&
              el.userProductColor === userProductColor
          );
  
          // Si la condition est vraie on additionne la quantité de l'objet du localStorage qui répond à la condition avec celle de la page en cours et on renvoie le tout au localStorage
  
          if (mappingProducts) {
            // On incrémente la quantité
  
            newQty =
              parseInt(mappingProducts.userProductQty) + parseInt(userProductQty);
            mappingProducts.userProductQty = newQty;
  
            // On l'enregistre dans le localStorage
  
            localStorage.setItem(
              "userProducts",
              JSON.stringify(productLocalStorage)
            );
          } else {
            // Dans tous les autres cas, on enregistre un nouvel objet dans le localStorage
  
            productLocalStorage.push(userProductArray);
            localStorage.setItem(
              "userProducts",
              JSON.stringify(productLocalStorage)
            );
          }
        }
  
        //Fin des conditions pour le localStorage
      } else {
        alert(
          "Veuillez renseigner la couleur et la quantité (max: 100) du produit sélectionné"
        );
      }
    });
  }
  