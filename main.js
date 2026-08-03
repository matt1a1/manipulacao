// ==========================================
// MANIPULAÇÃO RPG
// MAIN.JS
// ==========================================


// ==========================================
// APP
// ==========================================

const App = {


    version:"2.0.0",


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


const DOM = {


    map:null,


    wrapper:null,


    sidebar:null,


    zoomLabel:null,


    loading:null,


    library:null,


    initiative:null,


    contextMenu:null


};






// ==========================================
// INICIAR
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
    "Mesa carregada com sucesso."
    );


}







// ==========================================
// CACHE
// ==========================================


function cacheDOM(){


    DOM.map =
    document.getElementById(
    "map"
    );


    DOM.wrapper =
    document.getElementById(
    "mapWrapper"
    );


    DOM.sidebar =
    document.getElementById(
    "sidebar"
    );


    DOM.zoomLabel =
    document.getElementById(
    "zoomValue"
    );


    DOM.loading =
    document.getElementById(
    "loading"
    );


    DOM.library =
    document.getElementById(
    "libraryList"
    );


    DOM.initiative =
    document.getElementById(
    "initiativeList"
    );


    DOM.contextMenu =
    document.getElementById(
    "contextMenu"
    );


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



document.addEventListener(
"click",
closeContextMenu
);



}








// ==========================================
// HISTÓRIA
// ==========================================


function saveHistory(){


const state={


zoom:App.zoom,


offset:
{
x:App.mapOffset.x,
y:App.mapOffset.y
},


grid:App.gridVisible,


snap:App.snapGrid,


tokens:
JSON.parse(
JSON.stringify(tokens)
)



};



App.history.push(state);



if(App.history.length>50)

App.history.shift();



App.redoHistory=[];



}







// ==========================================
// UNDO
// ==========================================


function undo(){


if(!App.history.length){

toast(
"Nada para desfazer."
);

return;

}



const current={


zoom:App.zoom,


offset:
{
x:App.mapOffset.x,
y:App.mapOffset.y
},


grid:App.gridVisible,


snap:App.snapGrid,


tokens:
JSON.parse(
JSON.stringify(tokens)
)


};



App.redoHistory.push(current);




const state =
App.history.pop();




App.zoom =
state.zoom;



App.mapOffset =
state.offset;



App.gridVisible =
state.grid;



App.snapGrid =
state.snap;



tokens =
JSON.parse(
JSON.stringify(
state.tokens
)
);



renderTokens();


updateZoom();



toast(
"Desfeito."
);



}








// ==========================================
// REDO
// ==========================================


function redo(){


if(!App.redoHistory.length){


toast(
"Nada para refazer."
);


return;


}



const current={


zoom:App.zoom,


offset:App.mapOffset,


grid:App.gridVisible,


snap:App.snapGrid,


tokens:
JSON.parse(
JSON.stringify(tokens)
)


};



App.history.push(current);




const state =
App.redoHistory.pop();



App.zoom =
state.zoom;



App.mapOffset =
state.offset;



App.gridVisible =
state.grid;



App.snapGrid =
state.snap;



tokens =
JSON.parse(
JSON.stringify(
state.tokens
)
);



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






function removeSelection(id){


App.selectedTokens =
App.selectedTokens.filter(
t=>t!==id
);


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
// DELETE
// ==========================================


function deleteSelection(){


if(!App.selectedTokens.length)

return;



saveHistory();



tokens =
tokens.filter(
t=>
!App.selectedTokens.includes(
t.id
)
);



clearSelection();



renderTokens();



saveStorage();



toast(
"Token removido."
);



}







// ==========================================
// COPIAR
// ==========================================


function copySelection(){


App.clipboard=[];



App.selectedTokens.forEach(id=>{


const t =
tokens.find(
x=>x.id===id
);



if(t)

App.clipboard.push(
JSON.parse(
JSON.stringify(t)
)
);


});



toast(
"Copiado."
);



}







// ==========================================
// COLAR
// ==========================================


function pasteSelection(){


if(!App.clipboard.length)

return;



saveHistory();



App.clipboard.forEach(t=>{


tokens.push({


...t,


id:
Date.now()+Math.random(),


x:t.x+50,


y:t.y+50


});



});



renderTokens();


saveStorage();



toast(
"Colado."
);



}







// ==========================================
// DUPLICAR
// ==========================================


function duplicateSelection(){


if(!App.selectedTokens.length)

return;



saveHistory();



App.selectedTokens.forEach(id=>{


const t =
tokens.find(
x=>x.id===id
);



if(t)


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









// ==========================================
// ZOOM
// ==========================================


function updateZoom(){


if(typeof applyZoom==="function"){


applyZoom();


}


}








// ==========================================
// LOADING
// ==========================================


function hideLoading(){


setTimeout(()=>{


if(!DOM.loading)
return;



DOM.loading.style.opacity="0";



setTimeout(()=>{


DOM.loading.remove();


},500);



},600);



}







// ==========================================
// TOAST
// ==========================================


function toast(message){


const div =
document.createElement(
"div"
);



div.className="toast";


div.innerText =
message;



document.body.appendChild(
div
);



setTimeout(()=>{


div.classList.add(
"hide"
);



setTimeout(()=>{


div.remove();



},300);



},2200);



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


case "c":

copySelection();

break;



case "v":

pasteSelection();

break;



case "z":

undo();

break;



case "y":

redo();

break;



case "d":

duplicateSelection();

break;



}


}



}






function keyboardUp(e){



}
