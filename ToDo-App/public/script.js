// Get DOM elements
var todos = document.getElementById("todos"); // Container for displaying To-Do items
var user = document.getElementById("user"); // Container for displaying user information
var input = document.getElementById("task-input"); // Input field for entering tasks

// URLs for API endpoints
var url_post = "/postNote"; // URL for adding a new task
var url_get = "/getNotes"; // URL for retrieving all tasks
var url_getLatest = "/getLatest"; // URL for retrieving the latest task
var url_del = "/deleteNote"; // URL for deleting a task
var url_name = "/name"; // URL for getting the user's name

// Get the user's name and display it
getName();

// Update the list of To-Do items
updateList();

// Listen for Enter key press in the input field to add a new task
input.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    console.log(input.value);
    sendToDo(input.value);
    input.innerHTML = "";
  }
});

// Function to send a new task to the server
function sendToDo(data) {
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", url_post);
  xhttp.setRequestHeader("Content-Type", "application/json");
  var postData = {};
  postData.note = data;
  console.log(postData);
  xhttp.send(JSON.stringify(postData));

  xhttp.addEventListener("load", function () {
    addLatest();
    let response = xhttp.responseText;
    console.log(response);
  });
}

// Function to update the list of To-Do items
function updateList() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", url_get);
  xhttp.send();
  xhttp.addEventListener("load", function () {
    let notes = JSON.parse(xhttp.responseText);
    appendNotes(notes);
  });
}

// Function to get and display the user's name
function getName() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", url_name);
  xhttp.send();
  xhttp.addEventListener("load", function () {
    let name = JSON.parse(xhttp.responseText);
    console.log(name);
    user.innerHTML = "Hello, " + name.name;
  });
}

// Function to append multiple notes to the DOM
function appendNotes(notes) {
  todos.innerHTML = "";
  notes.forEach(function (e) {
    appendNote(e);
  });
}

// Function to append a single note to the DOM
function singleNote(notes) {
  appendNote(notes);
}

// Function to append a single note to the DOM
function appendNote(e) {
  let note = document.createElement("div");
  note.classList.add("noteStyle");
  var crossButton = document.createElement("button");
  crossButton.innerHTML = "X";
  crossButton.classList.add("button");
  crossButton.setAttribute("id", e.id);
  crossButton.addEventListener("click", function () {
    deleteNote(e.id);
  });
  let noteText = document.createElement("span");
  noteText.innerText = e.note;
  note.appendChild(noteText);
  note.appendChild(crossButton);
  todos.appendChild(note);
}

// Function to delete a note
function deleteNote(e) {
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", url_del);
  xhttp.setRequestHeader("Content-Type", "application/json");
  var postData = {};
  postData.delNote = e;
  console.log(postData);
  xhttp.send(JSON.stringify(postData));

  xhttp.addEventListener("load", function () {
    updateList();
  });
}

// Function to add the latest note
function addLatest() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", url_getLatest);
  xhttp.send();
  xhttp.addEventListener("load", function () {
    let notes = JSON.parse(xhttp.responseText);
    appendNote(notes);
  });
}
