// TODO update this code based on how product changed in local storage


  /*
   *  retrieve user's localStorage✅
   */
  const productSavInLocalStorage = JSON.parse(localStorage.getItem("cart"));
  

  /*
  * create html for all products with all values in the localStorage.✅
  */
  productSavInLocalStorage.forEach(article => {
    const productWrapper = document.getElementById('cart__items')
      
      const product = document.createElement('div')
      product.innerHTML = `<article class="cart__item" data-id="${article.id} " data-color="${article.color}">
      <div class="cart__item__img">
        <img src="${article.img} " alt="Photographie d'un canapé">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>${article.color}</p>
          <p>${article.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
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
          productQuantity = `${productSavInLocalStorage[i].quantity}`;
        } else {
          productSavInLocalStorage.map((obj) => {
            if ((obj.id == productSavInLocalStorage[i].id, obj.color == productSavInLocalStorage[i].color)) {
              obj.quantity = parseInt(productQuantity);
            }
          });
          localStorage.setItem("cart", JSON.stringify(productSavInLocalStorage));
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
          localStorage.setItem("cart", JSON.stringify(productSavInLocalStorage));
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
        totalCartPrice += parseInt(itemStorage.quantity) * parseInt(itemStorage.price); 
        totalCartQty += parseInt(itemStorage.quantity);
      }
    }
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerText = totalCartQty;
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = totalCartPrice;
  };

  /*
   * Displays an error message if there is incorrect 
   */

  function showErrorMsg(errorId, nameField) {
    let errorContainer = document.getElementById(`${errorId}`);
    errorContainer.setAttribute("style", "color:#000000")
    errorContainer.innerHTML = `${nameField} est invalide !`;
  }

  const globalRegex = new RegExp("^[A-Za-zéèêëàâîïôöûü-]+$");
  

  /*
   * objectif => chech the first name onput by user matches with the defined regex
   */

  function verifyFirstName(prenom) {
    let fieldIsCorrect = false;
    if (globalRegex.test(prenom)) {
      fieldIsCorrect = true;
    } else {
      showErrorMsg("firstNameErrorMsg", "Prénom");
    }
    return fieldIsCorrect;
  }

  /*
   * objectif => chech the last name onput by user matches with the defined regex
   */

  function verifyLastName(nom) {
    let fieldIsCorrect = false;
    if (globalRegex.test(nom)) {
      fieldIsCorrect = true;
    } else {
      showErrorMsg("lastNameErrorMsg", "Nom");
    }
    return fieldIsCorrect;
  }

  /*
   * objectif => chech the adress onput by user matches with the defined regex
   */

  function verifyAddress(adresse) {
    let fieldIsCorrect = false;
    const adresseRegex = new RegExp(
      "([0-9]*)?([a-zA-Z]*)"
    );
    if (adresseRegex.test(adresse)) {
      fieldIsCorrect = true;
    } else {
      showErrorMsg("addressErrorMsg", "Adresse");
    }
    return fieldIsCorrect;
  }

  /*
   * objectif => chech the city onput by user matches with the defined regex
   */

  function verifyCity(ville) {
    let fieldIsCorrect = false;
    if (globalRegex.test(ville)) {
      fieldIsCorrect = true;
    } else {
      showErrorMsg("cityErrorMsg", "Ville");
    }
    return fieldIsCorrect;
  }

  /*
   * objectif => chech the email onput by user matches with the defined regex
   */

  function verifyEmail(email) {
    let fieldIsCorrect = false;
    if (
      email.match(
        /[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,24}/
      )
    ) {
      fieldIsCorrect = true;
    } else {
      showErrorMsg("emailErrorMsg", "Email");
    }
    return fieldIsCorrect;
  }
  
  function sendRequestToApi(body) {
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status == 201) {
          return response.json();
        } else {
          console.error("une erreur est survenue lors de la commande");
        }
      })
      .then((order) => {
        localStorage.clear();
        id = order.orderId;
        window.location.href = `confirmation.html?id=${id}`;
      });
  }
  
  
  
  addEventListener("submit", function (e) {
    e.preventDefault();
    let prenom = e.target.firstName.value;
    let nom = e.target.lastName.value;
    let adresse = e.target.address.value;
    let ville = e.target.city.value;
    let email = e.target.email.value;
    if (
      verifyFirstName(prenom) &&
      verifyLastName(nom) &&
      verifyAddress(adresse) &&
      verifyCity(ville) &&
      verifyEmail(email)
    ) {
      sendRequestToApi(createBodyRequest(prenom, nom, adresse, ville, email));
    } else {
      console.error("Tous les champs ne sont pas correctement remplis");
    }
  });

  function createBodyRequest(prenom, nom, adresse, ville, mail) {
    let idProducts = [];
    for (let i = 0; i < productSavInLocalStorage.length; i++) {
      idProducts.push(productSavInLocalStorage[i].id);     
    }
    const bodyContent = {
      contact: {
        firstName: prenom,
        lastName: nom,
        address: adresse,
        city: ville,
        email: mail,
      },
      products: idProducts,
    };
    return bodyContent;
    
  }

  
  
  
  

    
  window.addEventListener("DOMContentLoaded", async () => {
  totalRefresh();
  
  

});