// ==========================================
// DRAG TOKENS RPG
// ==========================================


let draggingToken = null;

let dragOffset = {

    x:0,

    y:0

};




// ==========================================
// INICIAR
// ==========================================


document.addEventListener(
"mousedown",
e=>{



const tokenElement =
e.target.closest(".token");



if(!tokenElement)
return;



// BOTÃO DIREITO
if(e.button===2)
return;



const id =
Number(
tokenElement.dataset.id
);



draggingToken =
tokens.find(
t=>t.id===id
);



if(!draggingToken)
return;



saveHistory();




// posição relativa ao token

dragOffset.x =

e.clientX -

tokenElement.getBoundingClientRect().left;



dragOffset.y =

e.clientY -

tokenElement.getBoundingClientRect().top;



tokenElement.classList.add(
"dragging"
);





// seleção

if(
!App.selectedTokens.includes(id)
){


clearSelection();


addSelection(id);


renderSelection();


}




e.preventDefault();



});







// ==========================================
// MOVIMENTO
// ==========================================


document.addEventListener(
"mousemove",
e=>{



if(!draggingToken)
return;





const rect =
DOM.map.getBoundingClientRect();





let x =

(
e.clientX -

rect.left -

dragOffset.x
)

/
App.zoom;



let y =

(
e.clientY -

rect.top -

dragOffset.y
)

/
App.zoom;






// SNAP GRID



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







// mover selecionados juntos


if(
App.selectedTokens.length > 1 &&
App.selectedTokens.includes(
draggingToken.id
)

){



const oldX =
draggingToken.x;



const oldY =
draggingToken.y;



const dx =
x-oldX;



const dy =
y-oldY;



App.selectedTokens.forEach(id=>{


const t =
tokens.find(
token=>token.id===id
);



if(t){


t.x += dx;


t.y += dy;


}



});



}else{



draggingToken.x=x;



draggingToken.y=y;



}






renderTokens();



});








// ==========================================
// SOLTAR
// ==========================================


document.addEventListener(
"mouseup",
e=>{



if(!draggingToken)
return;




const el =
document.querySelector(
`.token[data-id="${draggingToken.id}"]`
);



if(el){

el.classList.remove(
"dragging"
);

}



draggingToken=null;



saveStorage();



});








// ==========================================
// IMPEDIR MENU DIREITO
// ==========================================


document.addEventListener(
"contextmenu",
e=>{


if(
e.target.closest(".token")
){


e.preventDefault();


}



});
