// ==========================================
// MANIPULAÇÃO RPG
// TOKENS.JS
// ==========================================


let tokens = [];




// ==========================================
// CRIAR TOKEN
// ==========================================


function createToken(data={}){


saveHistory();



const token={



id:
Date.now()+Math.random(),



name:
data.name || "Token",



x:
data.x || 300,



y:
data.y || 300,



size:
data.size || 50,



color:
data.color || "#6366f1",



image:
data.image || null,



rotation:0,



hp:100,


maxHp:100



};




tokens.push(token);



renderTokens();



saveStorage();



toast(
"Token criado."
);



}









// ==========================================
// RENDER TOKENS
// ==========================================


function renderTokens(){



if(!DOM.map)
return;



DOM.map
.querySelectorAll(".token")
.forEach(
e=>e.remove()
);






tokens.forEach(token=>{



const el =
document.createElement(
"div"
);




el.className="token";



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






// =======================
// IMAGEM
// =======================



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


const div =
document.createElement(
"div"
);



div.className =
"fallback";



div.innerHTML =
token.name
.charAt(0)
.toUpperCase();



el.appendChild(div);



}








// =======================
// NOME
// =======================


const name =
document.createElement(
"div"
);



name.className =
"tokenName";



name.innerHTML =
token.name;



el.appendChild(name);










// =======================
// HP
// =======================



const hp =
document.createElement(
"div"
);



hp.className =
"hpBar";



const fill =
document.createElement(
"div"
);



fill.className =
"hpFill";



fill.style.width =

(token.hp/token.maxHp*100)
+"%";



hp.appendChild(fill);



el.appendChild(hp);









// =======================
// CLICK
// =======================


el.onclick=function(e){


e.stopPropagation();



if(!e.ctrlKey)

clearSelection();



addSelection(
token.id
);



renderSelection();



};








// =======================
// DUPLO CLICK
// =======================


el.ondblclick=function(){



rotateToken(
token.id
);



};






DOM.map.appendChild(el);



});



}









// ==========================================
// ALTERAR IMAGEM
// ==========================================


function changeTokenImage(id){



const input =
document.createElement(
"input"
);



input.type="file";


input.accept="image/*";




input.onchange=function(e){



const file =
e.target.files[0];



if(!file)
return;



const reader =
new FileReader();



reader.onload=function(){



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



token.color=color;



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
// DELETAR
// ==========================================


function deleteToken(id){



saveHistory();



tokens =
tokens.filter(
t=>t.id!==id
);



renderTokens();



saveStorage();



toast(
"Token excluído."
);



}








// ==========================================
// HP
// ==========================================


function damageToken(id,value){



const token =
tokens.find(
t=>t.id===id
);



if(!token)
return;



token.hp = Math.max(

0,

token.hp-value

);



renderTokens();


saveStorage();



}



function healToken(id,value){



const token =
tokens.find(
t=>t.id===id
);



if(!token)
return;



token.hp = Math.min(

token.maxHp,

token.hp+value

);



renderTokens();


saveStorage();



}
