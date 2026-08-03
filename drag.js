// ==========================================
// DRAG SYSTEM
// Tokens + Movimento do mapa
// ==========================================


let draggingToken = null;

let dragOffset = {
    x:0,
    y:0
};


let mapDragging = false;


let lastMouse = {
    x:0,
    y:0
};




// ==========================================
// INICIAR
// ==========================================

window.addEventListener(
"load",
()=>{


    document.addEventListener(
        "mousedown",
        startDrag
    );


    document.addEventListener(
        "mousemove",
        moveDrag
    );


    document.addEventListener(
        "mouseup",
        endDrag
    );


});




// ==========================================
// COMEÇAR ARRASTAR
// ==========================================

function startDrag(e){


    const tokenElement =
    e.target.closest(
        ".token"
    );



    // TOKEN

    if(tokenElement){


        const id =
        Number(
            tokenElement.dataset.id
        );



        const token =
        tokens.find(
            t=>t.id===id
        );



        if(!token)
            return;



        if(typeof saveHistory==="function")
            saveHistory();



        draggingToken =
        token;



        dragOffset.x =
        e.clientX-token.x;



        dragOffset.y =
        e.clientY-token.y;



        tokenElement.classList.add(
            "dragging"
        );



        return;

    }




    // MAPA

    if(
        e.code==="Space" ||
        App.isPanning
    ){

        mapDragging=true;


        lastMouse.x=e.clientX;

        lastMouse.y=e.clientY;


        DOM.mapWrapper
        ?.classList.add(
            "grabbing"
        );


    }


}




// ==========================================
// MOVIMENTO
// ==========================================

function moveDrag(e){



    // TOKEN

    if(draggingToken){


        let x =
        e.clientX -
        dragOffset.x;



        let y =
        e.clientY -
        dragOffset.y;




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



        draggingToken.x=x;


        draggingToken.y=y;



        renderTokens();



        return;


    }




    // MAPA

    if(mapDragging){


        App.mapOffset.x +=
        e.clientX-lastMouse.x;



        App.mapOffset.y +=
        e.clientY-lastMouse.y;




        DOM.map.style.left =
        `calc(50% + ${App.mapOffset.x}px)`;



        DOM.map.style.top =
        `calc(50% + ${App.mapOffset.y}px)`;


        lastMouse.x=e.clientX;

        lastMouse.y=e.clientY;


    }


}





// ==========================================
// FINALIZAR
// ==========================================

function endDrag(e){



    if(draggingToken){



        const el =
        document.querySelector(
            `.token[data-id="${draggingToken.id}"]`
        );



        el?.classList.remove(
            "dragging"
        );



        saveStorage();



        draggingToken=null;


    }



    if(mapDragging){


        mapDragging=false;



        DOM.mapWrapper
        ?.classList.remove(
            "grabbing"
        );


    }


}





// ==========================================
// PAN PELO ESPAÇO
// ==========================================

function startPan(){

    App.isPanning=true;

}



function stopPan(){

    App.isPanning=false;

}
