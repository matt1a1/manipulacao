// ==========================================
// MANIPULAÇÃO RPG
// UI.JS
// ==========================================



// ==========================================
// INICIAR
// ==========================================


window.addEventListener(
"load",
initUI
);





function initUI(){



// HISTÓRICO


bind(
"undo",
undo
);



bind(
"redo",
redo
);



// COPIAR


bind(
"copy",
copySelection
);



bind(
"paste",
pasteSelection
);



bind(
"duplicate",
duplicateSelection
);





// SAVE


bind(
"save",
saveStorage
);





// LOAD


const load =
document.getElementById(
"load"
);



if(load){


load.onclick=function(){



loadStorage();



renderTokens();



toast(
"Carregado."
);



};



}







// LIMPAR MAPA


bind(
"clearMap",
clearMap
);







// MAPA PADRÃO


bind(
"defaultMap",
defaultMap
);







// UPLOAD MAPA


const upload =
document.getElementById(
"uploadMap"
);



if(upload){



upload.onclick=function(){



document
.getElementById(
"mapLoader"
)
.click();



};



}









const loader =
document.getElementById(
"mapLoader"
);



if(loader){



loader.onchange=function(e){



const file =
e.target.files[0];



if(!file)
return;



const reader =
new FileReader();



reader.onload=function(){



DOM.map.style.backgroundImage =

`url(${reader.result})`;



DOM.map.classList.add(
"image"
);



saveStorage();



};



reader.readAsDataURL(
file
);



};



}










// FOG


bind(
"toggleFog",
toggleFog
);




// GRID


bind(
"toggleGrid",
toggleGrid
);




// RÉGUA


bind(
"toggleMeasure",
toggleMeasure
);




// INICIATIVA


bind(
"initiative",
openInitiative
);



}









// ==========================================
// BIND
// ==========================================


function bind(id,fn){



const el =
document.getElementById(id);



if(el){



el.onclick=fn;



}



}









// ==========================================
// MAPA
// ==========================================


function clearMap(){



if(
confirm(
"Limpar tokens?"
)

){



tokens=[];



renderTokens();



saveStorage();



toast(
"Mapa limpo."
);



}



}







function defaultMap(){



DOM.map.style.backgroundImage="";



DOM.map.classList.remove(
"image"
);



App.mapOffset={

x:0,

y:0

};



DOM.map.style.left="50%";

DOM.map.style.top="50%";



saveStorage();



toast(
"Mapa padrão."
);



}









// ==========================================
// FOG
// ==========================================


function toggleFog(){



App.fogEnabled =
!App.fogEnabled;



if(App.fogEnabled){



DOM.map.classList.add(
"fog"
);



toast(
"Fog ativado."
);



}

else{


DOM.map.classList.remove(
"fog"
);



toast(
"Fog desativado."
);



}



saveStorage();



}









// ==========================================
// RÉGUA
// ==========================================


function toggleMeasure(){



App.measureMode =
!App.measureMode;



if(App.measureMode){



toast(
"Régua ativada."
);



}

else{


toast(
"Régua desativada."
);



}



}









// ==========================================
// INICIATIVA
// ==========================================


function openInitiative(){



const panel =
document.getElementById(
"initiativePanel"
);



if(!panel)
return;



panel.classList.toggle(
"open"
);



renderInitiative();



}







function renderInitiative(){



const list =
document.getElementById(
"initiativeList"
);



if(!list)
return;



list.innerHTML="";



tokens.forEach(t=>{



const div =
document.createElement(
"div"
);



div.className =
"initiative-item";



div.innerHTML=

`
<b>${t.name}</b>
<br>
HP: ${t.hp}/${t.maxHp}
`;



list.appendChild(div);



});



}
