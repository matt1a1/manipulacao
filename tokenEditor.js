// ==========================================
// EDITOR DE TOKEN RPG
// ==========================================


let editingToken = null;



// ==========================================
// CRIAR PAINEL
// ==========================================


function createTokenEditor(){


const panel =
document.createElement("div");


panel.id =
"tokenEditor";


panel.innerHTML = `


<h2>Editar Token</h2>


<label>Nome</label>

<input id="editName">



<label>Imagem</label>

<input 
type="file"
id="editImage"
accept="image/*">



<label>Tamanho</label>

<input 
type="range"
id="editSize"
min="30"
max="200">



<span id="editSizeValue">
60px
</span>



<label>Vida</label>

<input 
type="number"
id="editHP">



<label>Vida Máxima</label>

<input 
type="number"
id="editMaxHP">



<label>Rotação</label>

<input 
type="range"
id="editRotation"
min="0"
max="360">



<label>Status</label>


<select id="editStatus">


<option value="">
Normal
</option>


<option value="🔥">
🔥 Queimando
</option>


<option value="☠️">
☠️ Envenenado
</option>


<option value="💫">
💫 Atordoado
</option>


<option value="❄️">
❄️ Congelado
</option>


<option value="💀">
💀 Morto
</option>


</select>



<button id="saveTokenEdit">
Salvar
</button>


<button id="deleteTokenEdit">
Excluir
</button>


`;



document.body.appendChild(
panel
);



}





// ==========================================
// ABRIR EDITOR
// ==========================================


function openTokenEditor(id){



editingToken =
tokens.find(
t=>t.id===id
);



if(!editingToken)
return;




const panel =
document.getElementById(
"tokenEditor"
);



panel.style.display =
"flex";



document.getElementById(
"editName"
).value =
editingToken.name;



document.getElementById(
"editSize"
).value =
editingToken.size;



document.getElementById(
"editSizeValue"
).innerText =
editingToken.size+"px";



document.getElementById(
"editHP"
).value =
editingToken.hp;



document.getElementById(
"editMaxHP"
).value =
editingToken.maxHp;



document.getElementById(
"editRotation"
).value =
editingToken.rotation;



document.getElementById(
"editStatus"
).value =
editingToken.status[0] || "";



}




// ==========================================
// SALVAR ALTERAÇÕES
// ==========================================


function saveTokenEdit(){


if(!editingToken)
return;



saveHistory();



editingToken.name =
document.getElementById(
"editName"
).value;



editingToken.size =
Number(
document.getElementById(
"editSize"
).value
);



editingToken.hp =
Number(
document.getElementById(
"editHP"
).value
);



editingToken.maxHp =
Number(
document.getElementById(
"editMaxHP"
).value
);



editingToken.rotation =
Number(
document.getElementById(
"editRotation"
).value
);



editingToken.status=[

document.getElementById(
"editStatus"
).value

];




// IMAGEM

const input =
document.getElementById(
"editImage"
);



if(input.files.length){


const reader =
new FileReader();



reader.onload=function(){


editingToken.image =
reader.result;


finishEdit();


};


reader.readAsDataURL(
input.files[0]
);



}else{


finishEdit();


}



}




function finishEdit(){


renderTokens();


saveStorage();


closeTokenEditor();



toast(
"Token atualizado."
);


}




// ==========================================
// FECHAR
// ==========================================


function closeTokenEditor(){


document.getElementById(
"tokenEditor"
).style.display=
"none";


}




// ==========================================
// EXCLUIR
// ==========================================


function deleteEditToken(){


if(!editingToken)
return;



tokens =
tokens.filter(
t=>
t.id!==editingToken.id
);



renderTokens();


saveStorage();


closeTokenEditor();



toast(
"Token removido."
);



}





// ==========================================
// EVENTOS
// ==========================================


window.addEventListener(
"load",
()=>{


createTokenEditor();



document
.getElementById(
"saveTokenEdit"
)
.onclick =
saveTokenEdit;



document
.getElementById(
"deleteTokenEdit"
)
.onclick =
deleteEditToken;



document
.getElementById(
"editSize"
)
.oninput=function(){


document.getElementById(
"editSizeValue"
).innerText =
this.value+"px";


};



});






// ==========================================
// BOTÃO DIREITO
// ==========================================


document.addEventListener(
"contextmenu",
e=>{


const token =
e.target.closest(
".token"
);



if(token){


e.preventDefault();


openTokenEditor(
Number(
token.dataset.id
)
);



}


});
