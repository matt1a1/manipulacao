// ==========================================
// INTERFACE
// ==========================================



window.addEventListener(
"load",
()=>{


// BOTÃO CRIAR TOKEN

document
.getElementById(
"createToken"
)
?.addEventListener(
"click",
()=>{


const name =
document.getElementById(
"tokenName"
).value;



const color =
document.getElementById(
"tokenColor"
).value;



if(!name)
return;



createToken({

name:name,

color:color

});



document.getElementById(
"tokenName"
).value="";



});




// ==========================================
// UNDO REDO
// ==========================================


document
.getElementById(
"undo"
)
?.addEventListener(
"click",
undo
);



document
.getElementById(
"redo"
)
?.addEventListener(
"click",
redo
);





// ==========================================
// COPIAR COLAR
// ==========================================


document
.getElementById(
"copy"
)
?.addEventListener(
"click",
copySelection
);



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
()=>{


App.clipboard =
tokens.filter(
t=>
App.selectedTokens.includes(
t.id
)
);



pasteSelection();



});






// ==========================================
// ZOOM
// ==========================================


document
.getElementById(
"zoomIn"
)
?.addEventListener(
"click",
()=>changeZoom(.1)
);



document
.getElementById(
"zoomOut"
)
?.addEventListener(
"click",
()=>changeZoom(-.1)
);






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
"Jogo salvo."
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
"Limpar todos tokens?"
)
){


clearTokens();


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
// UPLOAD MAPA
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



reader.onload=()=>{


DOM.map.style.backgroundImage=
`
url(${reader.result})
`;



DOM.map.style.backgroundSize=
"cover";



};



reader.readAsDataURL(
file
);



});



});
