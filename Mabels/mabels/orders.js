import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function fetchOrders() {
    const orderTableBody = document.querySelector("#orderTable tbody");
    const querySnapshot = await getDocs(collection(db, "Transaction"));
    orderTableBody.innerHTML = ''; // Clear existing orders
    querySnapshot.forEach((doc) => {
        const order = doc.data();
        const orderId = doc.id;
        const items = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${orderId}</td>
            <td>${items}</td>
            <td>₱${order.totalAmount}.00</td>
            <td>${order.paymentMethod}</td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>${order.tableNumber}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="updateOrderStatus('${orderId}', 'Completed')">Complete</button>
                <button onclick="updateOrderStatus('${orderId}', 'Cancelled')">Cancel</button>
            </td>
        `;
        orderTableBody.appendChild(row);
    });
}

window.updateOrderStatus = async function(orderId, status) {
    const orderDoc = doc(db, "Transaction", orderId);
    await updateDoc(orderDoc, { status: status });
    fetchOrders(); // Refresh the order list
};

fetchOrders();
