var loader = document.getElementById("preloader");

// Minimum time the preloader should be visible (in milliseconds)
var minPreloaderTime = 6000;

window.addEventListener("load", function() {
    // Get the time when the page finished loading
    var pageLoadTime = Date.now();

    // Calculate the time to hide the preloader
    var hidePreloaderTime = Math.max(minPreloaderTime - (pageLoadTime - startTime), 0);

    // Ensure the preloader shows for at least minPreloaderTime milliseconds
    setTimeout(function() {
        loader.style.display = "none";
    }, hidePreloaderTime);
});

// Get the time when the script starts running
var startTime = Date.now();

const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

function addTask() {
    if (inputBox.value === '') {
        alert("Write something to add task");
    } else {
        let li = document.createElement('li');
        
        // Create a div for the task text
        let textDiv = document.createElement('div');
        textDiv.className = 'task-text';
        textDiv.innerHTML = inputBox.value;
        li.appendChild(textDiv);

        // Create a div for the action buttons
        let buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-buttons';
        
        // Add edit (✎) icon
        let editIcon = document.createElement('span');
        editIcon.innerHTML = "✎"; // Edit symbol
        editIcon.className = 'edit-icon';
        editIcon.onclick = function() {
            editTask(li, textDiv, buttonsDiv, editIcon);
        };
        buttonsDiv.appendChild(editIcon);

        // Add delete (×) icon
        let deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = "\u00d7"; // "×" symbol
        deleteIcon.className = 'delete-icon';
        deleteIcon.onclick = function() {
            li.remove();
            saveData();
        };
        buttonsDiv.appendChild(deleteIcon);

        li.appendChild(buttonsDiv);
        listContainer.appendChild(li);
    }
    inputBox.value = '';
    saveData();
}

function editTask(li, textDiv, buttonsDiv, editIcon) {
    const currentText = textDiv.textContent;
    textDiv.innerHTML = '';
    let inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    textDiv.appendChild(inputField);

    // Add save (✔) icon
    let saveIcon = document.createElement('span');
    saveIcon.innerHTML = "✔"; // Save symbol
    saveIcon.className = 'save-icon';
    saveIcon.onclick = function() {
        textDiv.innerHTML = inputField.value;

        // Re-create and append the edit (✎) icon
        let newEditIcon = document.createElement('span');
        newEditIcon.innerHTML = "✎"; // Edit symbol
        newEditIcon.className = 'edit-icon';
        newEditIcon.onclick = function() {
            editTask(li, textDiv, buttonsDiv, newEditIcon);
        };
        buttonsDiv.innerHTML = ''; // Clear previous buttons
        buttonsDiv.appendChild(newEditIcon);

        // Re-create and append the delete (×) icon
        let newDeleteIcon = document.createElement('span');
        newDeleteIcon.innerHTML = "\u00d7"; // "×" symbol
        newDeleteIcon.className = 'delete-icon';
        newDeleteIcon.onclick = function() {
            li.remove();
            saveData();
        };
        buttonsDiv.appendChild(newDeleteIcon);

        saveData();
    };
    buttonsDiv.innerHTML = ''; // Clear previous buttons
    buttonsDiv.appendChild(saveIcon);
}

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

function clearAllTasks() {
    if (listContainer.innerHTML.trim() === '') {
        alert("There is nothing to clear.");
    } else {
        listContainer.innerHTML = '';
        saveData();
    }
}

listContainer.addEventListener('click', function(e) {
    if (e.target.tagName === "li") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.parentElement.remove();
        saveData();
    }
}, false);

listContainer.addEventListener('click', function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.parentElement.remove();
        saveData();
    }
}, false);

showTask();
