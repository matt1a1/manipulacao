// ==========================================
// MANIPULAÇÃO RPG
// MAIN.JS
// ==========================================


// ==========================================
// APP
// ==========================================

const App = {


version:"2.1.0",


zoom:1,


minZoom:.30,


maxZoom:4,


gridSize:50,


snapGrid:true,


gridVisible:true,


fogEnabled:false,


measureMode:false,



selectedTokens:[],


clipboard:[],


history:[],


redoHistory:[],


mouse:{


x:0,

y:0


},



mapOffset:{


x:0,

y:0


}



};




// ==========================================
// DOM
// ==========================================


const DOM={


map:null,


wrapper:null,


loading:null,


library:null,


zoomLabel:null,


contextMenu:null,


tokenSize:null,


tokenSizeValue:null


};







// ==========================================
// START
// ==========================================


window.addEventListener(
"load",
init
);




function init(){


cacheDOM();


registerEvents();


loadStorage();


renderLibrary();


renderTokens();


updateZoom();


hideLoading();



toast(
"Manipulação RPG carregado."
);



}








// ==========================================
// CACHE
// ==========================================


function cacheDOM(){



DOM.map =
document.getElementById("map");



DOM.wrapper =
document.getElementById("mapWrapper");



DOM.loading =
document.getElementById("loading");



DOM.library =
document.getElementById("libraryList");



DOM.zoomLabel =
document.getElementById("zoomValue");



DOM.contextMenu =
document.getElementById("contextMenu");



DOM.tokenSize =
document.getElementById("tokenSize");



DOM.tokenSizeValue =
document.getElementById("tokenSizeValue");



}








// ==========================================
// EVENTOS
// ==========================================


function registerEvents(){


window.addEventListener(
"resize",
updateViewport
);



document.addEventListener(
"keydown",
keyboard
);



document.addEventListener(
"keyup",
keyboardUp
);



DOM.wrapper.addEventListener(
"wheel",
zoomWheel,
{
passive:false
}
);





const size =
document.getElementById(
"tokenSize"
);



if(size){


size.oninput=function(){


DOM.tokenSizeValue.innerHTML =
this.value+"px";


};


}





document
.getElementById("createToken")
.onclick=createNewToken;



}










// ==========================================
// CRIAR TOKEN
// ==========================================


function createNewToken(){



const name =
document.getElementById(
"tokenName"
).value || "Token";



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



const image =
document.getElementById(
"tokenImage"
);



if(image.files.length){



const reader =
new FileReader();



reader.onload=function(){


createToken({


name:name,


color:color,


size:size,


image:reader.result



});



};



reader.readAsDataURL(
image.files[0]
);



}

else{


createToken({


name:name,


color:color,


size:size



});



}



}










// ==========================================
// HISTÓRICO
// ==========================================


function saveHistory(){



App.history.push({



tokens:

JSON.parse(
JSON.stringify(tokens)
),


zoom:App.zoom,


grid:App.gridVisible



});



if(App.history.length>50)


App.history.shift();



App.redoHistory=[];



}










function undo(){


if(!App.history.length){


toast(
"Nada para desfazer."
);


return;


}



App.redoHistory.push({


tokens:

JSON.parse(
JSON.stringify(tokens)
),


zoom:App.zoom


});



const state =
App.history.pop();




tokens =
JSON.parse(
JSON.stringify(
state.tokens
)
);



App.zoom =
state.zoom;



App.gridVisible =
state.grid;



renderTokens();


updateZoom();



toast(
"Desfeito."
);



}











function redo(){


if(!App.redoHistory.length){


toast(
"Nada para refazer."
);


return;


}



App.history.push({


tokens:

JSON.parse(
JSON.stringify(tokens)
),


zoom:App.zoom



});




const state =
App.redoHistory.pop();




tokens =
JSON.parse(
JSON.stringify(
state.tokens
)
);



App.zoom =
state.zoom;



renderTokens();


updateZoom();



toast(
"Refeito."
);



}









// ==========================================
// SELEÇÃO
// ==========================================


function clearSelection(){


App.selectedTokens=[];



document
.querySelectorAll(".token")
.forEach(t=>{


t.classList.remove(
"selected"
);


});


}




function addSelection(id){


if(
!App.selectedTokens.includes(id)
)


App.selectedTokens.push(id);



}





function selectAll(){


clearSelection();



tokens.forEach(t=>{


App.selectedTokens.push(
t.id
);


});



renderSelection();



}




function renderSelection(){



document
.querySelectorAll(".token")
.forEach(t=>{


t.classList.remove(
"selected"
);


});




App.selectedTokens.forEach(id=>{


const el =
document.querySelector(
`.token[data-id="${id}"]`
);



if(el)


el.classList.add(
"selected"
);



});



}









// ==========================================
// COPIAR / COLAR
// ==========================================


function copySelection(){



App.clipboard=[];



App.selectedTokens.forEach(id=>{


const token =
tokens.find(
t=>t.id===id
);



if(token)


App.clipboard.push(

JSON.parse(
JSON.stringify(token)
)

);



});



toast(
"Copiado."
);



}






function pasteSelection(){


saveHistory();



App.clipboard.forEach(t=>{


tokens.push({


...t,


id:
Date.now()+Math.random(),


x:t.x+40,


y:t.y+40


});



});



renderTokens();


saveStorage();



}







function duplicateSelection(){


copySelection();


pasteSelection();



}








// ==========================================
// DELETE
// ==========================================


function deleteSelection(){


saveHistory();



tokens =
tokens.filter(t=>

!App.selectedTokens.includes(
t.id
)

);



clearSelection();



renderTokens();


saveStorage();



}









// ==========================================
// ZOOM
// ==========================================


function updateViewport(){


updateZoom();


}



function updateZoom(){



DOM.map.style.transform =


`
translate(-50%,-50%)
scale(${App.zoom})
`;



DOM.zoomLabel.innerHTML =


Math.round(
App.zoom*100
)+"%";



}





function zoomWheel(e){



e.preventDefault();



App.zoom +=

e.deltaY < 0
?
0.1
:
-0.1;



App.zoom=Math.max(

App.minZoom,

Math.min(
App.maxZoom,
App.zoom
)

);



updateZoom();


}








// ==========================================
// TECLADO
// ==========================================


function keyboard(e){



if(e.key==="Delete")

deleteSelection();



if(e.key==="Escape")

clearSelection();




if(e.ctrlKey){



switch(
e.key.toLowerCase()
){



case "z":

undo();

break;



case "y":

redo();

break;



case "c":

copySelection();

break;



case "v":

pasteSelection();

break;



case "d":

duplicateSelection();

break;



}



}



}




function keyboardUp(e){



if(e.key===" ")

stopPan();



}








// ==========================================
// LOADING
// ==========================================


function hideLoading(){


if(!DOM.loading)
return;



setTimeout(()=>{


DOM.loading.style.opacity=0;


setTimeout(()=>{


DOM.loading.remove();


},500);



},600);



}








// ==========================================
// TOAST
// ==========================================


function toast(msg){



const div =
document.createElement(
"div"
);



div.className="toast";


div.innerHTML=msg;



document.body.appendChild(div);



setTimeout(()=>{


div.remove();



},2500);



}
