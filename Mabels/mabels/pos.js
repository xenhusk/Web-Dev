import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD06oBCeHTLPHaiFhjXkcW2wkYDSeaqeIU",
    authDomain: "mabelsfinals.firebaseapp.com",
    databaseURL: "https://mabelsfinals-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mabelsfinals",
    storageBucket: "mabelsfinals.appspot.com",
    messagingSenderId: "244365475303",
    appId: "1:244365475303:web:cb85cfd90ddc45cb9a9142",
    measurementId: "G-3SRF65B8ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let cart = [];

// Fetch products and display them
async function fetchProducts() {
    const productList = document.getElementById("productList");
    const querySnapshot = await getDocs(collection(db, "Menu"));
    const products = [];

    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
    });

    // Sort products alphabetically by item name
    products.sort((a, b) => a.item.localeCompare(b.item));

    productList.innerHTML = ''; // Clear existing products

    products.forEach((product) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <strong>${product.item}</strong><br>
            Price: ₱${product.price}.00<br>
            <button onclick="addToCart('${product.id}', '${product.item}', ${product.price})">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

fetchProducts();

document.getElementById('searchBar').addEventListener('input', function (event) {
    const searchQuery = event.target.value.toLowerCase();
    filterProducts(searchQuery);
});

async function filterProducts(query) {
    const productList = document.getElementById("productList");
    const querySnapshot = await getDocs(collection(db, "Menu"));
    const products = [];

    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
    });

    // Sort products alphabetically by item name
    products.sort((a, b) => a.item.localeCompare(b.item));

    // Filter products based on the search query
    const filteredProducts = products.filter(product =>
        product.item.toLowerCase().includes(query)
    );

    productList.innerHTML = ''; // Clear existing products

    filteredProducts.forEach((product) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <strong>${product.item}</strong><br>
            Price: ₱${product.price}.00<br>
            <button onclick="addToCart('${product.id}', '${product.item}', ${product.price})">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

window.addToCart = function(id, item, price) {
    const cartItem = cart.find(i => i.id === id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id, item, price, quantity: 1 });
    }
    updateCart();
};

function updateCart() {
    const cartTableBody = document.querySelector("#cartTable tbody");
    cartTableBody.innerHTML = ''; // Clear existing cart items
    let total = 0;
    const applyDiscount = document.getElementById('applyDiscount').checked; // Check if discount should be applied

    cart.forEach(cartItem => {
        const row = document.createElement('tr');
        let itemTotal = cartItem.price * cartItem.quantity;

        // Apply discount if checkbox is checked
        if (applyDiscount) {
            const discount = 0.20 * itemTotal; // 20% discount
            itemTotal -= discount;
        }

        // Round the item total to the nearest integer value
        itemTotal = Math.round(itemTotal);

        total += itemTotal;
        row.innerHTML = `
            <td>${cartItem.item}</td>
            <td>₱${cartItem.price}.00</td>
            <td>
                <button onclick="updateQuantity('${cartItem.id}', -1)">-</button>
                ${cartItem.quantity}
                <button onclick="updateQuantity('${cartItem.id}', 1)">+</button>
            </td>
            <td>₱${itemTotal}.00</td>
            <td><button onclick="removeFromCart('${cartItem.id}')">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    const vat = total * 0.12;
    document.getElementById("totalPrice").textContent = total.toFixed(2);
    document.getElementById("vatAmount").textContent = vat.toFixed(2);
}

window.updateQuantity = function(id, change) {
    const cartItem = cart.find(i => i.id === id);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
};

window.removeFromCart = function(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
};

async function saveTransaction(transactionDetails) {
    try {
        // Add a field to indicate if discount was applied
        const discountApplied = document.getElementById('applyDiscount').checked;

        // Include the discountApplied field in the transactionDetails
        transactionDetails.discountApplied = discountApplied;

        // Save transaction details to the "Transaction" collection
        await addDoc(collection(db, "Transaction"), transactionDetails);
    } catch (error) {
        console.error("Error saving transaction: ", error);
        throw error;
    }
}

document.getElementById('applyDiscount').addEventListener('change', function() {
    updateCart(); // Update the cart when the checkbox state changes
});

// Show or hide the table number input based on the order type
document.getElementById('orderType').addEventListener('change', function(event) {
    const orderType = event.target.value;
    const tableNumberContainer = document.getElementById('tableNumberContainer');
    if (orderType === 'Dine-in') {
        tableNumberContainer.style.display = 'block';
    } else {
        tableNumberContainer.style.display = 'none';
    }
});

document.getElementById("checkoutButton").addEventListener('click', async function() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const billInput = document.getElementById("billInput");
    const billAmount = parseFloat(billInput.value);

    if (isNaN(billAmount) || billAmount <= 0) {
        alert("Please enter a valid bill amount.");
        return;
    }

    const totalAmount = parseFloat(document.getElementById("totalPrice").textContent);
    const changeAmount = billAmount - totalAmount;

    if (changeAmount < 0) {
        alert("Insufficient bill amount!");
        return;
    }

    const orderType = document.getElementById("orderType").value;
    const tableNumber = orderType === 'Dine-in' ? document.getElementById("tableNumber").value : "N/A";

    try {
        for (const cartItem of cart) {
            const itemDoc = doc(db, "Menu", cartItem.id);
            const itemSnapshot = await getDoc(itemDoc);
            const currentItem = itemSnapshot.data();

            if (currentItem.quantity < cartItem.quantity) {
                throw new Error(`Insufficient quantity for ${currentItem.item}`);
            }

            const newQuantity = currentItem.quantity - cartItem.quantity;
            await updateDoc(itemDoc, { quantity: newQuantity });
        }

        const transactionDetails = {
            items: cart.map(item => ({ id: item.id, name: item.item, quantity: item.quantity })),
            totalAmount: totalAmount,
            vat: (totalAmount * 0.12).toFixed(2),
            paymentMethod: "Cash",
            date: new Date().toISOString(),
            orderType: orderType,
            tableNumber: tableNumber,
            status: "Pending"
        };
        await saveTransaction(transactionDetails);

        alert("Sale completed successfully!");
        cart = [];
        updateCart();
        fetchProducts();
        document.getElementById("changeAmount").textContent = changeAmount.toFixed(2);
        document.getElementById("changeOutput").style.display = "block";
    } catch (error) {
        console.error("Error during checkout: ", error);
        alert("Failed to complete the sale. Please try again.");
    }
});
