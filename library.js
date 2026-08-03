// ==========================================
// BIBLIOTECA DE TOKENS
// ==========================================


const defaultLibrary = [


    {
        name:"Guerreiro",
        color:"#2563eb"
    },


    {
        name:"Mago",
        color:"#9333ea"
    },


    {
        name:"Goblin",
        color:"#16a34a"
    },


    {
        name:"Orc",
        color:"#dc2626"
    },


    {
        name:"Dragão",
        color:"#7c2d12"
    },


    {
        name:"Esqueleto",
        color:"#94a3b8"
    }


];



let library =
[
    ...defaultLibrary
];





// ==========================================
// RENDER BIBLIOTECA
// ==========================================

function renderLibrary(){


    const container =
    document.getElementById(
        "libraryList"
    );



    if(!container)
        return;



    container.innerHTML="";



    library.forEach(item=>{


        const card =
        document.createElement(
            "div"
        );



        card.className =
        "token-card";



        card.innerHTML = `


        <div 
        class="token-preview"
        style="
        background:${item.color}
        "
        >

        ${item.name[0]}

        </div>


        <div class="token-info">

        <div class="token-name">

        ${item.name}

        </div>


        <div class="token-type">

        Criatura

        </div>


        </div>


        `;



        card.onclick=()=>{


            createToken({

                name:item.name,

                color:item.color

            });


        };



        container.appendChild(
            card
        );


    });


}





// ==========================================
// RESTAURAR
// ==========================================

function resetLibrary(){


    library =
    [
        ...defaultLibrary
    ];



    renderLibrary();



    toast(
        "Biblioteca restaurada."
    );

}



// ==========================================
// BOTÃO
// ==========================================

window.addEventListener(
"load",
()=>{


    document
    .getElementById(
        "resetLibrary"
    )
    ?.addEventListener(
        "click",
        resetLibrary
    );


});
