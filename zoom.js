// ==========================================
// ZOOM RPG
// ==========================================


let zoomTimeout;




// ==========================================
// APLICAR ZOOM
// ==========================================


function applyZoom(){



DOM.map.style.transform =

`
translate(
${App.mapOffset.x}px,
${App.mapOffset.y}px
)
translate(-50%,-50%)
scale(${App.zoom})
`;





if(DOM.zoomLabel){


DOM.zoomLabel.innerText =

Math.round(
App.zoom*100
)
+
"%";


}



}



// ==========================================
// SCROLL ZOOM
// ==========================================


function zoomWheel(e){


e.preventDefault();




const oldZoom =
App.zoom;





if(e.deltaY < 0){


App.zoom += 0.1;


}else{


App.zoom -= 0.1;


}





App.zoom = Math.max(

App.minZoom,

Math.min(
App.maxZoom,
App.zoom
)

);





// manter mouse como centro


const rect =
DOM.map.getBoundingClientRect();




const mouseX =

e.clientX -

rect.left;



const mouseY =

e.clientY -

rect.top;





const scaleChange =

App.zoom / oldZoom;





App.mapOffset.x -=

(
mouseX -
rect.width/2
)
*
(
scaleChange-1
);





App.mapOffset.y -=

(
mouseY -
rect.height/2
)
*
(
scaleChange-1
);





applyZoom();

showZoomIndicator();



}







// ==========================================
// INDICADOR
// ==========================================


function showZoomIndicator(){



const indicator =

document.getElementById(
"zoomIndicator"
);



if(!indicator)
return;




indicator.innerText =

Math.round(
App.zoom*100
)
+
"%";



indicator.classList.add(
"show"
);



clearTimeout(
zoomTimeout
);



zoomTimeout =

setTimeout(()=>{


indicator.classList.remove(
"show"
);



},800);



}







// ==========================================
// BOTÕES
// ==========================================


window.addEventListener(
"load",
()=>{



document
.getElementById(
"zoomIn"
)
?.addEventListener(
"click",
()=>{


App.zoom += .1;



if(App.zoom > App.maxZoom)

App.zoom =
App.maxZoom;



applyZoom();



});






document
.getElementById(
"zoomOut"
)
?.addEventListener(
"click",
()=>{


App.zoom -= .1;



if(App.zoom < App.minZoom)

App.zoom =
App.minZoom;



applyZoom();



});





if(DOM.wrapper){


DOM.wrapper.addEventListener(

"wheel",

zoomWheel,

{

passive:false

}

);


}




});
