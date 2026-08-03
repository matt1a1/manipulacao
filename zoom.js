// ==========================================
// ZOOM CONTROL
// ==========================================



window.addEventListener(
"load",
()=>{


    const zoomIn =
    document.getElementById(
        "zoomIn"
    );


    const zoomOut =
    document.getElementById(
        "zoomOut"
    );



    zoomIn?.addEventListener(
        "click",
        ()=>{
            changeZoom(
                0.1
            );
        }
    );



    zoomOut?.addEventListener(
        "click",
        ()=>{
            changeZoom(
                -0.1
            );
        }
    );



});




// ==========================================
// ALTERAR ZOOM
// ==========================================

function changeZoom(value){


    App.zoom += value;



    if(App.zoom<App.minZoom)

        App.zoom=App.minZoom;



    if(App.zoom>App.maxZoom)

        App.zoom=App.maxZoom;



    updateZoom();



    showZoomIndicator();


}




// ==========================================
// ZOOM CENTRALIZADO
// ==========================================

function zoomTo(value){


    App.zoom=value;



    App.zoom =
    Math.max(
        App.minZoom,
        Math.min(
            App.maxZoom,
            App.zoom
        )
    );



    updateZoom();


}





// ==========================================
// INDICADOR
// ==========================================

function showZoomIndicator(){


    let indicator =
    document.getElementById(
        "zoomIndicator"
    );



    if(!indicator)
        return;



    indicator.textContent =
    Math.round(
        App.zoom*100
    )+"%";



    indicator.classList.add(
        "show"
    );



    clearTimeout(
        indicator.timer
    );



    indicator.timer =
    setTimeout(
        ()=>{

            indicator.classList.remove(
                "show"
            );

        },
        800
    );


}




// ==========================================
// ZOOM PELO MOUSE
// ==========================================

document.addEventListener(
"wheel",
e=>{


    if(
        !e.ctrlKey &&
        e.target.closest("#mapWrapper")
    ){

        return;

    }


},
{
    passive:true
});
