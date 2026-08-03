// ==========================================
// MANIPULAÇÃO RPG
// STORAGE.JS
// ==========================================


const STORAGE_KEY =
"manipulacao_rpg_save";




// ==========================================
// SALVAR
// ==========================================


function saveStorage(){


const data={



version:
App.version,



tokens:
tokens,



zoom:
App.zoom,



grid:
App.gridVisible,



snap:
App.snapGrid,



fog:
App.fogEnabled,



mapOffset:
App.mapOffset



};



localStorage.setItem(

STORAGE_KEY,

JSON.stringify(data)

);



}









// ==========================================
// CARREGAR
// ==========================================


function loadStorage(){



const save =
localStorage.getItem(
STORAGE_KEY
);




if(!save){



return;



}





try{



const data =
JSON.parse(save);




if(data.tokens){



tokens =
data.tokens;



}




if(data.zoom){



App.zoom =
data.zoom;



}





if(data.grid !== undefined){



App.gridVisible =
data.grid;



}





if(data.snap !== undefined){



App.snapGrid =
data.snap;



}





if(data.fog !== undefined){



App.fogEnabled =
data.fog;



}





if(data.mapOffset){



App.mapOffset =
data.mapOffset;



}



toast(
"Save carregado."
);



}

catch(e){



console.error(
"Erro ao carregar save:",
e
);



toast(
"Erro no carregamento."
);



}



}










// ==========================================
// EXPORTAR SAVE
// ==========================================


function exportSave(){



const data =
localStorage.getItem(
STORAGE_KEY
);



const blob =
new Blob(

[data],

{
type:"application/json"
}

);



const url =
URL.createObjectURL(
blob
);



const a =
document.createElement(
"a"
);



a.href=url;



a.download =
"mesa-rpg-save.json";



a.click();



URL.revokeObjectURL(url);



}









// ==========================================
// IMPORTAR SAVE
// ==========================================


function importSave(file){



const reader =
new FileReader();



reader.onload=function(){



localStorage.setItem(

STORAGE_KEY,

reader.result

);



location.reload();



};



reader.readAsText(file);



}









// ==========================================
// LIMPAR TUDO
// ==========================================


function clearStorage(){



if(
confirm(
"Apagar toda a mesa?"
)

){



localStorage.removeItem(
STORAGE_KEY
);



location.reload();



}



}
