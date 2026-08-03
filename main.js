// ==========================================
// MANIPULAÇÃO RPG
// MAIN.JS
// ==========================================


// ==========================================
// CONFIGURAÇÃO DA APLICAÇÃO
// ==========================================

const App = {


    version:"2.0.0",


    zoom:1,


    minZoom:0.30,


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
// VARIÁVEIS GLOBAIS
// ==========================================


let tokens = [];






// ==========================================
// ELEMENTOS DOM
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
// INICIAR SISTEMA
// ==========================================


window.addEventListener(

"load",

init

);







function init(){



    cacheDOM();



    loadStorage();



    registerEvents();



    if(typeof renderLibrary==="function"){


        renderLibrary();


    }




    if(typeof renderTokens==="function"){


        renderTokens();


    }




    updateZoom();



    hideLoading();



    toast(

        "Mesa carregada com sucesso."

    );



}









// ==========================================
// PEGAR ELEMENTOS HTML
// ==========================================


function cacheDOM(){



    DOM.map =

    document.getElementById(

        "map"

    );



    DOM.wrapper =

    document.getElementById(

        "mapWrapper"

    );



    DOM.sidebar =

    document.getElementById(

        "sidebar"

    );



    DOM.zoomLabel =

    document.getElementById(

        "zoomValue"

    );



    DOM.loading =

    document.getElementById(

        "loading"

    );



    DOM.library =

    document.getElementById(

        "libraryList"

    );



    DOM.initiative =

    document.getElementById(

        "initiativeList"

    );



    DOM.contextMenu =

    document.getElementById(

        "contextMenu"

    );



}








// ==========================================
// EVENTOS GERAIS
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



}








// ==========================================
// HISTÓRICO
// ==========================================


function saveHistory(){



    const state={



        zoom:App.zoom,


        grid:App.gridVisible,


        snap:App.snapGrid,



        tokens:

        JSON.parse(

            JSON.stringify(tokens)

        )



    };



    App.history.push(state);





    if(App.history.length>50){


        App.history.shift();


    }





    App.redoHistory=[];


}









// ==========================================
// DESFAZER
// ==========================================


function undo(){



    if(App.history.length===0){



        toast(

            "Nada para desfazer."

        );


        return;


    }






    const current={


        zoom:App.zoom,


        grid:App.gridVisible,


        snap:App.snapGrid,



        tokens:

        JSON.parse(

            JSON.stringify(tokens)

        )

    };



    App.redoHistory.push(current);





    const state =

    App.history.pop();





    App.zoom=state.zoom;


    App.gridVisible=state.grid;


    App.snapGrid=state.snap;



    tokens =

    JSON.parse(

        JSON.stringify(

            state.tokens

        )

    );





    renderTokens();



    updateZoom();



    saveStorage();



}









// ==========================================
// REFAZER
// ==========================================


function redo(){



    if(App.redoHistory.length===0){



        toast(

            "Nada para refazer."

        );


        return;


    }






    const current={



        zoom:App.zoom,


        grid:App.gridVisible,


        snap:App.snapGrid,



        tokens:

        JSON.parse(

            JSON.stringify(tokens)

        )



    };



    App.history.push(current);





    const state=

    App.redoHistory.pop();





    App.zoom=state.zoom;


    App.gridVisible=state.grid;


    App.snapGrid=state.snap;





    tokens=

    JSON.parse(

        JSON.stringify(

            state.tokens

        )

    );





    renderTokens();



    updateZoom();



    saveStorage();



}









// ==========================================
// SELEÇÃO
// ==========================================


function clearSelection(){



    App.selectedTokens=[];



    document

    .querySelectorAll(".token")

    .forEach(el=>{


        el.classList.remove(

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

    .forEach(el=>{


        el.classList.remove(

            "selected"

        );


    });





    App.selectedTokens.forEach(id=>{



        const el=

        document.querySelector(

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
// COPIAR / COLAR
// ==========================================


function copySelection(){



    App.clipboard=[];



    App.selectedTokens.forEach(id=>{



        const token=

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


}








// ==========================================
// DUPLICAR
// ==========================================


function duplicateSelection(){



    copySelection();



    pasteSelection();



}








// ==========================================
// ZOOM
// ==========================================


function updateViewport(){


    updateZoom();


}





function updateZoom(){



    if(!DOM.map)

        return;





    DOM.map.style.transform=

    `translate(-50%,-50%) scale(${App.zoom})`;





    if(DOM.zoomLabel){



        DOM.zoomLabel.textContent=

        Math.round(App.zoom*100)+"%";


    }


}









// ==========================================
// TECLADO
// ==========================================


function keyboard(e){



    if(e.target.tagName==="INPUT")

        return;





    if(e.key==="Delete"){


        deleteSelection();


    }



    if(e.key==="Escape"){


        clearSelection();


    }






    if(e.ctrlKey){



        if(e.key==="z")

            undo();



        if(e.key==="y")

            redo();



        if(e.key==="c")

            copySelection();



        if(e.key==="v")

            pasteSelection();



    }



}







function keyboardUp(e){



    if(e.key===" "){


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



        DOM.loading.style.opacity="0";



        setTimeout(()=>{


            DOM.loading.remove();


        },500);



    },600);



}








// ==========================================
// NOTIFICAÇÃO
// ==========================================


function toast(msg){



    const div=

    document.createElement(

        "div"

    );



    div.className="toast";



    div.textContent=msg;



    document.body.appendChild(div);





    setTimeout(()=>{



        div.remove();



    },2500);



}
