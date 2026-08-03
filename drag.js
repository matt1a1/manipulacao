// ==========================================
// DRAG.JS
// MANIPULAÇÃO RPG
// ==========================================



let draggingToken = null;


let dragOffset = {

    x:0,

    y:0

};



let panning = false;


let panStart = {

    x:0,

    y:0

};


let mapStart = {

    x:0,

    y:0

};







// ==========================================
// INICIAR
// ==========================================


window.addEventListener(

"load",

()=>{


    registerDrag();


});







// ==========================================
// REGISTRAR EVENTOS
// ==========================================


function registerDrag(){



    if(!DOM.map)
        return;



    DOM.map.addEventListener(

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



    const tokenElement =

    e.target.closest(
        ".token"
    );





    // ======================
    // TOKEN
    // ======================


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





        saveHistory();





        if(
            !e.ctrlKey
            &&
            !App.selectedTokens.includes(id)
        ){


            clearSelection();


            addSelection(id);



        }







        draggingToken = token;





        dragOffset.x =

        e.clientX -

        token.x;



        dragOffset.y =

        e.clientY -

        token.y;





        tokenElement.classList.add(

            "dragging"

        );



        return;



    }







    // ======================
    // PAN MAPA
    // ======================


    if(e.button===0){


        if(
            e.target===DOM.map
            ||
            e.target===DOM.wrapper
        ){



            startPan();



            panStart.x=e.clientX;


            panStart.y=e.clientY;



            mapStart.x=

            App.mapOffset.x;



            mapStart.y=

            App.mapOffset.y;



        }


    }



}









// ==========================================
// MOVIMENTO
// ==========================================


function mouseMove(e){



    // =====================
    // TOKEN
    // =====================



    if(draggingToken){



        let x =

        e.clientX -

        dragOffset.x;



        let y =

        e.clientY -

        dragOffset.y;







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









    // =====================
    // PAN
    // =====================



    if(panning){



        const dx =

        e.clientX -

        panStart.x;



        const dy =

        e.clientY -

        panStart.y;





        App.mapOffset.x =

        mapStart.x + dx;



        App.mapOffset.y =

        mapStart.y + dy;





        updateMapPosition();



    }



}









// ==========================================
// SOLTAR
// ==========================================


function mouseUp(){



    if(draggingToken){



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



        toast(
            "Token movido."
        );



    }







    stopPan();



}








// ==========================================
// PAN
// ==========================================


function startPan(){


    panning=true;



    if(DOM.wrapper){


        DOM.wrapper.classList.add(

            "grabbing"

        );


    }


}







function stopPan(){


    panning=false;



    if(DOM.wrapper){


        DOM.wrapper.classList.remove(

            "grabbing"

        );


    }


}








// ==========================================
// ATUALIZAR POSIÇÃO DO MAPA
// ==========================================


function updateMapPosition(){



    if(!DOM.map)
        return;





    DOM.map.style.marginLeft =

    App.mapOffset.x+"px";



    DOM.map.style.marginTop =

    App.mapOffset.y+"px";



}
