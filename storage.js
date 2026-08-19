// ==========================================
// ESCANDINAVO RPG - STORAGE
// ==========================================

const STORAGE_KEY = "escandinavo_rpg_save";

function saveStorage(){
  const data = {
    version: App.version || "2.2.0",
    zoom: App.zoom,
    gridVisible: App.gridVisible,
    snapGrid: App.snapGrid,
    fogEnabled: App.fogEnabled,
    measureMode: App.measureMode,
    mapOffset: App.mapOffset,
    tokens: tokens || [],
    mapImage: localStorage.getItem("escandinavo_map")
  };
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }catch(err){
    console.error(err);
    toast("Não foi possível salvar (storage cheio?).");
  }
}

function loadStorage(){
  const save = localStorage.getItem(STORAGE_KEY);
  if(!save) return;

  try{
    const data = JSON.parse(save);
    if(data.zoom != null) App.zoom = data.zoom;
    if(data.gridVisible != null) App.gridVisible = data.gridVisible;
    if(data.snapGrid != null) App.snapGrid = data.snapGrid;
    if(data.fogEnabled != null) App.fogEnabled = data.fogEnabled;
    if(data.measureMode != null) App.measureMode = data.measureMode;
    if(data.mapOffset) App.mapOffset = data.mapOffset;
    if(Array.isArray(data.tokens)){
      tokens = data.tokens.map(t => ({
        ...t,
        id: String(t.id)
      }));
    }
    if(data.mapImage){
      localStorage.setItem("escandinavo_map", data.mapImage);
    }
  }catch(error){
    console.error("Erro ao carregar save:", error);
    toast("Erro ao carregar dados.");
  }
}

function clearStorage(){
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("escandinavo_map");
  toast("Dados apagados.");
}

setInterval(() => {
  if(typeof tokens !== "undefined") saveStorage();
}, 30000);
