document.addEventListener('DOMContentLoaded', function() {
  if(!localStorage.getItem('Load')){
    localStorage.removeItem('Load');
    localStorage.setItem('Load', 'Notes');
  }
  document.querySelectorAll(".Types").forEach( function(a)
  {
    a.addEventListener("click", () => load_type(String(a.innerHTML)))
  })
  load_type(localStorage.getItem('Load'));
  console.log(localStorage.getItem('Load'))
});

function newflash()
{
  var div = document.querySelector("#divnewnote")
  div.style=""
  div.style.marginLeft="50px";
  div.style.width=" 450px";
  div.style.height="250px";
  div.style.padding="20px";
  div.style.backgroundColor ="#fff9c2";
  div.style.borderRadius="10px";
  div.innerHTML=`
  <h6 style="float: right;"><button class="close" onclick="closed()">X</button></h6>
  <label for="tagname">Question:</label><br>
  <input type="text" name="titlenew" placeholder="How old is the Earth?" id="titlenew">
  <br><br>
  <label for="body">Answer:</label><br>
  <input placeholder="4.543 billion years (Wikipedia)" type="text" name="bodynew" id="bodynew">
  <br><br>
  <input type="submit" onclick="newn('flash')" id="newtag" value="create">
  `
}

function newtag()
{
  var div = document.querySelector("#divnewnote")
  div.style=""
  div.style.marginLeft="50px";
  div.style.width=" 450px";
  div.style.height="250px";
  div.style.padding="20px";
  div.style.backgroundColor ="#fb8888";
  div.style.borderRadius="10px";
  div.innerHTML=`
  <h6 style="float: right;"><button class="close" onclick="closed()">X</button></h6>
  <label for="tagname">Tag name:</label><br>
  <input type="text" name="titlenew" maxlength="40" id="titlenew">
  <br><br>
  <label for="body">Color:</label><br>
  <input placeholder="like: rgb(0,0,0) or #ffffff" value="#fb8888" type="text" name="bodynew" id="bodynew">
  <button class="trybutton" onclick='tried()'>Try</button>
  <br><br>
  <input type="submit" onclick="newn('tag')" id="newtag" value="create">
  `
}
function tried()
{
  let color = document.querySelector("#bodynew").value;
  document.querySelector("#divnewnote").style.backgroundColor=color;
}
function change(id,change)
{
  fetch('/Notes/note/'+id)
  .then(response => response.json())
  .then(note => {
  let truedness = true
  if(change == "relevant"){
  if (note.relevant)
  {
    truedness = false;
  }
  fetch(`Notes/relevant/${id}`, {
    method: 'PUT',
        body: JSON.stringify({
        relevant: truedness 
    })
  });
  if(truedness) document.querySelector("#buttonrelevant").innerHTML="Not Relevant";
  else  document.querySelector("#buttonrelevant").innerHTML="Relevant";
}
else if(change=="public")
{
  if (note.public)
  {
    truedness = false;
  }
  fetch(`Notes/public/${id}`, {
    method: 'PUT',
        body: JSON.stringify({
        public: truedness 
    })
  });
  if(truedness) document.querySelector("#publicb").innerHTML="Private";
  else  document.querySelector("#publicb").innerHTML="Public";
}
else if(change=="tag")
{
  let tag = document.querySelector("#optiontags").value;
  fetch(`Notes/tag/${id}`, {
    method: 'PUT',
        body: JSON.stringify({
        tag: tag
    })
  });
  document.querySelector("#tagsinnote").innerHTML+=
  `
  <span style="margin-left:10px;" class="tag">${tag}</span>
  `
}
else if(change=="inside")
{
  let idnewinside = document.querySelector("#selectinside").value;
  fetch(`Notes/inside/${id}`, {
    method: 'PUT',
        body: JSON.stringify({
        inside: idnewinside
    })
  });
  fetch('/Notes/note/'+idnewinside)
    .then(response => response.json())
    .then(insidenote=> {  
  if(!document.querySelector(".insideul")){
  document.querySelector(".singlediv").innerHTML += `
  <ul class="insideul"style="display: block;">
  <li>
  <div class="insidesingle" style="display: block; background-color:${insidenote.color};">
  <h6 style="float: right;"><button class="takeoff close">X</button></h6>
  <button data-id="${insidenote.id}" class="links">${insidenote.title}</button>
      <div class="editcontent" style="display: block;" class="bodyin"contenteditable="true">
        <p >${insidenote.body}</div>
  </div>
  </li>
  </ul>
  `}
  else{
    document.querySelector("#insideul").innerHTML+=`
    <li>
    <div class="insidesingle" style="display: block;">
    <button data-id="${note.id}" class="links">${note.title}</button>
      <div class="editcontent" style="display: block;" class="bodyin"contenteditable="true">
        <p >${note.body}</div>
  </div>
  </li>
    `
  }
});
every();
}
});
}

function single(id)
{
  document.querySelector('#multiplenotes').style.display = 'none';
  document.querySelector('#single').style.display = 'block';
  fetch('/Notes/note/'+id)
  .then(response => response.json())
  .then(note => {
  fetch('/Tag')
    .then(response => response.json())
    .then(tags => {
  fetch('/Notes/All')
    .then(response => response.json())
    .then(insidenotes => {    
    var others = "";
    others = insideloop(note, others);
    let brelevant;
    let publicb;
    let color = "";
    let editable = "";
    let inside = "";
    let ta = "";
    let changesb="";
    let nextdate="";
    //Change tags only if they want to

    if(note.user==user()) {
      var g = `<h5>Add Tag</h5>
      <select id="optiontags" onchange="change(${note.id},'tag')">
      <option value="">Choose Tags</option>
      `
      tags.forEach(function(tag){
        g+=`<option value="${tag.name}">${tag.name}</option>`
      })
      g += `</select>`
      if(note.nextdate)
      {
        nextdate=`<h6>Next review: ${note.nextdate}</h6>`
      }
      if(note.relevant){
      brelevant = `<h5>Make:</h5><button id='buttonrelevant' class="editbuttons" onclick='change(${note.id},"relevant")'>Not Relevant</button>`
      }   
      else{ 
        brelevant =`<h5>Make:</h5><button id='buttonrelevant' class="editbuttons" onclick='change(${note.id},"relevant")'>Relevant</button>`}
      if(note.public){
        publicb = `<h5>Make:</h5><button class="editbuttons"id='publicb' onclick='change(${note.id},"public")'>Private</button>`
        }  
      else{
        publicb =`<h5>Make:</h5><button class="editbuttons" id='publicb' onclick='change(${note.id},"public")'>Public</button>`}
        editable = 'contenteditable="true"'
        color = `<h5>Color:</h5><input placeholder="like: rgb(0,0,0) or #ffffff" value="${note.color}" type="text" name="color" id="color"><button class="trybutton" onclick="update(${note.id}, 'color')">Save</button>`
      inside+=`<h5>Add Note</h5>
      <select id="selectinside" onchange="change(${note.id},'inside')">
      <option value="">Choose notes</option>
      `  
      insidenotes.forEach(function(insidenote)
      {
        if(insidenote.id==note.id) return;
        inside+=`<option value="${insidenote.id}">${insidenote.title}</option>`
      })
      inside+="</select>"
      changesb = `
      <div id="colordiv"style="background-color:${note.color};">
        <span class="changes"><div>${brelevant}</div></span>
        <span class="changes"><div>${color}</div></span>
        <span class="changes"><div>${inside}</div></span>
        <span class="changes"><div>${g}</div></span>
        <span class="changes"><div>${publicb}</div></span>
      </div>`
      if(note.tag)
      { 
        ta += `<div id="tagsinnote">`
        note.tag.forEach(function(noe)
        {
          ta+=`<span style="margin-left:10px;" class="tag">${noe}</span>`
        })
        ta+= `</div>`
      }
      }
  else{
    publicb = "<h4>Public</h4>";
    brelevant=""
  }

  if(note.nextdate){
  document.querySelector('#single').innerHTML = `
  <div style="float:left;margin-left:30px;width:200px;margin-bottom:20px;">
  Created:<h6>${note.started}</h6><br>
  Last modified:<h6>${note.lastmodified}</h6>
  ${nextdate}
  </div>
  <div style="float:right;margin-right:30px;width:200px;"><h1></h1></div>
  <div id="question">
  <h2>${note.title}</h2>
  </div>

  <br>
  <div style="clear: both;">
  <hr>
  ${ta}
  <div id="upper" style="display:none">
  ${changesb}

  <div class="singlediv" id="${note.id}">
  <div class="editcontent" style="display:"none";min-height: 130px; margin-bottom:10px;" ${editable}>
  <p>${note.body}</p>
  </div>
  ${others}
  <button onclick="checkans(3,${note.id})"class="difficult">Easy</button>
  <button onclick="checkans(2,${note.id})"class="difficult">Medium</button>
  <button onclick="checkans(1,${note.id})"class="difficult">Difficult</button>
  </div>
  </div></div>
  <button id="buttonans" style="margin-left:30px;display:block;"class="trybutton"onclick="showanswer()" >Show</button>
  
  `
  ;
  }
  else{
  document.querySelector('#single').innerHTML = `
  <div class="singlediv" id="${note.id}">
  <h1>${note.title}</h1>
  <h6>Created:</h6><h6>${note.started}</h6><br>
  <h6>Last modified:</h6><h6>${note.lastmodified}</h6><br>
  <button class="editbuttons" id="Display"onclick='display(${note.id})'>Display</button><br>
  ${ta}
  <br>
  ${changesb}
  <hr>
  <div class="editcontent" style="min-height: 130px; margin-bottom:10px;" ${editable}><p>${note.body}</p>
  </div>
  ${others}
  </div>
  `;}
  every();
  })
})
})
}
function showanswer()
{
  let b = document.querySelector("#buttonans");
  if(b.style.display=="block") 
  {
    b.style.display="none";
    document.querySelector("#upper").style.display="block";
  }
  else{
    b.style.display="block";
    document.querySelector("#upper").style.display="none";
  }
}
function insideloop(note, others)
{
  if(note.inside){
  note.inside.forEach( not => {
    others+= "<ul id='insideul'style='display: block;'>"
    others += `
    <li id="${not.id}">
    <div class="insidesingle" style="display: block; background-color:${not.color};">
    <h6 style="float: right;"><button class="takeoff close">X</button></h6>
    <button data-id="${not.id}" class="links">${not.title}</button>
        <div class="editcontent" style="display: block;" class="bodyin"contenteditable="true">
          <p >${not.body}</div>
    </div>
    `
    others = insideloop(not, others)
    others += "</li>"
})
}
else others += ""
others += "</ul>"
return others
}

function load_type(type){
  if (document.querySelector("#newnotediv")) {
  document.querySelector('#multiplenotes').style.display = 'none';
  document.querySelector('#single').style.display = 'none';
  }
  else{
  var multiplenote = document.querySelector('#multiplenotes')
  if (multiplenote.style.display == 'none'){
  multiplenote.style.display="block";
  document.querySelector('#single').style.display="none";
  }
   multiplenote.innerHTML=`
  <br>
    <h2 style="margin-left:10px;">${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
    <hr>
    <input placeholder="Search" type="text" name="search" id="search">
    <div id="notes"></div>
  `
  fetch('/Notes/'+type)
  .then(response => response.json())
  .then(notes => {
    prenotes(notes,"#notes");
    every()
})}
  localStorage.setItem('Load', type);
}

function takeoff(button)
{
  let li = button.closest("li");
  let ul = li.parentElement;
  let id = ul.parentElement.id
  fetch('Notes/takeoff/'+id, {
    method: 'PUT',
        body: JSON.stringify({
        takeout : li.id,
    })
  });
  li.remove()
}
function every(){
document.querySelectorAll(".editcontent").forEach(function(div){
    div.addEventListener("input",()=>d(div))
});
if(document.querySelectorAll(".takeoff")){
  document.querySelectorAll(".takeoff").forEach(function(b)
  {
    b.addEventListener("click", ()=>takeoff(b))
  })
}
if(document.querySelectorAll(".eliminate")){
  document.querySelectorAll(".eliminate").forEach(function(b)
  {
    b.addEventListener("click", ()=>eliminate(b))
  })
}
if(document.querySelector("#search")) 
{
  document.querySelector("#search").addEventListener("input", ()=>search(document.querySelector("#search").value))
}
if (typeof window.orientation == 'undefined'){
document.querySelectorAll(".links").forEach(function(button){
  button.addEventListener("click",()=>minmaxsuper(button))
 button.addEventListener("dblclick",()=>single(parseInt(button.dataset.id)))
});
}
else{
  document.querySelectorAll(".links").forEach(function(button){
   button.addEventListener("click",()=>single(parseInt(button.dataset.id)))
  });
}
}
function eliminate(button)
{
  let li = button.closest("div");
  let main = li.parentElement
  let id = main.id;
  fetch('Eliminate/'+id, {
    method: 'POST',
         body: JSON.stringify({
        takeout : li.id,
     })
  });
  main.remove()
}

function search(value)
{
  let notes = document.querySelectorAll(".super")
  notes.forEach(function(div){
    let f = div.innerHTML;
    let finded = f.search(value)
    if(finded=="-1"){
      div.style.display="none";
    }
    else{
      div.style.display="block"
    }
  })
}
function minmaxsuper(a)
{
  try{
  try{
  let main  = a.parentElement;
  if(main.classList.contains("insidesingle"))
  {
    let li = main.parentElement;
    try{
    let ul = Array.from(li.children);
    ul[1].style.display=="none" ? ul[1].style.display="block" :ul[1].style.display="none";
    }
    catch{}
  }
  else{
  let div = main.querySelectorAll(".bodyin")[0];
  if(div.style.display == "block") div.style.display = "none";
  else div.style.display = "block";
  }
}
  catch(err){
    let pe = a.parentElement
    let pre = pe.parentElement
    let main  = pre.parentElement
    let div = main.querySelectorAll(".notes")[0]
    if(div.style.display == "block") 
    {
      div.style.display = "none";
    }
    else div.style.display = "block";
  }}
  catch{}
}

function d(p){
  var x = p.parentElement;
  var par = "";
  if(isNaN(x.id)||x.id=="")
  { 
    par = x.parentElement;
  }
  else par = x;
  if(p.classList.contains("insidesingle")) par= p;
  let len = Array.from(par.querySelectorAll(".divsave")).length
  if(len<=0){
  par.innerHTML += "<div class='divsave'><button class='save'>Save</button><br><br></div>"
  }
  par.querySelector(".save").addEventListener("click",()=> update(par,"body"))
}


function update(par,change)
{ 
  if (change == "body")
  {
  var main = par;
  if(!par.classList.contains("editcontent")){
   main = par.querySelectorAll(".editcontent")[0];
  }
  let body = "";
  main.querySelectorAll("p").forEach(function(paragraph)
  {
    body+= paragraph.innerHTML;
    body+="<br>"
  })
  body = body.slice(0,-4);
  let id = parseInt(par.id);
        fetch('Notes/body/'+id, {
        method: 'PUT',
            body: JSON.stringify({
            body: body
        })
      });
    var save = par.querySelector(".divsave");
    save.remove();
    var p
    try{ p = par.querySelectorAll(".editcontent")[0];}
    finally{ p = par;}
    p.addEventListener("input",()=>d(p));
  }
  else if(change=="color")
  {
    let color = document.querySelector("#color").value;
    fetch('Notes/color/'+par, {
      method: 'PUT',
          body: JSON.stringify({
          color: color
      })
    });
    document.querySelector("#colordiv").style.backgroundColor = color;
  }
}

function newnote()
{
    var div = document.querySelector("#divnewnote")
    div.style=""
    div.style.marginLeft="50px";
    div.style.width=" 450px";
    div.style.height="500px";
    div.style.padding="20px";
    div.style.backgroundColor ="rgb(211 231 255)";
    div.style.borderRadius="10px";
    div.innerHTML=`
    <h6 style="float: right;"><button class="close" onclick="closed()">X</button></h6>
    <label for="titlenote">Title:</label><br>
    <input type="text" placeholder="title for my new note" name="titlenew" id="titlenew">
    <br><br>
    <label for="body">Body:</label>
    <textarea name="body" id="bodynew" placeholder="Some stuff..." style="height:300px"cols="48"></textarea>
    <input type="submit" onclick="newn('note')" id="newnotes" value="create">
    `
}
function closed()
{
  let div = document.querySelector("#divnewnote")
  div.innerHTML=`<button class="newnote" onclick="newnote()" style="font-family: 'KoHo', sans-serif;"><strong>Quick Note</strong></button>
  <button class="newnote" onclick="newtag()" style="font-family: 'KoHo', sans-serif;"><strong>New Tag</strong></button>
  <button id="newflash"class="newnote" onclick="newflash()" style="font-family: 'KoHo', sans-serif;"><strong>New Flashcard</strong></button>
  `
  div.style = "display:flex;align-items: center;justify-content: center;"
}
function prenotes(notes, div)
{
  var template = ""
  let i = 0;
  notes.forEach(note => {
  var others = "";
  let editable = "";
  let public = "";
  let erase = "";
  let tag = "";
  if(note.user==user()) {
    editable = "contenteditable='true'";
  erase =`<h6 style="float: right;"><button class="eliminate close">X</button></h6>`
  } 
  if(note.inside)
  {
    note.inside.forEach( n => 
    {
      others += `<div><div class="in" id="${n.id}" style="display: block;opacity:.8; background-color:${n.color};"><button data-id="${n.id}"class="links">${n.title}</button><div style="display: block;" class="bodyin editcontent" ${editable}><p>${n.body}</p></div></div></div>`
    })
  } 
  if(note.public)
  {
    public = `<br><h6>By: ${note.user}</h6>`
  }

  if(note.tag)
  { 
    tag = `<div>`
    note.tag.forEach(function(noe)
    {
      tag+=`<span style="margin-left:10px;" class="tag">${noe}</span>`
    })
    tag+= `</div>`
  }
  if(note.nextdate)
  {
    template+=`<div id="${note.id}"class="super" >
    <div class="survivor" style="margin-right:20px;border-radius:15px 25px 10px 10px;background-color:${note.color}"><h4><button data-id="${note.id}" class="links">${note.title}</button></h4>${public}
    ${tag}
    <h6>Next revision: ${note.nextdate}</h6>
    </div>
    </div>
    </div>`
  }
  else{
  template += `
  <div id="${note.id}"class="super">
  <div class="survivor" style="margin-right:20px;background-color:${note.color}">${erase}<h4><button data-id="${note.id}" class="links">${note.title}</button></h4>${public}
  </div>
  <div class="notes" style="margin-right:20px;background-color:${note.color}; overflow:auto; max-height:500px; min-height: 240px;display:block;">
  ${tag}
  <hr>
  <h6>${note.lastmodified}</h6>
  <div class="editcontent" ${editable}><p>${note.body}</p></div>
  ${others}
  </div>
  </div>
  </div>
  `}
});
  document.querySelector(`${div}`).innerHTML = `
  ${template}
  `;
  
}
function links()
{
  document.querySelectorAll(".links").forEach(function(button) {
    button.onclick = function() {
    if (document.querySelector("#form") != null) {
    let z = document.querySelector("#blue")
    z.remove()
    }
        let name = button.innerHTML
        userinfo(name)
        newpage(0, 10, name, `Posts by ${name}`)
}
})
}
function checkans(dif,id)
{
  var next;
  let time = [0,1,3,7,9,14,30];
  fetch('/Notes/note/'+id)
  .then(response => response.json())
  .then(note => {
    var index = time.indexOf(note.nexttime)
    try{
      if(dif == 3) next = time[(index+1)];
      else{
      dif == 2 ? next = time[index] : next = time[index-1];
      }
    }
    catch{
      next = time[index];
    }
    fetch('Notes/nexttime/'+id, {
      method: 'PUT',
          body: JSON.stringify({
          nexttime: next
      })
    });
})
load_type("Flashcards")
}

function newn(arg) {
    const body = document.querySelector("#bodynew").value;
    const title = document.querySelector("#titlenew").value;
    fetch('/new', {
      method: 'POST',
      body: JSON.stringify({
          title: title,
          body: body,
          type: arg
      })
    })
    location.reload();
  }
