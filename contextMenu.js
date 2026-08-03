// ==========================================
// MANIPULAÇÃO RPG
// CONTEXT MENU.JS
// ==========================================


let contextTokenId = null;




// ==========================================
// INICIAR
// ==========================================


window.addEventListener(
"load",
initContextMenu
);



function initContextMenu(){



document.addEventListener(
"contextmenu",
openContextMenu
);



document
.getElementById(
"renameToken"
)
.onclick=renameContextToken;



document
.getElementById(
"changeColor"
)
.onclick=changeContextColor;



document
.getElementById(
"changeImage"
)
.onclick=changeContextImage;



document
.getElementById(
"rotateToken"
)
.onclick=rotateContextToken;



document
.getElementById(
"deleteToken"
)
.onclick=deleteContextToken;



}









// ==========================================
// ABRIR MENU
// ==========================================


function openContextMenu(e){



const token =
e.target.closest(
".token"
);



if(!token)
return;



e.preventDefault();



contextTokenId =
Number(
token.dataset.id
);



DOM.contextMenu.style.display="block";



DOM.contextMenu.style.left =
e.pageX+"px";



DOM.contextMenu.style.top =
e.pageY+"px";



}









// ==========================================
// FECHAR
// ==========================================


function closeContextMenu(){



if(DOM.contextMenu){


DOM.contextMenu.style.display =
"none";


}



}









// ==========================================
// RENOMEAR
// ==========================================


function renameContextToken(){



const token =
tokens.find(
t=>t.id===contextTokenId
);



if(!token)
return;



const name =
prompt(
"Novo nome:",
token.name
);



if(name){


token.name=name;



renderTokens();



saveStorage();



}



closeContextMenu();



}









// ==========================================
// COR
// ==========================================


function changeContextColor(){



const token =
tokens.find(
t=>t.id===contextTokenId
);



if(!token)
return;



const color =
prompt(
"Digite a cor HEX:",
token.color
);



if(color){



token.color=color;



renderTokens();



saveStorage();



}



closeContextMenu();



}









// ==========================================
// IMAGEM
// ==========================================


function changeContextImage(){



changeTokenImage(
contextTokenId
);



closeContextMenu();



}









// ==========================================
// ROTACIONAR
// ==========================================


function rotateContextToken(){



rotateToken(
contextTokenId
);



closeContextMenu();



}









// ==========================================
// EXCLUIR
// ==========================================


function deleteContextToken(){



deleteToken(
contextTokenId
);



closeContextMenu();



}
