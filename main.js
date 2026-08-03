// ==========================================
// MANIPULAÇÃO RPG
// MAIN.JS - CORE
// ==========================================


// ==========================================
// ESTADO GLOBAL
// ==========================================

const App = {

    version:"2.0.0",

    zoom:1,

    minZoom:0.3,

    maxZoom:4,


    gridSize:50,

    gridVisible:true,

    snapGrid:true,


    fogEnabled:false,

    measureMode:false,


    selectedTokens:[],

    clipboard:[],


    history:[],

    redoHistory:[],


    mapOffset:{
        x:0,
        y:0
    },


    mouse:{
        x:0,
        y:0
    },


    isPanning:false

};



// ==========================================
// DOM GLOBAL
// ==========================================

const DOM={

    map:null,

    mapWrapper:null,

    zoomValue:null,

    loading:null,

    contextMenu:null

};



// ==========================================
// START
// ==========================================

window.addEventListener(
    "load",
    startApp
);



function startApp(){


    cacheDOM();


    registerEvents();


    if(typeof loadStorage==="function")
        loadStorage();



    if(typeof renderLibrary==="function")
        renderLibrary();



    if(typeof renderTokens==="function")
        renderTokens();



    updateZoom();


    hideLoading();


    toast(
        "Manipulação RPG carregado."
    );


}




// ==========================================
// CACHE
// ==========================================

function cacheDOM(){


    DOM.map =
    document.getElementById("map");


    DOM.mapWrapper =
    document.getElementById(
        "mapWrapper"
    );


    DOM.zoomValue =
    document.getElementById(
        "zoomValue"
    );


    DOM.loading =
    document.getElementById(
        "loading"
    );


    DOM.contextMenu =
    document.getElementById(
        "contextMenu"
    );


}




// ==========================================
// EVENTOS
// ==========================================

function registerEvents(){


    window.addEventListener(
        "resize",
        updateZoom
    );


    document.addEventListener(
        "keydown",
        keyboard
    );


    document.addEventListener(
        "keyup",
        keyboardUp
    );


    document.addEventListener(
        "click",
        ()=>{
            
            if(typeof closeContextMenu==="function")
                closeContextMenu();

        }
    );



    if(DOM.mapWrapper){

        DOM.mapWrapper.addEventListener(
            "wheel",
            zoomWheel,
            {
                passive:false
            }
        );

    }


}




// ==========================================
// HISTÓRICO
// ==========================================

function createState(){

    return {

        zoom:App.zoom,

        grid:App.gridVisible,

        snap:App.snapGrid,


        tokens:
        JSON.parse(
            JSON.stringify(
                tokens || []
            )
        ),


        selection:
        [
            ...App.selectedTokens
        ]

    };

}




function saveHistory(){


    App.history.push(
        createState()
    );


    if(App.history.length>50){

        App.history.shift();

    }


    App.redoHistory=[];


}




// ==========================================
// UNDO
// ==========================================

function undo(){


    if(App.history.length===0){

        toast(
            "Nada para desfazer."
        );

        return;

    }



    App.redoHistory.push(
        createState()
    );



    const state =
    App.history.pop();



    restoreState(state);



    toast(
        "Desfeito."
    );

}




// ==========================================
// REDO
// ==========================================

function redo(){


    if(App.redoHistory.length===0){

        toast(
            "Nada para refazer."
        );

        return;

    }



    App.history.push(
        createState()
    );



    const state =
    App.redoHistory.pop();



    restoreState(state);



    toast(
        "Refeito."
    );

}




function restoreState(state){


    App.zoom =
    state.zoom;


    App.gridVisible =
    state.grid;


    App.snapGrid =
    state.snap;



    tokens =
    JSON.parse(
        JSON.stringify(
            state.tokens
        )
    );



    App.selectedTokens =
    [
        ...state.selection
    ];



    if(typeof renderTokens==="function")
        renderTokens();



    updateZoom();


}



// ==========================================
// SELEÇÃO
// ==========================================

function clearSelection(){


    App.selectedTokens=[];



    document
    .querySelectorAll(
        ".token"
    )
    .forEach(t=>{

        t.classList.remove(
            "selected"
        );

    });


}




function addSelection(id){


    if(
        !App.selectedTokens.includes(id)
    ){

        App.selectedTokens.push(id);

    }

}




function removeSelection(id){


    App.selectedTokens =
    App.selectedTokens.filter(
        t=>t!==id
    );


}



function selectAll(){


    clearSelection();



    tokens.forEach(t=>{

        App.selectedTokens.push(
            t.id
        );

    });



    renderSelection();


}




function renderSelection(){


    document
    .querySelectorAll(
        ".token"
    )
    .forEach(t=>{

        t.classList.remove(
            "selected"
        );

    });



    App.selectedTokens.forEach(id=>{


        const token =
        document.querySelector(
            `.token[data-id="${id}"]`
        );



        if(token){

            token.classList.add(
                "selected"
            );

        }


    });


}




// ==========================================
// COPIAR / COLAR
// ==========================================


function copySelection(){


    App.clipboard=[];



    App.selectedTokens.forEach(id=>{


        const token =
        tokens.find(
            t=>t.id===id
        );


        if(token){

            App.clipboard.push(
                structuredClone(token)
            );

        }


    });



    toast(
        "Copiado."
    );


}





function pasteSelection(){


    if(
        App.clipboard.length===0
    )
        return;



    saveHistory();



    App.clipboard.forEach(t=>{


        tokens.push({

            ...t,

            id:
            Date.now()+Math.random(),

            x:t.x+50,

            y:t.y+50

        });


    });



    renderTokens();


    saveStorage();



}




// ==========================================
// DELETE
// ==========================================

function deleteSelection(){


    if(
        App.selectedTokens.length===0
    )
    return;



    saveHistory();



    tokens =
    tokens.filter(
        t=>
        !App.selectedTokens.includes(
            t.id
        )
    );



    clearSelection();


    renderTokens();


    saveStorage();


}



// ==========================================
// ZOOM
// ==========================================

function updateZoom(){


    if(!DOM.map)
        return;



    DOM.map.style.transform =
    `
    translate(-50%,-50%)
    scale(${App.zoom})
    `;



    if(DOM.zoomValue){

        DOM.zoomValue.textContent =
        Math.round(
            App.zoom*100
        )+"%";

    }


}



function zoomWheel(e){


    e.preventDefault();



    App.zoom +=
    e.deltaY < 0
    ?0.1
    :-0.1;



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
// TECLADO
// ==========================================

function keyboard(e){


    if(
        e.ctrlKey
    ){


        switch(
            e.key.toLowerCase()
        ){


            case "z":

                e.preventDefault();

                undo();

            break;


            case "y":

                e.preventDefault();

                redo();

            break;


            case "c":

                e.preventDefault();

                copySelection();

            break;


            case "v":

                e.preventDefault();

                pasteSelection();

            break;


        }


    }




    switch(e.key){


        case "Delete":

            deleteSelection();

        break;



        case "Escape":

            clearSelection();

        break;



        case " ":

            e.preventDefault();

            if(typeof startPan==="function")
                startPan();

        break;



    }



}



function keyboardUp(e){


    if(
        e.code==="Space"
    ){

        if(typeof stopPan==="function")
            stopPan();

    }


}




// ==========================================
// LOADING
// ==========================================

function hideLoading(){


    if(!DOM.loading)
        return;



    setTimeout(()=>{


        DOM.loading.style.opacity=0;



        setTimeout(()=>{

            DOM.loading.remove();

        },500);



    },600);



}




// ==========================================
// TOAST
// ==========================================

function toast(msg){


    const div =
    document.createElement(
        "div"
    );


    div.className="toast";


    div.textContent=msg;



    document.body.appendChild(
        div
    );



    setTimeout(()=>{


        div.classList.add(
            "hide"
        );



        setTimeout(()=>{

            div.remove();

        },300);



    },2000);


}
