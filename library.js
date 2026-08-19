// ==========================================
// ESCANDINAVO RPG
// LIBRARY.JS
// ==========================================


const defaultLibrary = [


{
    name:"Guerreiro",
    color:"#ef4444",
    size:60
},


{
    name:"Mago",
    color:"#6366f1",
    size:60
},


{
    name:"Arqueiro",
    color:"#22c55e",
    size:60
},


{
    name:"Monstro",
    color:"#7c2d12",
    size:70
}


];



let tokenLibrary=[];



const LIBRARY_KEY =
"escandinavo_library";







// ==========================================
// INICIAR
// ==========================================


window.addEventListener(
"load",
loadLibrary
);





function loadLibrary(){



const data =
localStorage.getItem(
LIBRARY_KEY
);



if(data){



tokenLibrary =
JSON.parse(data);



}

else{


tokenLibrary =
JSON.parse(
JSON.stringify(
defaultLibrary
)
);



saveLibrary();



}



renderLibrary();



}









// ==========================================
// SALVAR
// ==========================================


function saveLibrary(){



localStorage.setItem(

LIBRARY_KEY,

JSON.stringify(
tokenLibrary
)

);



}









// ==========================================
// RENDER
// ==========================================


function renderLibrary(){



if(!DOM.library)
return;



DOM.library.innerHTML="";





tokenLibrary.forEach((item,index)=>{



const card =
document.createElement(
"div"
);



card.className =
"token-card";





card.innerHTML=`

<div class="token-preview"
style="
background:${item.color};
width:${item.size}px;
height:${item.size}px;
">

${item.name[0]}

</div>


<div class="token-info">

<div class="token-name">
${item.name}
</div>


<div class="token-type">
${item.size}px
</div>

</div>


<button class="delete-library">
×
</button>

`;






card.onclick=function(e){



if(
e.target.classList.contains(
"delete-library"
)

)
return;



createToken({



name:item.name,


color:item.color,


size:item.size,


image:item.image || null



});



};







card
.querySelector(
".delete-library"
)
.onclick=function(e){



e.stopPropagation();



removeLibraryToken(index);



};





DOM.library.appendChild(card);



});



}









// ==========================================
// REMOVER
// ==========================================


function removeLibraryToken(index){



tokenLibrary.splice(
index,
1
);



saveLibrary();



renderLibrary();



}









// ==========================================
// ADICIONAR
// ==========================================


function addToLibrary(token){



tokenLibrary.push({


name:token.name,


color:token.color,


size:token.size,


image:token.image || null


});



saveLibrary();



renderLibrary();



}









// ==========================================
// RESTAURAR
// ==========================================


function resetLibrary(){



tokenLibrary =
JSON.parse(
JSON.stringify(
defaultLibrary
)
);



saveLibrary();



renderLibrary();



toast(
"Biblioteca restaurada."
);



}









// ==========================================
// BOTÃO RESTAURAR
// ==========================================


window.addEventListener(
"load",
()=>{


const btn =
document.getElementById(
"resetLibrary"
);



if(btn){



btn.onclick =
resetLibrary;



}



});
