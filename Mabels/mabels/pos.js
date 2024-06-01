import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc, addDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    productList.innerHTML = ''; // Clear existing products
    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <strong>${product.item}</strong><br>
            Price: ₱${product.price}.00<br>
            <button onclick="addToCart('${doc.id}', '${product.item}', ${product.price})">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

fetchProducts();

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

    cart.forEach(cartItem => {
        const row = document.createElement('tr');
        const itemTotal = cartItem.price * cartItem.quantity;
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

    document.getElementById("totalPrice").textContent = total.toFixed(2);
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

        // Save transaction details after updating quantities of all items in the cart
        const transactionDetails = {
            items: cart.map(item => ({ id: item.id, name: item.item, quantity: item.quantity })),
            totalAmount: totalAmount,
            paymentMethod: "Cash",
            date: new Date().toISOString()
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

async function saveTransaction(transactionDetails) {
    try {
        const transactionRef = await addDoc(collection(db, "Transaction"), transactionDetails);
        console.log("Transaction saved with ID: ", transactionRef.id);
    } catch (error) {
        console.error("Error saving transaction: ", error);
        throw error;
    }
}