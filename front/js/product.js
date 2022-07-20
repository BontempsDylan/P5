
// définition des fonctions

// récupère un produit avec son id depuis l'API ✅    
function getProductFromAPI(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
        .then(function(res) {
            return res.json()
        })
        .then(function(product) {
            return product;
        })
        .catch(function(error) {
            alert("Nous sommes désolés, un problème est survenu sur nos serveurs, veuillez réessayer plys tard")
            return
        })
}

// récupération l'id du produit depuis l'URL qui a amené le user depuis la page d'accueil ✅
function getProductId() {
    return new URL(location.href).searchParams.get("id")        
}

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

    //intègration du lien de la page cart.html dans le button
    const buttonWrapper = document.getElementsByClassName('item__content__addButton')[0]
    const buttonCart = document.getElementById('addToCart')
    const removeChild = buttonWrapper.removeChild(buttonCart)
    const lienToCart = document.createElement('a')
    lienToCart.href = "cart.html"
    const newButton = document.createElement('button')
    newButton.id = 'addToCart'
    newButton.innerText = 'Ajouter au panier'
    buttonWrapper.appendChild(lienToCart)
    lienToCart.appendChild(newButton)
    
    

    /**objectif => pushing button to add dom's value in localStorage 
    *  objectif => get localstorage to view if have value
    */

    // name dom's values to pushed in localstorage
    addToCart.onclick = () => {
        const optionProduct = {
            image: img.src,
            nomProduit: productName,
            couleur: colorsWrapper.value,
            prix: productPrice,
            quantité: quantity.value,
            id: product._id, 
        }
        
       
        let productSavInLocalStorage = JSON.parse(localStorage.getItem("produit"));

        if(productSavInLocalStorage == null) { 
            productSavInLocalStorage = [];
            productSavInLocalStorage.push(optionProduct);
            localStorage.setItem("produit", JSON.stringify(productSavInLocalStorage));
            console.log(productSavInLocalStorage);                     
        }else {
            for (i = 0; i < productSavInLocalStorage.length; i++) {
                if(productSavInLocalStorage[i]._id == optionProduct._id && productSavInLocalStorage[i].couleur == colorsWrapper.value){
                    
                    return (
                        productSavInLocalStorage[i].quantité++,
                        
                        /* productSavInLocalStorage[i].quantité + quantity.value,
                        console.log(productSavInLocalStorage[i].quantité += quantity.value), */
                        localStorage.setItem("produit", JSON.stringify(productSavInLocalStorage))
                    )
                }else {
                    productSavInLocalStorage.push(optionProduct);
                    localStorage.setItem("produit", JSON.stringify(productSavInLocalStorage));
                }
                
            }
            
        }                            
    }
}


// utilisation des fonctions
window.addEventListener("DOMContentLoaded", async () => {

    const productId = getProductId();
    const product = await getProductFromAPI(productId);
    updateDisplayWithProduct(product);

});