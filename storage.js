// ==========================================
// STORAGE
// ==========================================


const STORAGE_KEY =
"manipulacao_rpg";




// ==========================================
// SALVAR
// ==========================================

function saveStorage(){


    const data={


        tokens:


        tokens,


        zoom:


        App.zoom,


        grid:


        App.gridVisible,


        snap:


        App.snapGrid


    };



    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );



}




// ==========================================
// CARREGAR
// ==========================================

function loadStorage(){



    const saved =
    localStorage.getItem(
        STORAGE_KEY
    );



    if(!saved){


        tokens=[];


        return;


    }



    try{


        const data =
        JSON.parse(saved);



        tokens =
        data.tokens || [];



        App.zoom =
        data.zoom || 1;



        App.gridVisible =
        data.grid ?? true;



        App.snapGrid =
        data.snap ?? true;



    }
    catch(e){


        console.error(
            "Erro carregando dados:",
            e
        );


        tokens=[];


    }



}




// ==========================================
// EXPORTAR CAMPANHA
// ==========================================

function exportCampaign(){


    const data =
    JSON.stringify(
        tokens,
        null,
        2
    );



    const blob =
    new Blob(
        [data],
        {
            type:"application/json"
        }
    );



    const url =
    URL.createObjectURL(
        blob
    );



    const a =
    document.createElement(
        "a"
    );


    a.href=url;


    a.download =
    "campanha-rpg.json";



    a.click();



    URL.revokeObjectURL(
        url
    );


}




// ==========================================
// IMPORTAR CAMPANHA
// ==========================================

function importCampaign(file){


    const reader =
    new FileReader();



    reader.onload=e=>{


        tokens =
        JSON.parse(
            e.target.result
        );



        renderTokens();


        saveStorage();



        toast(
            "Campanha carregada."
        );


    };



    reader.readAsText(file);


}
