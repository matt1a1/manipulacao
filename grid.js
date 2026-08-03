// ==========================================
// MANIPULAÇÃO RPG
// GRID.JS
// ==========================================



// ==========================================
// INICIALIZAÇÃO
// ==========================================


window.addEventListener(
"load",
()=>{

    initGrid();

}

);





function initGrid(){


    const button =
    document.getElementById(
    "toggleGrid"
    );



    if(button){


        button.addEventListener(
        "click",
        toggleGrid
        );


    }



    updateGrid();



}







// ==========================================
// MOSTRAR / ESCONDER GRID
// ==========================================


function toggleGrid(){


    saveHistory();



    App.gridVisible =
    !App.gridVisible;



    updateGrid();



    saveStorage();



    toast(

    App.gridVisible

    ?

    "Grid ativado."

    :

    "Grid desativado."

    );



}







// ==========================================
// ATUALIZAR GRID
// ==========================================


function updateGrid(){


    if(!DOM.map)
    return;



    if(App.gridVisible){


        DOM.map.classList.add(
        "grid50"
        );


    }

    else{


        DOM.map.classList.remove(
        "grid50"
        );


    }



}







// ==========================================
// ALTERAR TAMANHO
// ==========================================


function setGridSize(size){


    App.gridSize =
    size;



    DOM.map.classList.remove(
    "grid25",
    "grid50",
    "grid75",
    "grid100"
    );



    DOM.map.classList.add(
    "grid"+size
    );



    saveStorage();



}








// ==========================================
// SNAP
// ==========================================


function snapPosition(x,y){



if(!App.snapGrid)

return {

x:x,

y:y

};




const grid =
App.gridSize;



return {


x:
Math.round(
x/grid
)
*
grid,



y:
Math.round(
y/grid
)
*
grid



};



}







// ==========================================
// ATIVAR/DESATIVAR SNAP
// ==========================================


function toggleSnap(){


App.snapGrid =
!App.snapGrid;



toast(

App.snapGrid

?

"Snap ativado."

:

"Snap desativado."

);



saveStorage();



}







// ==========================================
// CALCULAR POSIÇÃO DO MOUSE
// ==========================================


function getMapPosition(event){



const rect =
DOM.map.getBoundingClientRect();




let x =
(event.clientX - rect.left)
/
App.zoom;



let y =
(event.clientY - rect.top)
/
App.zoom;





return snapPosition(
x,
y
);



}







// ==========================================
// GRID DINÂMICO COM ZOOM
// ==========================================


function refreshGridZoom(){



if(!DOM.map)
return;




const size =
App.gridSize *
App.zoom;



DOM.map.style.backgroundSize =

`${size}px ${size}px`;



}






// Atualiza quando zoom mudar

const oldUpdateZoom =
window.updateZoom;



window.updateZoom =
function(){


if(oldUpdateZoom)

oldUpdateZoom();



refreshGridZoom();



};
