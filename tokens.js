// ==========================================
// TOKENS RPG
// ==========================================


let tokens=[];



// ==========================================
// CRIAR TOKEN
// ==========================================

function createToken(data={}){


const token={


id:
Date.now()+Math.random(),



name:
data.name || "Novo Token",



color:
data.color || "#6366f1",



image:
data.image || null,



size:
Number(data.size) || 60,



x:300,

y:300,



rotation:0,



hp:100,

maxHp:100,



status:[]


};



tokens.push(token);



if(typeof saveHistory==="function")
{
saveHistory();
}



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


const map =
document.getElementById(
"map"
);



if(!map)
return;



map
.querySelectorAll(".token")
.forEach(
t=>t.remove()
);




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



element.style.width =
token.size+"px";



element.style.height =
token.size+"px";



element.style.background =
token.color;



element.style.transform =
`
rotate(${token.rotation}deg)
`;





// IMAGEM

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


}


// SEM IMAGEM

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



element.appendChild(
fallback
);



}




// NOME

const label =
document.createElement(
"div"
);



label.className =
"tokenName";



label.innerText =
token.name;



element.appendChild(
label
);






// CLICK

element.addEventListener(
"click",
e=>{


e.stopPropagation();



if(typeof addSelection==="function")
{


clearSelection();



addSelection(
token.id
);



renderSelection();


}


});





map.appendChild(
element
);



});



renderSelection();



}
