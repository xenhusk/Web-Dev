import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let editItemId = null;

async function fetchInventory() {
    const itemTableBody = document.querySelector("#itemTable tbody");
    const querySnapshot = await getDocs(collection(db, "Menu"));
    itemTableBody.innerHTML = ''; // Clear only the table body
    querySnapshot.forEach((doc) => {
        const menu = doc.data();
        appendItem(doc.id, menu.item, menu.price, menu.quantity);
    });
}

fetchInventory();

// Input elements
const inputItem = document.getElementById('addItem');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');
const addButton = document.getElementById('addButton');
const itemTableBody = document.querySelector("#itemTable tbody");

function validateInputs(item, price, quantity) {
    if (!item) {
        alert("Item name cannot be empty.");
        return false;
    }
    if (price < 0) {
        alert("Price cannot be negative.");
        return false;
    }
    if (quantity < 0) {
        alert("Quantity cannot be negative.");
        return false;
    }
    return true;
}

addButton.addEventListener('click', async function () {
    try {
        const itemValue = inputItem.value;
        const priceValue = inputPrice.value;
        const quantityValue = inputQuantity.value;

        if (!validateInputs(itemValue, priceValue, quantityValue)) {
            return;
        }

        if (editItemId) {
            // Update existing item
            await updateDoc(doc(db, "Menu", editItemId), {
                item: itemValue,
                price: priceValue,
                quantity: quantityValue
            });
            editItemId = null;
            addButton.textContent = 'Add';
            alert("Item updated successfully!");
        } else {
            // Add new item
            const docRef = await addDoc(collection(db, "Menu"), {
                item: itemValue,
                price: priceValue,
                quantity: quantityValue
            });
            appendItem(docRef.id, itemValue, priceValue, quantityValue);
            alert("Item added successfully!");
        }

        clearInputField();
        fetchInventory(); // Re-fetch the updated table
    } catch (error) {
        console.error("Error adding/updating item: ", error);
        alert("Failed to add/update item. Please try again.");
    }
});

// Clear input fields
function clearInputField() {
    inputItem.value = "";
    inputPrice.value = "";
    inputQuantity.value = "";
}

// Append item and quantity to table
function appendItem(id, itemValue, priceValue, quantityValue) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itemValue}</td>
        <td>₱${priceValue}.00</td>
        <td>${quantityValue}</td>
        <td>
            <button class="edit-button" onclick="editItem('${id}', '${itemValue}', '${priceValue}', '${quantityValue}')">Edit</button>
            <button class="delete-button" onclick="deleteItem('${id}')">Delete</button>
        </td>
    `;
    itemTableBody.appendChild(row);
}

// Edit item
window.editItem = function(id, itemValue, priceValue, quantityValue) {
    inputItem.value = itemValue;
    inputPrice.value = priceValue;
    inputQuantity.value = quantityValue;

    editItemId = id;
    addButton.textContent = 'Update';
};

// Delete item
window.deleteItem = async function(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            await deleteDoc(doc(db, "Menu", id));
            fetchInventory(); // Re-fetch the updated table
            alert("Item deleted successfully!");
        } catch (error) {
            console.error("Error deleting item: ", error);
            alert("Failed to delete item. Please try again.");
        }
    }
};
