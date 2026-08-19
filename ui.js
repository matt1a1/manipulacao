// ==========================================
// UI.JS
// ESCANDINAVO RPG
// ==========================================


// ==========================================
// INICIALIZAÇÃO
// ==========================================

window.addEventListener(
"load",
()=>{

    registerUI();

});





// ==========================================
// REGISTRAR EVENTOS DA UI
// ==========================================


function registerUI(){



    // ==========================
    // ZOOM
    // ==========================


    const zoomIn =
    document.getElementById(
        "zoomIn"
    );


    const zoomOut =
    document.getElementById(
        "zoomOut"
    );



    if(zoomIn){


        zoomIn.onclick=()=>{


            App.zoom+=0.1;


            if(App.zoom>App.maxZoom){

                App.zoom=App.maxZoom;

            }


            updateZoom();


        };


    }





    if(zoomOut){


        zoomOut.onclick=()=>{


            App.zoom-=0.1;


            if(App.zoom<App.minZoom){

                App.zoom=App.minZoom;

            }


            updateZoom();


        };


    }






    // ==========================
    // HISTÓRICO
    // ==========================


    const undoButton =
    document.getElementById(
        "undo"
    );


    const redoButton =
    document.getElementById(
        "redo"
    );



    if(undoButton){

        undoButton.onclick=undo;

    }



    if(redoButton){

        redoButton.onclick=redo;

    }







    // ==========================
    // COPIAR
    // ==========================


    const copy =
    document.getElementById(
        "copy"
    );



    if(copy){

        copy.onclick=
        copySelection;

    }







    // ==========================
    // COLAR
    // ==========================


    const paste =
    document.getElementById(
        "paste"
    );



    if(paste){

        paste.onclick=
        pasteSelection;

    }







    // ==========================
    // DUPLICAR
    // ==========================


    const duplicate =
    document.getElementById(
        "duplicate"
    );



    if(duplicate){

        duplicate.onclick=
        duplicateSelection;

    }








    // ==========================
    // SALVAR
    // ==========================


    const save =
    document.getElementById(
        "save"
    );



    if(save){


        save.onclick=()=>{


            saveStorage();


            toast(
                "Mesa salva."
            );


        };


    }







    // ==========================
    // CARREGAR
    // ==========================


    const load =
    document.getElementById(
        "load"
    );



    if(load){


        load.onclick=()=>{


            loadStorage();


            renderTokens();


            updateZoom();


            toast(
                "Mesa carregada."
            );


        };


    }








    // ==========================
    // CRIAR TOKEN
    // ==========================


    const create =
    document.getElementById(
        "createToken"
    );



    if(create){


        create.onclick=
        createToken;


    }








    // ==========================
    // GRID
    // ==========================


    const grid =
    document.getElementById(
        "toggleGrid"
    );



    if(grid){


        grid.onclick=()=>{


            App.gridVisible =
            !App.gridVisible;



            if(
                typeof updateGrid === "function"
            ){

                updateGrid();

            }



            saveStorage();



            toast(

                App.gridVisible

                ?

                "Grid ativado."

                :

                "Grid desativado."

            );


        };


    }







    // ==========================
    // FOG
    // ==========================


    const fog =
    document.getElementById(
        "toggleFog"
    );



    if(fog){


        fog.onclick=()=>{


            App.fogEnabled =
            !App.fogEnabled;



            if(
                typeof toggleFog === "function"
            ){

                toggleFog();

            }



            saveStorage();



            toast(

                App.fogEnabled

                ?

                "Fog ativado."

                :

                "Fog desativado."

            );


        };


    }








    // ==========================
    // RÉGUA
    // ==========================


    const measure =
    document.getElementById(
        "toggleMeasure"
    );



    if(measure){


        measure.onclick=()=>{


            App.measureMode =
            !App.measureMode;



            toast(

                App.measureMode

                ?

                "Régua ativada."

                :

                "Régua desativada."

            );


        };


    }








    // ==========================
    // MAPA PADRÃO
    // ==========================


    const defaultMap =
    document.getElementById(
        "defaultMap"
    );



    if(defaultMap){


        defaultMap.onclick=()=>{


            DOM.map.style.backgroundImage="";



            DOM.map.classList.remove(
                "image"
            );



            localStorage.removeItem(
                "escandinavo_map"
            );



            toast(
                "Mapa padrão."
            );


        };


    }








    // ==========================
    // LIMPAR MAPA
    // ==========================


    const clear =
    document.getElementById(
        "clearMap"
    );



    if(clear){


        clear.onclick=()=>{


            if(
                confirm(
                    "Apagar todos os tokens?"
                )
            ){


                saveHistory();



                tokens=[];



                renderTokens();



                saveStorage();



                toast(
                    "Mapa limpo."
                );


            }


        };


    }





}








// ==========================================
// ATUALIZAR BOTÃO GRID
// ==========================================


function updateUI(){



    const grid =
    document.getElementById(
        "toggleGrid"
    );



    if(grid){


        grid.textContent =

        App.gridVisible

        ?

        "Grid ON"

        :

        "Grid OFF";


    }




}
