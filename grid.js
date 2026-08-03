// ==========================================
// MANIPULAÇÃO RPG
// GRID.JS
// ==========================================



// ==========================================
// INICIAR GRID
// ==========================================


window.addEventListener(
"load",
initGrid
);





function initGrid(){



const button =
document.getElementById(
"toggleGrid"
);



if(button){


button.onclick=function(){



toggleGrid();



};



}



applyGrid();



}








// ==========================================
// MOSTRAR / ESCONDER GRID
// ==========================================


function toggleGrid(){



App.gridVisible =
!App.gridVisible;



applyGrid();



saveStorage();



if(App.gridVisible){



toast(
"Grid ativado."
);



}

else{


toast(
"Grid desativado."
);



}



}









// ==========================================
// APLICAR GRID
// ==========================================


function applyGrid(){



if(!DOM.map)
return;




if(
App.gridVisible
){



DOM.map.classList.add(
"grid50"
);



}

else{


DOM.map.style.backgroundImage =
"none";



}



}









// ==========================================
// ALTERAR TAMANHO
// ==========================================


function changeGridSize(size){



App.gridSize =
size;



DOM.map.style.backgroundSize =

size+"px "+size+"px";



saveStorage();



}









// ==========================================
// RESET GRID
// ==========================================


function resetGrid(){



App.gridSize=50;



App.gridVisible=true;



applyGrid();



saveStorage();



toast(
"Grid restaurado."
);



}
