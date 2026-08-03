// ==========================================
// STORAGE.JS
// MANIPULAÇÃO RPG
// ==========================================


// ==========================================
// CHAVES DO STORAGE
// ==========================================

const STORAGE_KEY = "manipulacao_rpg_save";





// ==========================================
// SALVAR TUDO
// ==========================================

function saveStorage(){


    const data = {


        version:"2.0.0",



        zoom:App.zoom,



        gridVisible:App.gridVisible,



        snapGrid:App.snapGrid,



        fogEnabled:App.fogEnabled,



        measureMode:App.measureMode,



        mapOffset:App.mapOffset,



        tokens:tokens || [],



        mapImage:

        localStorage.getItem(
            "manipulacao_map"
        )



    };





    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );





}









// ==========================================
// CARREGAR DADOS
// ==========================================

function loadStorage(){


    const save =

    localStorage.getItem(
        STORAGE_KEY
    );



    if(!save){

        return;

    }





    try{


        const data =

        JSON.parse(save);






        if(data.zoom){

            App.zoom=data.zoom;

        }




        if(
            data.gridVisible !== undefined
        ){

            App.gridVisible =
            data.gridVisible;

        }





        if(
            data.snapGrid !== undefined
        ){

            App.snapGrid =
            data.snapGrid;

        }





        if(
            data.fogEnabled !== undefined
        ){

            App.fogEnabled =
            data.fogEnabled;

        }





        if(
            data.measureMode !== undefined
        ){

            App.measureMode =
            data.measureMode;

        }






        if(data.mapOffset){


            App.mapOffset =
            data.mapOffset;


        }







        if(
            Array.isArray(data.tokens)
        ){


            tokens = data.tokens;


        }







        if(data.mapImage){


            localStorage.setItem(

                "manipulacao_map",

                data.mapImage

            );


        }






    }

    catch(error){


        console.error(

            "Erro ao carregar save:",

            error

        );


        toast(
            "Erro ao carregar dados."
        );


    }



}









// ==========================================
// LIMPAR SAVE
// ==========================================

function clearStorage(){



    localStorage.removeItem(

        STORAGE_KEY

    );



    localStorage.removeItem(

        "manipulacao_map"

    );



    toast(

        "Dados apagados."

    );



}









// ==========================================
// EXPORTAR MESA
// ==========================================

function exportSave(){



    const data =

    localStorage.getItem(

        STORAGE_KEY

    );



    const blob = new Blob(

        [
            data
        ],

        {
            type:
            "application/json"
        }

    );



    const url =

    URL.createObjectURL(blob);




    const link =

    document.createElement("a");



    link.href=url;



    link.download=

    "mesa-manipulacao-rpg.json";



    link.click();




    URL.revokeObjectURL(url);



}









// ==========================================
// IMPORTAR MESA
// ==========================================

function importSave(file){



    const reader =

    new FileReader();





    reader.onload=function(e){



        localStorage.setItem(

            STORAGE_KEY,

            e.target.result

        );



        location.reload();



    };





    reader.readAsText(file);



}









// ==========================================
// AUTO SAVE
// ==========================================


setInterval(()=>{


    if(typeof tokens !== "undefined"){


        saveStorage();


    }



},30000);
