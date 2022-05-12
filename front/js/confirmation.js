//Fonction pour récuperer le numéro de commande dans l'URL
 var orderId = document.location.href.substring(document.location.href.lastIndexOf("?")+9);
document.getElementById("orderId").innerText = orderId;