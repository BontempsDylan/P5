window.addEventListener("DOMContentLoaded", async () => {

  const productSavInLocalStorage = JSON.parse(localStorage.getItem("produit"));


  productSavInLocalStorage.forEach(article => {
    const productWrapper = document.getElementById('cart__items')
      
      const product = document.createElement('div')
      product.innerHTML = `<article class="cart__item" data-id="${article.id} " data-color="${article.couleur}">
      <div class="cart__item__img">
        <img src="${article.image} " alt="Photographie d'un canapé">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.nomProduit}</h2>
          <p>${article.couleur}</p>
          <p>${article.prix} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantité}">
          </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
      </div>
    </article>` 
    productWrapper.appendChild(product)

    var removeItemButtons = document.getElementsByClassName('deleteItem')
    
    for (var i = 0; i < removeItemButtons.length; i++){
      var button = removeItemButtons[i]  
      button.addEventListener('click', function() {
          var buttonClicked = Event.target
          buttonClicked.parentElement.parentElement.parentElement.remove()
      })  
    }
    /* deleteItem.onclick = () => {
      localStorage.removeItem('produit');
    } */
      
  })

  

});