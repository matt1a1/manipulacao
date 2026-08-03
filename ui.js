// ==========================================
// INTERFACE RPG
// ==========================================


window.addEventListener(
"load",
()=>{



// ==========================================
// TAMANHO DO TOKEN
// ==========================================


const sizeInput =
document.getElementById(
"tokenSize"
);



const sizeValue =
document.getElementById(
"tokenSizeValue"
);



if(sizeInput){


sizeInput.addEventListener(
"input",
()=>{


sizeValue.innerText =
sizeInput.value+"px";


});


}





// ==========================================
// CRIAR TOKEN
// ==========================================


const createButton =
document.getElementById(
"createToken"
);



if(createButton){


createButton.addEventListener(
"click",
()=>{



const name =
document.getElementById(
"tokenName"
).value.trim();



const color =
document.getElementById(
"tokenColor"
).value;



const size =
Number(
document.getElementById(
"tokenSize"
).value
);



const imageInput =
document.getElementById(
"newTokenImage"
);





if(name===""){


toast(
"Digite um nome para o token."
);


return;


}




// SEM IMAGEM

if(
!imageInput.files.length
){



createToken({

name:name,

color:color,

size:size

});



limparFormulario();



return;


}






// COM IMAGEM

const file =
imageInput.files[0];



const reader =
new FileReader();




reader.onload=function(){



createToken({


name:name,


color:color,


size:size,


image:reader.result



});



limparFormulario();



};



reader.readAsDataURL(
file
);



});


}





// ==========================================
// LIMPAR FORMULARIO
// ==========================================


function limparFormulario(){


document.getElementById(
"tokenName"
).value="";



document.getElementById(
"newTokenImage"
).value="";



}








// ==========================================
// UNDO
// ==========================================


document
.getElementById(
"undo"
)
?.addEventListener(
"click",
undo
);






// ==========================================
// REDO
// ==========================================


document
.getElementById(
"redo"
)
?.addEventListener(
"click",
redo
);






// ==========================================
// COPIAR
// ==========================================


document
.getElementById(
"copy"
)
?.addEventListener(
"click",
copySelection
);






// ==========================================
// COLAR
// ==========================================


document
.getElementById(
"paste"
)
?.addEventListener(
"click",
pasteSelection
);








// ==========================================
// DUPLICAR
// ==========================================


document
.getElementById(
"duplicate"
)
?.addEventListener(
"click",
duplicateSelection
);









// ==========================================
// ZOOM
// ==========================================


document
.getElementById(
"zoomIn"
)
?.addEventListener(
"click",
()=>{


App.zoom+=0.1;


if(App.zoom>App.maxZoom)
App.zoom=App.maxZoom;



updateZoom();



});







document
.getElementById(
"zoomOut"
)
?.addEventListener(
"click",
()=>{


App.zoom-=0.1;


if(App.zoom<App.minZoom)
App.zoom=App.minZoom;



updateZoom();



});









// ==========================================
// SALVAR
// ==========================================


document
.getElementById(
"save"
)
?.addEventListener(
"click",
()=>{


saveStorage();



toast(
"Salvo."
);



});








// ==========================================
// CARREGAR
// ==========================================


document
.getElementById(
"load"
)
?.addEventListener(
"click",
()=>{


loadStorage();



renderTokens();



toast(
"Carregado."
);



});








// ==========================================
// LIMPAR MAPA
// ==========================================


document
.getElementById(
"clearMap"
)
?.addEventListener(
"click",
()=>{



if(
confirm(
"Remover todos os tokens?"
)
){



tokens=[];



renderTokens();



saveStorage();



toast(
"Mapa limpo."
);



}



});









// ==========================================
// MAPA PADRÃO
// ==========================================


document
.getElementById(
"defaultMap"
)
?.addEventListener(
"click",
()=>{


DOM.map.style.backgroundImage="";



DOM.map.style.backgroundColor=
"#0f172a";



});









// ==========================================
// IMPORTAR MAPA
// ==========================================


document
.getElementById(
"uploadMap"
)
?.addEventListener(
"click",
()=>{


document
.getElementById(
"mapLoader"
)
.click();



});







document
.getElementById(
"mapLoader"
)
?.addEventListener(
"change",
e=>{



const file =
e.target.files[0];



if(!file)
return;



const reader =
new FileReader();




reader.onload=function(){



DOM.map.style.backgroundImage =
`
url(${reader.result})
`;



DOM.map.classList.add(
"image"
);



};



reader.readAsDataURL(
file
);



});



});
