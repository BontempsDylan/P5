// TODO update this code based on how product changed in local storage

window.addEventListener("DOMContentLoaded", async () => {
  /*
   *  retrieve user's localStorage✅
   */
  const productSavInLocalStorage = JSON.parse(localStorage.getItem("produit"));

  async function retrieveProductData(id) {
    return (await fetch(`http://localhost:3000/api/products/${id}`)).json();
  }
  

  const getProductData = async (id) => {
    try {
      return retrieveProductData(id);
    } catch {
      console.error("Erreur lors de la récupération des données du produit");
    }
  };
  

  /*
  * create html for all products with all values in the localStorage.✅
  */
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
  })

  /*
  * objectif => When changing input value on the page, 
  * then update its quantity.✅
  */

  addEventListener("input", function () {
    
    let quantitySelector = document.getElementsByClassName("itemQuantity")
    for (let i = 0; i < quantitySelector.length; i++) {
      quantitySelector[i].addEventListener("change", (e) => {
        let productQuantity = e.target.value;
        if (productQuantity == 0 || productQuantity >= 100) {
          window.alert("La quantité doit être comprise entre 1 et 100");
          productQuantity = `${productSavInLocalStorage[i].quantité}`;
        } else {
          productSavInLocalStorage.map((obj) => {
            if ((obj.id == productSavInLocalStorage[i].id, obj.couleur == productSavInLocalStorage[i].couleur)) {
              obj.quantité = parseInt(productQuantity);
            }
          });
          localStorage.setItem("produit", JSON.stringify(productSavInLocalStorage));
          console.log("Quantité mise à jour");
          location.reload()
        }
      });
    }
  });

 /*
 * objectif => when pushing button supprimer remove 
 * article html and the sav of the product in the localStorage✅ 
 */

  window.onload = () => {
    let productDeleted = document.getElementsByClassName("deleteItem");
    for (let i = 0; i < productDeleted.length; i++) {
      productDeleted[i].addEventListener("click", (e) => {
        let articleDOM = productDeleted[i].closest("article");
        const productToClear = productSavInLocalStorage.indexOf(productSavInLocalStorage[i]);
        productSavInLocalStorage.splice(productToClear, 1);
        articleDOM.remove();
        if (localStorage != undefined) {
          localStorage.setItem("produit", JSON.stringify(productSavInLocalStorage));
        } else {
          localStorage.clear();
        }
        totalRefresh();
        console.log("Produit supprimé du panier");
        location.reload()
      });
    }
  };


  /*
  * objectif => view a total articles and total price. when delete a product 
  * udapte the total articles an total price with the new total.✅
  */
  
  const totalRefresh = async () => {
    let totalCartPrice = 0;
    let totalCartQty = 0;
    if (localStorage.length != 0) {
      for (let i = 0; i < productSavInLocalStorage.length; i++) {
        let itemStorage = productSavInLocalStorage[i];
        totalCartPrice += parseInt(itemStorage.quantité) * parseInt(itemStorage.prix); 
        totalCartQty += parseInt(itemStorage.quantité);
      }
    }
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerText = totalCartQty;
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = totalCartPrice;
  };
  totalRefresh();
  
  /*
   * objectif => chech the name onput by user
   */

  /* function verifyFirstName(prenom) {

    
  } */

});