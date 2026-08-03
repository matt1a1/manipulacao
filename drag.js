// ==========================================
// MANIPULAÇÃO RPG
// DRAG.JS
// ==========================================


let draggingToken = null;

let dragOffset = {

    x:0,

    y:0

};


let isPanning=false;


let panStart={

    x:0,

    y:0

};




// ==========================================
// INICIAR
// ==========================================


window.addEventListener(
"load",
initDrag
);



function initDrag(){


document.addEventListener(
"mousedown",
mouseDown
);



document.addEventListener(
"mousemove",
mouseMove
);



document.addEventListener(
"mouseup",
mouseUp
);



}









// ==========================================
// MOUSE DOWN
// ==========================================


function mouseDown(e){



const token =
e.target.closest(
".token"
);



if(token){



const id =
Number(
token.dataset.id
);



const data =
tokens.find(
t=>t.id==id
);



if(!data)
return;



if(
!App.selectedTokens.includes(id)
){



clearSelection();



addSelection(id);



renderSelection();



}



draggingToken=data;



dragOffset.x =
e.clientX-data.x;



dragOffset.y =
e.clientY-data.y;



saveHistory();



return;



}






if(e.button===1 || e.key===" "){



startPan();



}




}









// ==========================================
// MOVIMENTO
// ==========================================


function mouseMove(e){



if(draggingToken){



let x =
e.clientX-dragOffset.x;



let y =
e.clientY-dragOffset.y;




if(App.snapGrid){



x =
Math.round(
x/App.gridSize
)
*
App.gridSize;



y =
Math.round(
y/App.gridSize
)
*
App.gridSize;



}



const dx =
x-draggingToken.x;



const dy =
y-draggingToken.y;




App.selectedTokens.forEach(id=>{



const token =
tokens.find(
t=>t.id===id
);



if(token){



token.x += dx;



token.y += dy;



}



});




renderTokens();



return;



}






if(isPanning){



const dx =
e.movementX;



const dy =
e.movementY;



App.mapOffset.x += dx;



App.mapOffset.y += dy;



DOM.map.style.left =

`calc(50% + ${App.mapOffset.x}px)`;



DOM.map.style.top =

`calc(50% + ${App.mapOffset.y}px)`;



}



}









// ==========================================
// SOLTAR
// ==========================================


function mouseUp(){



if(draggingToken){



draggingToken=null;



saveStorage();



}



isPanning=false;



DOM.wrapper.classList.remove(
"grabbing"
);



}









// ==========================================
// PAN
// ==========================================


function startPan(){



isPanning=true;



DOM.wrapper.classList.add(
"grabbing"
);



}



function stopPan(){



isPanning=false;



DOM.wrapper.classList.remove(
"grabbing"
);



}
