// ==========================================
// MANIPULAÇÃO RPG
// MAIN.JS
// ==========================================


// ==========================================
// APP
// ==========================================

const App = {

    version:"2.1.0",

    zoom:1,

    minZoom:0.3,

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
// START
// ==========================================


window.addEventListener(
    "load",
    init
);





function init(){


    cacheDOM();


    registerEvents();


    if(typeof loadStorage==="function"){

        loadStorage();

    }



    if(typeof renderLibrary==="function"){

        renderLibrary();

    }



    if(typeof renderTokens==="function"){

        renderTokens();

    }



    updateZoom();


    hideLoading();


    toast(
        "Mesa carregada."
    );


}








// ==========================================
// CACHE DOM
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

        ()=>{

            if(typeof closeContextMenu==="function"){

                closeContextMenu();

            }

        }

    );



    if(DOM.wrapper){


        DOM.wrapper.addEventListener(

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
// UNDO
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




    if(typeof renderTokens==="function"){

        renderTokens();

    }



    updateZoom();


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





    const state =
    App.redoHistory.pop();




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




    if(typeof renderTokens==="function"){

        renderTokens();

    }



    updateZoom();



    toast(
        "Refeito."
    );


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
    .querySelectorAll(
        ".token"
    )
    .forEach(el=>{


        el.classList.remove(
            "selected"
        );


    });




    App.selectedTokens.forEach(id=>{


        const el =

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
// DELETAR
// ==========================================


function deleteSelection(){


    if(
        App.selectedTokens.length===0
    )
        return;




    saveHistory();



    tokens =

    tokens.filter(token=>


        !App.selectedTokens.includes(
            token.id
        )


    );



    clearSelection();



    if(typeof renderTokens==="function"){

        renderTokens();

    }



    if(typeof saveStorage==="function"){

        saveStorage();

    }



    toast(
        "Token removido."
    );


}







// ==========================================
// DUPLICAR
// ==========================================


function duplicateSelection(){


    if(
        App.selectedTokens.length===0
    )
        return;



    saveHistory();



    let copies=[];




    App.selectedTokens.forEach(id=>{


        const original =

        tokens.find(

            t=>t.id===id

        );



        if(!original)
            return;




        copies.push({

            ...original,


            id:
            Date.now()+Math.random(),


            x:
            original.x+40,


            y:
            original.y+40


        });



    });





    tokens.push(
        ...copies
    );



    renderTokens();



    saveStorage();



    toast(
        "Duplicado."
    );


}







// ==========================================
// COPIAR
// ==========================================


function copySelection(){


    if(
        App.selectedTokens.length===0
    )
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




    toast(
        "Copiado."
    );


}






// ==========================================
// COLAR
// ==========================================


function pasteSelection(){


    if(
        App.clipboard.length===0
    )
        return;




    saveHistory();




    App.clipboard.forEach(token=>{


        tokens.push({

            ...token,


            id:
            Date.now()+Math.random(),


            x:
            token.x+50,


            y:
            token.y+50


        });


    });





    renderTokens();



    saveStorage();



    toast(
        "Colado."
    );


}

// ==========================================
// CRIAR TOKEN
// ==========================================


function createToken(){


    const nameInput =
    document.getElementById(
        "tokenName"
    );


    const colorInput =
    document.getElementById(
        "tokenColor"
    );


    const imageInput =
    document.getElementById(
        "tokenImage"
    );


    const sizeInput =
    document.getElementById(
        "tokenSize"
    );



    const name =
    nameInput.value.trim()
    ||
    "Novo Token";



    const color =
    colorInput.value;



    const size =
    Number(
        sizeInput.value
    );




    saveHistory();





    const token={


        id:
        Date.now(),


        name:name,


        color:color,


        size:size,


        image:null,


        x:200,


        y:200,


        hp:100,


        shield:0,


        rotation:0


    };





    if(
        imageInput.files.length
    ){


        const reader =
        new FileReader();



        reader.onload=function(e){


            token.image =
            e.target.result;



            tokens.push(token);



            renderTokens();



            saveStorage();



        };



        reader.readAsDataURL(

            imageInput.files[0]

        );


    }

    else{


        tokens.push(token);



        renderTokens();



        saveStorage();


    }






    nameInput.value="";



    imageInput.value="";



    toast(
        "Token criado."
    );


}






// ==========================================
// ATUALIZAR TAMANHO DO TOKEN
// ==========================================


const sizeSlider =
document.getElementById(
    "tokenSize"
);



if(sizeSlider){


    sizeSlider.addEventListener(

        "input",

        ()=>{


            const value =
            document.getElementById(
                "tokenSizeValue"
            );


            if(value){

                value.textContent =
                sizeSlider.value+"px";

            }


        }

    );


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



    DOM.map.style.transform =

    `translate(-50%,-50%) scale(${App.zoom})`;




    if(DOM.zoomLabel){


        DOM.zoomLabel.textContent =

        Math.round(
            App.zoom*100
        )
        +"%";


    }


}







function zoomWheel(e){


    e.preventDefault();



    if(e.deltaY<0){

        App.zoom+=0.1;

    }

    else{

        App.zoom-=0.1;

    }



    App.zoom = Math.max(

        App.minZoom,

        Math.min(

            App.maxZoom,

            App.zoom

        )

    );



    updateZoom();


}






// ==========================================
// BOTÕES DE ZOOM
// ==========================================


const zoomIn =
document.getElementById(
    "zoomIn"
);


if(zoomIn){


    zoomIn.onclick=()=>{


        App.zoom+=0.1;


        updateZoom();


    };


}






const zoomOut =
document.getElementById(
    "zoomOut"
);


if(zoomOut){


    zoomOut.onclick=()=>{


        App.zoom-=0.1;


        App.zoom=Math.max(

            App.minZoom,

            App.zoom

        );


        updateZoom();


    };


}







// ==========================================
// TECLADO
// ==========================================


function keyboard(e){



    if(
        e.target.tagName==="INPUT"
    )
        return;




    switch(e.key){



        case "Delete":


            deleteSelection();


        break;




        case "Escape":


            clearSelection();


        break;




        case " ":


            if(
                typeof startPan==="function"
            ){

                startPan();

            }


        break;


    }






    if(e.ctrlKey){



        switch(
            e.key.toLowerCase()
        ){



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



            case "a":

                selectAll();

            break;



        }


    }


}






function keyboardUp(e){


    if(
        e.key===" "
    ){


        if(
            typeof stopPan==="function"
        ){

            stopPan();

        }


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
// TOAST
// ==========================================


function toast(message){


    const div =
    document.createElement(
        "div"
    );



    div.className="toast";



    div.textContent =
    message;



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



    },2200);


}







// ==========================================
// EVENTO BOTÃO CRIAR TOKEN
// ==========================================


window.addEventListener(
"load",
()=>{


    const button =
    document.getElementById(
        "createToken"
    );



    if(button){


        button.addEventListener(

            "click",

            createToken

        );


    }



});
