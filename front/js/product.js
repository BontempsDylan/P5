
// définition des fonctions

// récupère un produit avec son id depuis l'API ✅    
function getProductFromAPI(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(function(res) {
            return res.json()
        })
} 

function getProductData(product) {
     if (product._id == undefined) {
        window.alert("L'objet séléctionné n'existe pas, retourner a l'accueil pour en choisir un autre");  
    }else{
        return getProductFromAPI();
    }
  };
  

/**
 * Objective => display these products in the DOM ✅
 * 
 * ⁉️ probleme => beaucoup de couleur mais qu'une seule <option> sur l'html
 * ✨ solution => créer une <option> pour chaque couleur sans que le code ne se répéte.
 */
function updateDisplayWithProduct(product) {
    const imageWrapperDiv = document.querySelector('.item__img');
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.description;
    imageWrapperDiv.appendChild(img);
    document.title = product.name
    const productName = document.getElementById('title').innerText = product.name;
    const productPrice = document.getElementById('price').innerText = product.price;
    document.getElementById('description').innerText = product.description;
    const colors = product.colors;
    const colorsWrapper = document.getElementById('colors');
    colors.forEach(color => {
        const colorOption = document.createElement('option');
        colorOption.value = color;
        colorOption.innerText = color;
        colorsWrapper.appendChild(colorOption);
    });  
    console.log(product._id); 
}

function validateUserInput(product, quantitySelected, selectedColor) {
    let validated = true;
    // input validation
    if (!product.colors.includes(selectedColor)) {
        window.alert("La couleur sélectionnée n'est pas valide");
        validated = false;
    }
    if (quantitySelected <= 0) {
        window.alert("Vous devez sélectionner au moins un produit");
        validated = false;
    }
    if (quantitySelected > 100) {
        window.alert("Waouh, vous aimez beaucoup nos canapés ! Merci, mais nous ne pouvons vous en fournir plus de cent à la fois :)");
        validated = false;
    }
    return validated;
}

/**
 * if a given product already exists in the products array,
 * we update its quantity by adding the quantity of this product selected by the user
 */
function addQuantityToExistingProduct(products, selectedProduct) {
    const previouslySelectedProduct = products.find(product => product.id == selectedProduct.id && product.color == selectedProduct.color);
    const previouslySelectedProductIdx = products.findIndex(product => product.id == selectedProduct.id && product.color == selectedProduct.color);
    if (previouslySelectedProduct != undefined) {
        previouslySelectedProduct.quantity += selectedProduct.quantity;
        products[previouslySelectedProductIdx] = previouslySelectedProduct;
    }
    return products;
}

function addProductToCartIfNotExists(products, selectedProduct) {
    const previouslySelectedProduct = products.find(product => product.id == selectedProduct.id && product.color == selectedProduct.color);
    if (previouslySelectedProduct == undefined) {
        products.push(selectedProduct);
    }
    return products;
}

function addProductToLocalStorage(product) {
    // on récupère l'input utilisateur
    const quantitySelected = parseInt(document.getElementById("quantity").value);
    const selectedColor = document.getElementById('colors').value;
    if (!validateUserInput(product, quantitySelected, selectedColor)) {
        return; // on n'exécute pas le reste du code si l'input utilisateur n'est pas valide
    }
    const selectedProduct = {
        id: product._id, 
        quantity: quantitySelected,
        color: selectedColor,
        name: product.name,
        
        img: product.imageUrl,
    }
    // objective => check if product already in local storage
    const localStorageCart = localStorage.getItem("cart");
    let cart = [];
    if (localStorageCart != null) {
        cart = JSON.parse(localStorageCart);
        cart = addQuantityToExistingProduct(cart, selectedProduct);
        cart = addProductToCartIfNotExists(cart, selectedProduct);
    } else {
        cart.push(selectedProduct);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Produit ajouté");
}

function addProductEventListener(product) {
    const addToCartBtn = document.getElementById("addToCart");
    addToCartBtn.addEventListener("click", () => {
        addProductToLocalStorage(product);
    });                                                                       
}


// utilisation des fonctions dès que la page est chargée
window.addEventListener("DOMContentLoaded", async () => {

    // récupération l'id du produit depuis l'URL qui a amené le user depuis la page d'accueil ✅
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");       
    
    // récupération du produit depuis l'API
    const product = await getProductFromAPI(id);

    getProductData(product)

    // affichage du produit
    updateDisplayWithProduct(product);

    // event listener
    addProductEventListener(product);

});