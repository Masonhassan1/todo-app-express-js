var todos = document.getElementById("todos");
var user = document.getElementById("user");
var input = document.getElementById("task-input");
var url_post = "/postNote";
var url_get = "/getNotes";
var url_getLatest = "/getLatest";
var url_del = "/deleteNote";
var url_name = "/name";


getName();
updateList();



input.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    console.log(input.value);
    sendToDo(input.value);
    
  }
})

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
  })
}

function updateList(){
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", url_get);
  xhttp.send();
  xhttp.addEventListener("load", function(){
    let notes = JSON.parse(xhttp.responseText);
    //console.log(notes);
    appendNotes(notes);
  })
}

function getName(){
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", url_name);
  xhttp.send();
  xhttp.addEventListener("load", function(){
    let name = JSON.parse(xhttp.responseText);
    console.log(name);
    user.innerHTML = "Hello,  "+ name.name;
  })
}

function appendNotes(notes){
   todos.innerHTML = "";
   notes.forEach(function(e){
   appendNote(e);
 }) 
}

function singleNote(notes){
  appendNote(notes);
}

function appendNote(e){
   let note = document.createElement("div");
   note.classList.add("noteStyle");
   var crossButton = document.createElement("button");
   crossButton.innerHTML = "X";
   crossButton.classList.add("button")
   crossButton.setAttribute("id",e.id);
   crossButton.addEventListener("click",function (){
     deleteNote(e.id)
   })
   let noteText = document.createElement("span");
   noteText.innerText = e.note;
   note.appendChild(noteText);
   note.appendChild(crossButton);
   todos.appendChild(note);
}




function deleteNote(e){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", url_del);
  xhttp.setRequestHeader("Content-Type", "application/json");
  var postData = {};
  postData.delNote = e;
  console.log(postData);
  xhttp.send(JSON.stringify(postData));

  xhttp.addEventListener("load", function () {
    //addLatest();
    let response = xhttp.responseText;
    console.log(response);
    updateList();
  })
}



function addLatest(){
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", url_getLatest);
  xhttp.send();
  xhttp.addEventListener("load", function(){
    let notes = JSON.parse(xhttp.responseText);
    //console.log(notes);
    
    appendNote(notes);
  })
}