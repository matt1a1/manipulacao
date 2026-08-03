// ==========================================
// GRID / FOG / RÉGUA
// ==========================================




// ==========================================
// GRID
// ==========================================

function toggleGrid(){


    App.gridVisible =
    !App.gridVisible;



    if(!DOM.map)
        return;



    if(App.gridVisible){


        DOM.map.style.backgroundImage =

        `

        linear-gradient(
        rgba(255,255,255,.04) 1px,
        transparent 1px
        ),

        linear-gradient(
        90deg,
        rgba(255,255,255,.04) 1px,
        transparent 1px
        )

        `;


    }
    else{


        DOM.map.style.backgroundImage =
        "none";


    }



    saveStorage();



}






// ==========================================
// FOG OF WAR
// ==========================================


function toggleFog(){


    App.fogEnabled =
    !App.fogEnabled;



    let fog =
    document.getElementById(
        "fogCanvas"
    );



    if(!fog){


        fog =
        document.createElement(
            "div"
        );


        fog.id =
        "fogCanvas";


        DOM.map.appendChild(
            fog
        );


    }



    fog.style.display =
    App.fogEnabled
    ?
    "block"
    :
    "none";



    if(App.fogEnabled){


        fog.style.background =
        "rgba(0,0,0,.8)";


    }


}







// ==========================================
// RÉGUA
// ==========================================


let measureStart=null;



function toggleMeasure(){


    App.measureMode =
    !App.measureMode;



    if(App.measureMode){


        toast(
            "Clique no mapa para medir."
        );


    }
    else{


        removeMeasure();


    }


}





document.addEventListener(
"click",
e=>{


    if(
        !App.measureMode
    )
        return;



    if(
        !e.target.closest(
            "#map"
        )
    )
        return;




    if(!measureStart){


        measureStart={

            x:e.offsetX,

            y:e.offsetY

        };


        return;

    }




    const distance =

    Math.sqrt(

        Math.pow(
            e.offsetX-measureStart.x,
            2
        )

        +

        Math.pow(
            e.offsetY-measureStart.y,
            2
        )

    );



    toast(

        "Distância: "
        +
        Math.round(distance/50)
        +
        " quadrados"

    );



    measureStart=null;


});






function removeMeasure(){


    document
    .querySelectorAll(
        "#measureLine,#measureText"
    )
    .forEach(
        e=>e.remove()
    );


}





// ==========================================
// EVENTOS
// ==========================================

window.addEventListener(
"load",
()=>{


    document
    .getElementById(
        "toggleGrid"
    )
    ?.addEventListener(
        "click",
        toggleGrid
    );



    document
    .getElementById(
        "toggleFog"
    )
    ?.addEventListener(
        "click",
        toggleFog
    );



    document
    .getElementById(
        "toggleMeasure"
    )
    ?.addEventListener(
        "click",
        toggleMeasure
    );


});
