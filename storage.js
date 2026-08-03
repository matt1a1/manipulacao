// ==========================================
// STORAGE RPG
// ==========================================


const STORAGE_KEY =
"manipulacao_rpg_save";




// ==========================================
// SALVAR
// ==========================================


function saveStorage(){



const data = {


version:
App.version,



zoom:
App.zoom,



gridVisible:
App.gridVisible,



snapGrid:
App.snapGrid,



fogEnabled:
App.fogEnabled,



measureMode:
App.measureMode,



tokens:
tokens



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





// CONFIGURAÇÕES



if(data.zoom)

App.zoom =
data.zoom;



if(
data.gridVisible !== undefined
)

App.gridVisible =
data.gridVisible;




if(
data.snapGrid !== undefined
)

App.snapGrid =
data.snapGrid;




if(
data.fogEnabled !== undefined
)

App.fogEnabled =
data.fogEnabled;




if(
data.measureMode !== undefined
)

App.measureMode =
data.measureMode;







// TOKENS



if(
Array.isArray(data.tokens)
){



tokens =
data.tokens.map(t=>({



id:
t.id || Date.now()+Math.random(),



name:
t.name || "Token",



color:
t.color || "#6366f1",



image:
t.image || null,



x:
t.x || 100,



y:
t.y || 100,



size:
t.size || 60,



hp:
t.hp ?? 100,



maxHp:
t.maxHp ?? 100,



rotation:
t.rotation || 0,



status:
t.status || []



}));



}





}catch(error){



console.error(
"Erro ao carregar save:",
error
);



toast(
"Erro ao carregar dados."
);



}



}








// ==========================================
// LIMPAR SAVE
// ==========================================


function clearStorage(){



localStorage.removeItem(
STORAGE_KEY
);



tokens=[];



renderTokens();



toast(
"Dados apagados."
);



}





// ==========================================
// EXPORTAR MESA
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
type:
"application/json"
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



a.download=
"mesa-manipulacao.json";



a.click();



URL.revokeObjectURL(
url
);



}





// ==========================================
// IMPORTAR MESA
// ==========================================


function importSave(file){



const reader =
new FileReader();



reader.onload=function(){



localStorage.setItem(

STORAGE_KEY,

reader.result

);



loadStorage();



renderTokens();



toast(
"Mesa importada."
);



};



reader.readAsText(
file
);



}
