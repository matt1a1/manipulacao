// ==========================================
// MANIPULAÇÃO RPG
// ZOOM.JS
// ==========================================


// ==========================================
// INICIAR
// ==========================================


window.addEventListener(
"load",
initZoom
);



function initZoom(){



const plus =
document.getElementById(
"zoomIn"
);



const minus =
document.getElementById(
"zoomOut"
);




if(plus){


plus.onclick=function(){


changeZoom(
0.1
);


};


}





if(minus){


minus.onclick=function(){


changeZoom(
-0.1
);


};


}





updateZoom();



}









// ==========================================
// ALTERAR ZOOM
// ==========================================


function changeZoom(value){



App.zoom += value;



if(App.zoom<App.minZoom){



App.zoom =
App.minZoom;



}



if(App.zoom>App.maxZoom){



App.zoom =
App.maxZoom;



}



updateZoom();



}









// ==========================================
// ZOOM PELO MOUSE
// ==========================================


function mouseZoom(e){



e.preventDefault();



changeZoom(

e.deltaY < 0
?
0.1
:
-0.1

);



}









// ==========================================
// ATUALIZAR
// ==========================================


function updateZoom(){



if(!DOM.map)
return;




DOM.map.style.transform =

`

translate(-50%,-50%)
scale(${App.zoom})

`;





if(DOM.zoomLabel){



DOM.zoomLabel.innerHTML =

Math.round(
App.zoom*100
)
+"%";



}



}









// ==========================================
// RESET
// ==========================================


function resetZoom(){



App.zoom=1;



updateZoom();



toast(
"Zoom restaurado."
);



}
