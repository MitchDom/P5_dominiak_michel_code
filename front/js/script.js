//je créé la fonction pour récupérer les informations sur les produits canapés dans l'API
function get() {
  fetch("http://localhost:3000/api/products") // par la fonction fetch get j'indique l'adresse http où sont regroupées les infos sur les produits et à laquelle l'API ira pour me retourner ces infos. Ce code nous permet d'envoyer une requête HTTP de type GET au service web se trouvant à cette adresse http://localhost:3000/api/products. Enfin, Fetch me renvoie une Promise = objet qui fournit une fonction then qui sera exécutée quand le résultat est obtenu
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (products) {
      console.log(products); //je créé la fonction products
      for (let product of products) {
        console.log(product);
        console.log(product.price);
        console.log(product.imageUrl);
        if (product.price > 2000) {
          console.log(product.names);
        } // qui, pour chaque product de ma liste de products,
        let container = document.getElementById("items"); // en créant ma variable container, va remplacer dans ma page index.html les div ayant pour class "items" le code HTML par le suivant :
        container.innerHTML += `<a href="./product.html?id=${product._id}">
                <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
                </article>
              </a>
                `;
        continue;
      }
    })
    .catch(function (err) {
      // fonction catch appelée s'il y a une erreur lors de la requête
      // une erreur est survenue
    });
}
get();
