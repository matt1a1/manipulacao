// ==========================================
// MANIPULAÇÃO RPG
// TOKENS.JS
// ==========================================


let tokens = [];


// ==========================================
// CRIAR TOKEN
// ==========================================


function createToken(data={}){


const token = {


id:
Date.now()+Math.random(),



name:
data.name || "Novo Token",



x:
data.x || 200,



y:
data.y || 200,



size:
data.size || 50,



color:
data.color || "#6366f1",



image:
data.image || null,



hp:100,


maxHp:100,


rotation:0



};



tokens.push(token);



renderTokens();


saveStorage();



toast(
"Token criado."
);



return token;



}






// ==========================================
// RENDER
// ==========================================


function renderTokens(){



if(!DOM.map)
return;



DOM.map
.querySelectorAll(".token")
.forEach(t=>t.remove());




tokens.forEach(token=>{


const el =
document.createElement(
"div"
);



el.className =
"token";



el.dataset.id =
token.id;




el.style.left =
token.x+"px";



el.style.top =
token.y+"px";



el.style.width =
token.size+"px";



el.style.height =
token.size+"px";



el.style.background =
token.color;



el.style.transform =
`
rotate(${token.rotation}deg)
`;





// imagem


if(token.image){


const img =
document.createElement(
"img"
);


img.src =
token.image;


el.appendChild(img);



}

else{


const fallback =
document.createElement(
"div"
);


fallback.className =
"fallback";



fallback.innerText =
token.name
.charAt(0)
.toUpperCase();



el.appendChild(fallback);



}







// nome


const name =
document.createElement(
"div"
);



name.className =
"tokenName";


name.innerText =
token.name;



el.appendChild(name);





// seleção


el.addEventListener(
"click",
e=>{


e.stopPropagation();



if(!e.ctrlKey)

clearSelection();



addSelection(
token.id
);



renderSelection();



}

);




DOM.map.appendChild(el);



});



}







// ==========================================
// ADICIONAR IMAGEM
// ==========================================


function chooseTokenImage(id){



const input =
document.createElement(
"input"
);



input.type =
"file";


input.accept =
"image/*";




input.onchange =
e=>{


const file =
e.target.files[0];



if(!file)
return;




const reader =
new FileReader();




reader.onload =
()=>{


const token =
tokens.find(
t=>t.id===id
);



if(token){


token.image =
reader.result;


renderTokens();


saveStorage();


}



};



reader.readAsDataURL(file);



};




input.click();



}







// ==========================================
// ALTERAR TAMANHO
// ==========================================


function resizeToken(id,size){



const token =
tokens.find(
t=>t.id===id
);



if(!token)
return;



token.size =
Number(size);



renderTokens();



saveStorage();



}








// ==========================================
// ALTERAR COR
// ==========================================


function changeTokenColor(id,color){



const token =
tokens.find(
t=>t.id===id
);



if(!token)
return;



token.color =
color;



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



toast(
"Token removido."
);



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
// ATUALIZAR HP
// ==========================================


function updateTokenHP(id,value){



const token =
tokens.find(
t=>t.id===id
);



if(!token)
return;



token.hp =
Math.max(
0,
Math.min(
token.maxHp,
value
)
);



renderTokens();



saveStorage();



}
