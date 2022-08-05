/*
  *  retrieve user's localStorage✅
  */
const productSavInLocalStorage = JSON.parse(localStorage.getItem("cart"));

const globalRegex = new RegExp("^[A-Za-zéèêëàâîïôöûü-]+$");

/*
 * Retrieves product data from the api
 */
async function retrieveProductData(id) {
  try {
    const APICall = await fetch(`http://localhost:3000/api/products/${id}`);
    const res = await APICall.json();
    return res;
  } catch(error) {
    console.error(error);
    return undefined;
  }
}

async function retrieveProductsData() {
  // this array will hold all our calls to get products data
  const APICallsArray = [];
  productSavInLocalStorage.forEach(product => {
    APICallsArray.push(retrieveProductData(product.id));
  });
  const productsData = await Promise.all(APICallsArray);
  return productsData;
}
  
/*
* create html for all products with all values in the localStorage.✅
*/
const createProductsCards = async () => {
  const productsData = await retrieveProductsData();
  for (let i = 0; i < productsData.length; i++) {
    let product = productsData[i];
    let productFromLocalStorage = productSavInLocalStorage[i];
    const productWrapper = document.getElementById('cart__items')  
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `<article class="cart__item" data-id="${productFromLocalStorage.id} " data-color="${productFromLocalStorage.color}">
      <div class="cart__item__img">
        <img src="${productFromLocalStorage.img} " alt="Photographie d'un canapé">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${productFromLocalStorage.name}</h2>
          <p>${productFromLocalStorage.color}</p>
          <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productFromLocalStorage.quantity}">
          </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
      </div>
    </article>`;
    productWrapper.appendChild(productDiv);
  }
}

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
  const productsData = await retrieveProductsData();
  if (localStorage.length != 0) {
    for (let i = 0; i < productsData.length; i++) {
      const itemAPI = productsData[i];
      const itemStorage = productSavInLocalStorage[i];
      totalCartPrice += parseInt(itemStorage.quantity) * parseInt(itemAPI.price); 
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
  
/*
  * Sends a request to the api containing all the information entered and redirects to the confirmation
  */
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
  
  
/*
  * Listen to the submit event then check the form fields and run the confirmation procedure
  */
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

/*
  * Create the send object in the body of the request
  */
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
  await createProductsCards();
  await totalRefresh();
});