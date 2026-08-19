// ==========================================
// GRID SYSTEM
// ESCANDINAVO RPG
// ==========================================


const Grid = {

    enabled:true,

    size:50,

    sizes:[
        25,
        50,
        75,
        100
    ]

};




// ==========================================
// INICIAR GRID
// ==========================================

window.addEventListener("load",()=>{

    initGrid();

});



function initGrid(){

    const button =
    document.getElementById("toggleGrid");


    if(button){

        button.addEventListener(
            "click",
            toggleGrid
        );

    }


    applyGrid();

}






// ==========================================
// ATIVAR / DESATIVAR GRID
// ==========================================


function toggleGrid(){


    Grid.enabled =
    !Grid.enabled;


    App.gridVisible =
    Grid.enabled;


    applyGrid();



    toast(

        Grid.enabled

        ? "Grid ativado."

        : "Grid desativado."

    );

}







// ==========================================
// APLICAR GRID
// ==========================================


function applyGrid(){


    if(!DOM.map)
        return;



    DOM.map.classList.remove(

        "grid25",
        "grid50",
        "grid75",
        "grid100",
        "no-grid"

    );



    if(!Grid.enabled){


        DOM.map.classList.add(
            "no-grid"
        );


        return;

    }



    DOM.map.classList.add(

        "grid"+Grid.size

    );


}






// ==========================================
// ALTERAR TAMANHO DO GRID
// ==========================================


function changeGridSize(size){


    if(
        !Grid.sizes.includes(size)
    )
        return;



    Grid.size=size;


    App.gridSize=size;



    applyGrid();



    toast(
        "Grid alterado para "+size+"px"
    );


}






// ==========================================
// PRÓXIMO TAMANHO
// ==========================================


function nextGridSize(){


    let index =
    Grid.sizes.indexOf(
        Grid.size
    );


    index++;


    if(index>=Grid.sizes.length){

        index=0;

    }



    changeGridSize(

        Grid.sizes[index]

    );


}






// ==========================================
// SNAP DOS TOKENS
// ==========================================


function snapPosition(x,y){


    if(!App.snapGrid){

        return {

            x:x,

            y:y

        };

    }



    return {


        x:
        Math.round(
            x / Grid.size
        ) * Grid.size,


        y:
        Math.round(
            y / Grid.size
        ) * Grid.size


    };


}






// ==========================================
// ATIVAR / DESATIVAR SNAP
// ==========================================


function toggleSnap(){


    App.snapGrid =
    !App.snapGrid;



    toast(

        App.snapGrid

        ? "Snap ativado."

        : "Snap desativado."

    );

}






// ==========================================
// POSIÇÃO DA CÉLULA
// ==========================================


function getGridCell(x,y){


    return {


        x:
        Math.floor(
            x / Grid.size
        ),


        y:
        Math.floor(
            y / Grid.size
        )


    };

}






// ==========================================
// SALVAR CONFIGURAÇÃO
// ==========================================


function saveGrid(){


    localStorage.setItem(

        "grid",

        JSON.stringify({

            enabled:Grid.enabled,

            size:Grid.size

        })

    );


}






// ==========================================
// CARREGAR CONFIGURAÇÃO
// ==========================================


function loadGrid(){


    const data =
    localStorage.getItem(
        "grid"
    );



    if(!data)
        return;



    const config =
    JSON.parse(data);



    Grid.enabled =
    config.enabled;



    Grid.size =
    config.size;



    App.gridSize =
    config.size;



    App.gridVisible =
    config.enabled;



    applyGrid();

}
