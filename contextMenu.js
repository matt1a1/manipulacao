// ==========================================
// CONTEXT MENU TOKEN
// ==========================================


let selectedContextToken = null;




// ==========================================
// ABRIR MENU
// ==========================================

document.addEventListener(
"contextmenu",
e=>{


    const token =
    e.target.closest(
        ".token"
    );



    if(!token)
        return;



    e.preventDefault();



    selectedContextToken =
    Number(
        token.dataset.id
    );



    const menu =
    document.getElementById(
        "contextMenu"
    );



    if(!menu)
        return;



    menu.style.display="block";



    menu.style.left =
    e.pageX+"px";


    menu.style.top =
    e.pageY+"px";


});






// ==========================================
// FECHAR
// ==========================================

function closeContextMenu(){


    const menu =
    document.getElementById(
        "contextMenu"
    );



    if(menu)
        menu.style.display="none";


}




// ==========================================
// RENOMEAR
// ==========================================

function renameToken(){


    const token =
    tokens.find(
        t=>
        t.id===selectedContextToken
    );



    if(!token)
        return;



    const name =
    prompt(
        "Novo nome:",
        token.name
    );



    if(name){


        saveHistory();



        token.name=name;



        renderTokens();



        saveStorage();


    }



}






// ==========================================
// ALTERAR COR
// ==========================================

function changeTokenColor(){


    const token =
    tokens.find(
        t=>
        t.id===selectedContextToken
    );



    if(!token)
        return;



    const color =
    prompt(
        "Digite a cor:",
        token.color
    );



    if(color){


        token.color=color;


        renderTokens();


        saveStorage();


    }



}





// ==========================================
// IMAGEM
// ==========================================

function changeTokenImage(){


    const input =
    document.getElementById(
        "imageLoader"
    );



    if(!input)
        return;



    input.click();



    input.onchange=e=>{


        const file =
        e.target.files[0];



        if(!file)
            return;



        const reader =
        new FileReader();



        reader.onload=()=>{


            const token =
            tokens.find(
                t=>
                t.id===selectedContextToken
            );



            if(token){


                token.image =
                reader.result;



                renderTokens();



                saveStorage();


            }


        };



        reader.readAsDataURL(
            file
        );


    };



}






// ==========================================
// ROTACIONAR
// ==========================================

function rotateSelectedToken(){


    rotateToken(
        selectedContextToken
    );


}







// ==========================================
// DELETE
// ==========================================

function deleteSelectedToken(){


    removeToken(
        selectedContextToken
    );


}







// ==========================================
// EVENTOS
// ==========================================

window.addEventListener(
"load",
()=>{


    document
    .getElementById(
        "renameToken"
    )
    ?.addEventListener(
        "click",
        renameToken
    );



    document
    .getElementById(
        "changeColor"
    )
    ?.addEventListener(
        "click",
        changeTokenColor
    );



    document
    .getElementById(
        "changeImage"
    )
    ?.addEventListener(
        "click",
        changeTokenImage
    );



    document
    .getElementById(
        "rotateToken"
    )
    ?.addEventListener(
        "click",
        rotateSelectedToken
    );



    document
    .getElementById(
        "deleteToken"
    )
    ?.addEventListener(
        "click",
        deleteSelectedToken
    );


});
