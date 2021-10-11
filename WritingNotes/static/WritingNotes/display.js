function display(id)
{
    fetch('/Notes/note/'+id)
    .then(response => response.json())
    .then(note => {
    let vert = note.inside.length==1?"": `<div style="border-radius:0px;"class='verticalline'></div>`;  

    var d =`
    <div style="width:99vw; display:flex;align-items:center;justify-content:center;background-attachment: local;">
    <div style="margin:50px;width:100%;">
    <div style="display:flex;justify-content:center;">
    <div style="background-color:${note.color};font-size: large;" class="title father" ><button data-id="${note.id}" class="links">${note.title}</button></div></div>
    ${vert}
    `
    d= complete(d,note.inside,1, note);
    document.querySelector("#single").innerHTML=d;
    every();
})
}
function complete(d,notes,lvl, main_note)
{
    
    if(lvl<=2)
    {
        d+=level(lvl, notes);
        notes.forEach(note => {
        if(note.inside)
        {
            d=childs(d,note,lvl,true,notes, main_note);
        }
        else{
            d=childs(d,note,lvl,false,notes, main_note);
        }
        d+=""
    });
    }
    else if(lvl>=3){
        let note = notes[0];
        let h = notes.slice(0,0)
        d=childs(d,note,lvl,false,h, main_note);
        return d
    }
    d+=`</div></div></div>`
    return d
}


function level(lvl,notes,d=null, main_note=null)
{
    var padding= "";
    var usage= (notes.length* 280);
    if(lvl>=2)
    {
        usage=280;
        padding="padding-right:80px;padding-left:60px;"
    }
    if(!d)
    {
    if(notes.length > 1){
      return `
      <div style="display:flex;justify-content:center;">  
      <div style="display:flex;justify-content:center;max-width:760px;min-width:600px;width:100%" class="level lvl${lvl}">
      <div style="width:${usage}px;">

    <div class="leftrightf" style="${padding}">
    <div style="border-radius:0px;" class='verticalline'></div>
    <div class="leftdiv"></div>
    <div class="rightdiv"></div>
    </div>
    `  
    }
    else{
        return `
    <div style="display:flex;justify-content:center;">
        <div style="float:none;" class="level lvl${lvl}">
        <div>
      `  
      }    
    }
else
{
    let vert = notes.length==1?"": `<div style="border-radius:0px;"class='verticalline'></div>`; 
    var f =""; 
    if(notes.length > 1){
        f=  `
        <div style="display:flex;justify-content:center;">  
        <div style="display:flex;justify-content:center;max-width:760px;min-width:600px;width:100%" class="level lvl${lvl}">
        <div style="width:${usage}px;">
  
      <div class="leftrightf">
      <div style="border-radius:0px;" class='verticalline'></div>
      <div class="leftdiv"></div>
      <div class="rightdiv"></div>
      </div>
      `  
      }
      else{
         f=   `
      <div style="display:flex;justify-content:center">
          <div style="float:none;" class="level lvl${lvl}">
          <div>
  
        `  
        } 
    
    d+=`
    </div></div></div>
    <div style="width:99vw; display:flex;align-items:center;justify-content:center;background-attachment: local;">
    <div style="margin:50px;width:100%;">
    <div style="display:flex;justify-content:center;">
    <div style="background-color:${main_note.color};font-size: large;" class="title father" >${main_note.title}</div></div>
    ${vert}
    ${f}
    `
    
    return d;
}    
} 
function overrun(notes,note)
{
    
    if((notes.length %2!=0&&notes.indexOf(note)==notes.length-1))
    {return `
    <div style="display:flex;justify-content:center;margin-top:20px;">
    <div style="width:260px;">

  <div class="leftrightf" style="padding-right:50px;padding-left:70px;">
  <div class="leftdiv"></div>
  <div class="rightdiv"></div>
  </div></div></div>
  `
}
    else{
    return `
        <div style="display:flex;justify-content:center;margin-top:20px;">
        <div style="width:260px;">
  
      <div class="leftrightf" style="padding-right:70px;padding-left:50px;">
      <div class="leftdiv"></div>
      <div class="rightdiv"></div>
      </div></div></div>
      `  }
    }
function childs(d,note,lvl,child,notes, main_note)
{   
    var posi ="margin-right:20px;";
    var verticalline ="130px";
    var titlewidth ="260px";
    if(lvl>=2)
    {
      posi="margin-right:1px;width:130px;";
      verticalline="60px";  
      titlewidth="100%;";
      if(notes.length %2!=0&&notes.indexOf(note)==notes.length-1&&lvl<=2)
    {
        verticalline="130px";
    }
    } 
    if((notes.length*280)>(document.documentElement.clientWidth*0.8))
    {
        if(lvl==1&&(notes.indexOf(note)+2)*280>(document.documentElement.clientWidth*0.8)&&(notes.indexOf(note)+1)*280<=(document.documentElement.clientWidth*0.8)){
          posi+="float:right";  
        } 
        else if(lvl==1&&(notes.indexOf(note)+1)*280>(document.documentElement.clientWidth*0.8)&&(notes.indexOf(note))*280<=(document.documentElement.clientWidth*0.8)) 
        {
          d= level(1, notes.slice(notes.indexOf(note),notes.length), d, main_note);
        }
        else if(lvl==2){
            if((notes.indexOf(note))%2==0&&notes.indexOf(note)>1)
            {
            d+=overrun(notes,note);
            }  
        }
    }
    if(lvl>=2&&notes.length===1&&notes.indexOf(note)==0) verticalline="50%";
    var body=`<div style="margin-left:${verticalline};width:3px;" class='verticalline'></div>
    <div style="display:flex;justify-content:center;"><div class="bodydisplay"style="background-color:${note.color}">${note.body}</div></div>`
    if(lvl>=3) body = "";
    if((notes.length-1)==notes.indexOf(note)&&lvl<=1) posi="float:right;";
    if(child)
    {
        d+=`
        <div class="blockpart" style="${posi}" id="note${note.id}-${lvl}">
        <div style="margin-left:${verticalline};width:3px;" class='verticalline'></div>
        <div style="display:flex;justify-content:center;width:${titlewidth};">
        <div style='background-color:${note.color};' class='title'><button data-id="${note.id}" class="links">${note.title}</button></div></div>
        ${body}
        <div id='ch${note.id}'>
        `;
        d = complete(d, note.inside,(lvl+1), main_note);
        d+= `</div>
        </div>
        `
    }
    else{
        d+=`
    <div class="blockpart" style="${posi}" id="note${note.id}-${lvl}">

    <div style="margin-left:${verticalline};width:3px;" class='verticalline'></div>
    <div style="display:flex;justify-content:center;width:${titlewidth};">
    <div style='background-color:${note.color};' class='title'><button data-id="${note.id}" class="links">${note.title}</button></div></div>
    ${body}
    </div>
    `;    
    }
    return d;    
}
