// ==========================================
// MANIPULAÇÃO RPG
// MAIN.JS
// ==========================================

const App = {

    version: "2.0.0",

    zoom: 1,

    minZoom: .30,

    maxZoom: 4,

    gridSize: 50,

    snapGrid: true,

    gridVisible: true,

    fogEnabled: false,

    measureMode: false,

    selectedTokens: [],

    clipboard: [],

    history: [],

    redoHistory: [],

    mouse: {

        x:0,

        y:0

    },

    mapOffset:{

        x:0,

        y:0

    }

};

// ==========================================
// ELEMENTOS
// ==========================================

const DOM = {

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
// CACHE
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

    window.addEventListener("resize",updateViewport);

    document.addEventListener("keydown",keyboard);

    document.addEventListener("keyup",keyboardUp);

    document.addEventListener("click",closeContextMenu);

    DOM.wrapper.addEventListener("wheel",zoomWheel,{
        passive:false
    });

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
// VIEWPORT
// ==========================================

function updateViewport(){

    updateZoom();

}

// ==========================================
// ZOOM
// ==========================================

function updateZoom(){

    DOM.map.style.transform=
        `translate(-50%,-50%) scale(${App.zoom})`;

    DOM.zoomLabel.textContent=
        Math.round(App.zoom*100)+"%";

}

// ==========================================
// MOUSE WHEEL
// ==========================================

function zoomWheel(e){

    e.preventDefault();

    if(e.deltaY<0){

        App.zoom+=0.1;

    }else{

        App.zoom-=0.1;

    }

    if(App.zoom<App.minZoom){

        App.zoom=App.minZoom;

    }

    if(App.zoom>App.maxZoom){

        App.zoom=App.maxZoom;

    }

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

// ==========================================
// KEYUP
// ==========================================

function keyboardUp(e){

    if(e.key===" "){

        stopPan();

    }

}
