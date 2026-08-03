// ==========================================
// TOKENS RPG
// ==========================================


let tokens = [];



// ==========================================
// CRIAR TOKEN
// ==========================================

function createToken(data = {}){


    const token = {


        id:
        Date.now()+Math.random(),


        name:
        data.name || "Novo Token",


        color:
        data.color || "#6366f1",


        image:
        data.image || null,


        x:
        data.x || 300,


        y:
        data.y || 300,


        hp:100,


        maxHp:100,


        rotation:0,


        status:[]


    };



    tokens.push(token);



    if(typeof saveHistory==="function")
        saveHistory();



    renderTokens();



    saveStorage();



    toast(
        "Token criado."
    );



    return token;

}




// ==========================================
// RENDERIZAR TOKENS
// ==========================================

function renderTokens(){


    const map =
    document.getElementById(
        "map"
    );



    if(!map)
        return;



    map
    .querySelectorAll(
        ".token"
    )
    .forEach(t=>t.remove());




    tokens.forEach(token=>{


        const element =
        document.createElement(
            "div"
        );



        element.className =
        "token";



        element.dataset.id =
        token.id;



        element.style.left =
        token.x+"px";



        element.style.top =
        token.y+"px";



        element.style.transform =
        `
        rotate(${token.rotation}deg)
        `;



        element.style.background =
        token.color;



        if(token.image){


            const img =
            document.createElement(
                "img"
            );


            img.src =
            token.image;


            element.appendChild(
                img
            );


        }else{


            const fallback =
            document.createElement(
                "div"
            );


            fallback.className =
            "fallback";


            fallback.textContent =
            token.name
            .charAt(0)
            .toUpperCase();



            element.appendChild(
                fallback
            );


        }



        const name =
        document.createElement(
            "div"
        );


        name.className =
        "tokenName";


        name.textContent =
        token.name;



        element.appendChild(
            name
        );




        element.addEventListener(
            "click",
            e=>{


                e.stopPropagation();


                selectToken(
                    token.id,
                    e
                );


            }
        );



        map.appendChild(
            element
        );


    });



    renderSelection();

}



// ==========================================
// SELEÇÃO DE TOKEN
// ==========================================

function selectToken(id,e){



    if(!e.shiftKey){

        clearSelection();

    }



    addSelection(id);



    renderSelection();


}




// ==========================================
// ATUALIZAR TOKEN
// ==========================================

function updateToken(id,data){


    const token =
    tokens.find(
        t=>t.id===id
    );



    if(!token)
        return;



    Object.assign(
        token,
        data
    );



    renderTokens();


    saveStorage();


}



// ==========================================
// REMOVER TOKEN
// ==========================================

function removeToken(id){


    saveHistory();



    tokens =
    tokens.filter(
        t=>t.id!==id
    );



    renderTokens();


    saveStorage();


}



// ==========================================
// ROTACIONAR
// ==========================================

function rotateToken(id){


    const token =
    tokens.find(
        t=>t.id===id
    );



    if(!token)
        return;



    token.rotation +=45;



    renderTokens();


    saveStorage();


}



// ==========================================
// ALTERAR HP
// ==========================================

function changeHP(id,value){


    const token =
    tokens.find(
        t=>t.id===id
    );


    if(!token)
        return;



    token.hp += value;



    if(token.hp<0)
        token.hp=0;



    if(token.hp>token.maxHp)
        token.hp=token.maxHp;



    renderTokens();



}



// ==========================================
// LIMPAR MAPA
// ==========================================

function clearTokens(){


    saveHistory();



    tokens=[];


    renderTokens();


    saveStorage();


}
