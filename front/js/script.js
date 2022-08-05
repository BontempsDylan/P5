
// TODO research => you can use "load" or "DOMContentLoaded" events
window.addEventListener("DOMContentLoaded", async () => {

    let products;
    try {
        // get products data from API ✅
        const APICall = await fetch('http://localhost:3000/api/products');
        products = await APICall.json();
    } catch (error) {
        alert("Nous sommes désolés, un problème est survenu sur nos serveurs, veuillez réessayer plys tard");
        return;
    }

    /**
     * Objective => display these products in the DOM ✅
     * 
     * ⁉️  the problem  => we have several products but only one example article in the HTML
     * ✨ the solution => create article markup for each product
     */
    // console.log(products);
    const itemsWrapperSection = document.getElementById('items');
    products.forEach(product => {
        // itemsWrapperSection.innerText = `<p>test</p>`;
        const itemWrapper = document.createElement("a");
        itemWrapper.setAttribute("href", "./product.html?id=" + product._id)
        itemWrapper.innerHTML += `<article>
            <img src="${product.imageUrl}" alt="${product.description}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>`;
        itemsWrapperSection.appendChild(itemWrapper);
    });
    
});




    