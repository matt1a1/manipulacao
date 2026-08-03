// ==========================================
// TOKENS RPG
// ==========================================


let tokens = [];




// ==========================================
// CRIAR TOKEN
// ==========================================


function createToken(data){


saveHistory();



const token = {


id:
Date.now()+Math.random(),



name:
data.name || "Token",



color:
data.color || "#6366f1",



image:
data.image || null,



x:
300,



y:
300,



size:
data.size || 60,



hp:
data.hp || 100,



maxHp:
data.maxHp || 100,



rotation:
0,



status:
[]



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



DOM.map.innerHTML="";




tokens.forEach(token=>{


const el =
document.createElement("div");



el.className =
"token spawn";



el.dataset.id =
token.id;




// TAMANHO INDIVIDUAL


el.style.width =
token.size+"px";


el.style.height =
token.size+"px";



// POSIÇÃO


el.style.left =
token.x+"px";


el.style.top =
token.y+"px";



// ROTAÇÃO


el.style.transform =
`
rotate(${token.rotation}deg)
`;



// COR


el.style.background =
token.color;




// IMAGEM


if(token.image){


const img =
document.createElement("img");


img.src =
token.image;


el.appendChild(img);



}else{



const fallback =
document.createElement("div");


fallback.className =
"fallback";



fallback.innerText =
token.name
.substring(0,2)
.toUpperCase();



el.appendChild(
fallback
);


}




// NOME


const name =
document.createElement("div");


name.className =
"tokenName";


name.innerText =
token.name;



el.appendChild(name);






// VIDA


const hp =
document.createElement("div");


hp.className =
"hpBar";



const hpFill =
document.createElement("div");


hpFill.className =
"hpFill";



hpFill.style.width =

(
(token.hp/token.maxHp)*100
)
+"%";



hp.appendChild(
hpFill
);



el.appendChild(
hp
);







// STATUS


if(
token.status &&
token.status.length
){


const status =
document.createElement("div");


status.className =
"statusContainer";



token.status.forEach(s=>{


if(s){


const icon =
document.createElement("div");


icon.className =
"status";


icon.innerText =
s;


status.appendChild(icon);


}



});



el.appendChild(status);



}






// CLIQUE


el.addEventListener(
"click",
e=>{


e.stopPropagation();



if(!e.shiftKey){

clearSelection();

}



addSelection(
token.id
);



renderSelection();



});








DOM.map.appendChild(
el
);



});



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
t=>
t.id!==id
);



clearSelection();



renderTokens();



saveStorage();



toast(
"Token removido."
);



}





// ==========================================
// PEGAR TOKEN
// ==========================================


function getToken(id){


return tokens.find(
t=>t.id===id
);


}
