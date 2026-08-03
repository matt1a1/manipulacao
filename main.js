// ==========================================
// MANIPULAÇÃO RPG - MAIN.JS
// ==========================================


// ==========================================
// APP
// ==========================================

const App = {

    version:"2.0.0",

    zoom:1,

    minZoom:.30,

    maxZoom:4,

    gridSize:50,

    snapGrid:true,

    gridVisible:true,

    fogEnabled:false,

    measureMode:false,


    selectedTokens:[],

    clipboard:[],


    history:[],

    redoHistory:[],


    mouse:{
        x:0,
        y:0
    },


    mapOffset:{
        x:0,
        y:0
    }

};



// ==========================================
// DOM
// ==========================================

const DOM={

    map:null,

    wrapper:null,

    sidebar:null,

    zoomLabel:null,

    loading:null,

    library:null,

    initiative:null,

    contextMenu:null

};



// ==========================================
// INICIALIZAÇÃO
// ==========================================

window.addEventListener("load",init);


function init(){

    cacheDOM();

    registerEvents();

    loadStorage();

    renderLibrary();

    renderTokens();

    updateZoom();

    hideLoading();

    toast("Mesa carregada com sucesso.");

}



// ==========================================
// CACHE ELEMENTOS
// ==========================================

function cacheDOM(){

    DOM.map=document.getElementById("map");

    DOM.wrapper=document.getElementById("mapWrapper");

    DOM.sidebar=document.getElementById("sidebar");

    DOM.zoomLabel=document.getElementById("zoomValue");

    DOM.loading=document.getElementById("loading");

    DOM.library=document.getElementById("libraryList");

    DOM.initiative=document.getElementById("initiativeList");

    DOM.contextMenu=document.getElementById("contextMenu");

}



// ==========================================
// EVENTOS
// ==========================================

function registerEvents(){

    window.addEventListener(
        "resize",
        updateViewport
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
        closeContextMenu
    );


    DOM.wrapper.addEventListener(
        "wheel",
        zoomWheel,
        {
            passive:false
        }
    );

}



// ==========================================
// HISTÓRICO
// ==========================================

function saveHistory(){

    const state={

        zoom:App.zoom,

        grid:App.gridVisible,

        snap:App.snapGrid,

        tokens:JSON.parse(JSON.stringify(tokens))

    };


    App.history.push(state);


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

        toast("Nada para desfazer.");

        return;

    }


    const current={

        zoom:App.zoom,

        grid:App.gridVisible,

        snap:App.snapGrid,

        tokens:JSON.parse(JSON.stringify(tokens))

    };


    App.redoHistory.push(current);


    const state=App.history.pop();


    App.zoom=state.zoom;

    App.gridVisible=state.grid;

    App.snapGrid=state.snap;


    tokens=
    JSON.parse(
        JSON.stringify(state.tokens)
    );


    renderTokens();

    updateZoom();


    toast("Desfeito.");

}



// ==========================================
// REDO
// ==========================================

function redo(){

    if(App.redoHistory.length===0){

        toast("Nada para refazer.");

        return;

    }


    const current={

        zoom:App.zoom,

        grid:App.gridVisible,

        snap:App.snapGrid,

        tokens:JSON.parse(JSON.stringify(tokens))

    };


    App.history.push(current);


    const state=App.redoHistory.pop();


    App.zoom=state.zoom;

    App.gridVisible=state.grid;

    App.snapGrid=state.snap;


    tokens=
    JSON.parse(
        JSON.stringify(state.tokens)
    );


    renderTokens();

    updateZoom();


    toast("Refeito.");

}



// ==========================================
// SELEÇÃO
// ==========================================

function clearSelection(){

    App.selectedTokens=[];


    document
    .querySelectorAll(".token")
    .forEach(token=>{

        token.classList.remove(
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


    tokens.forEach(token=>{

        App.selectedTokens.push(
            token.id
        );

    });


    renderSelection();

}



function renderSelection(){

    document
    .querySelectorAll(".token")
    .forEach(token=>{

        token.classList.remove(
            "selected"
        );

    });


    App.selectedTokens.forEach(id=>{


        const el=document.querySelector(
            `.token[data-id="${id}"]`
        );


        if(el){

            el.classList.add(
                "selected"
            );

        }

    });

}



// ==========================================
// DELETE
// ==========================================

function deleteSelection(){

    if(App.selectedTokens.length===0)
        return;


    saveHistory();


    tokens=tokens.filter(
        token=>
        !App.selectedTokens.includes(
            token.id
        )
    );


    clearSelection();


    renderTokens();


    saveStorage();


    toast("Token removido.");

}



// ==========================================
// DUPLICAR
// ==========================================

function duplicateSelection(){

    if(App.selectedTokens.length===0)
        return;


    saveHistory();


    const copies=[];


    App.selectedTokens.forEach(id=>{


        const original =
        tokens.find(
            t=>t.id===id
        );


        if(!original)return;


        copies.push({

            ...original,

            id:Date.now()+Math.random(),

            x:original.x+40,

            y:original.y+40

        });


    });



    tokens.push(...copies);


    renderTokens();

    saveStorage();


    toast("Duplicado.");

}



// ==========================================
// COPIAR
// ==========================================

function copySelection(){


    if(App.selectedTokens.length===0)
        return;



    App.clipboard=[];



    App.selectedTokens.forEach(id=>{


        const token =
        tokens.find(
            t=>t.id===id
        );



        if(token){

            App.clipboard.push(
                JSON.parse(
                    JSON.stringify(token)
                )
            );

        }


    });


    toast("Copiado.");

}



// ==========================================
// COLAR
// ==========================================

function pasteSelection(){

    if(App.clipboard.length===0)
        return;


    saveHistory();


    App.clipboard.forEach(token=>{


        tokens.push({

            ...token,

            id:Date.now()+Math.random(),

            x:token.x+50,

            y:token.y+50

        });


    });



    renderTokens();

    saveStorage();


    toast("Colado.");

}



// ==========================================
// LOADING
// ==========================================

function hideLoading(){

    setTimeout(()=>{

        DOM.loading.style.opacity="0";


        setTimeout(()=>{

            DOM.loading.remove();

        },500);


    },600);

}



// ==========================================
// TOAST
// ==========================================

function toast(message){

    const div=document.createElement("div");


    div.className="toast";


    div.textContent=message;


    document.body.appendChild(div);



    setTimeout(()=>{


        div.classList.add("hide");


        setTimeout(()=>{

            div.remove();

        },300);


    },2200);

}



// ==========================================
// ZOOM
// ==========================================

function updateViewport(){

    updateZoom();

}



function updateZoom(){

    DOM.map.style.transform =
    `translate(-50%,-50%) scale(${App.zoom})`;


    DOM.zoomLabel.textContent =
    Math.round(App.zoom*100)+"%";

}



function zoomWheel(e){

    e.preventDefault();


    App.zoom += e.deltaY < 0
    ? 0.1
    : -0.1;



    App.zoom=Math.max(
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


    switch(e.key){


        case "Delete":

            deleteSelection();

        break;


        case "Escape":

            clearSelection();

        break;


        case " ":

            startPan();

        break;

    }



    if(e.ctrlKey){


        switch(e.key.toLowerCase()){


            case "c":

                copySelection();

            break;



            case "v":

                pasteSelection();

            break;



            case "z":

                undo();

            break;



            case "y":

                redo();

            break;



            case "d":

                duplicateSelection();

            break;


        }


    }


}



function keyboardUp(e){

    if(e.key===" "){

        stopPan();

    }

}
