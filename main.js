// ==========================================
// ESCANDINAVO RPG - MAIN
// ==========================================

const App = {
  version: "2.2.0",
  zoom: 1,
  minZoom: 0.3,
  maxZoom: 4,
  gridSize: 50,
  snapGrid: true,
  gridVisible: true,
  fogEnabled: false,
  measureMode: false,
  selectedTokens: [],
  clipboard: [],
  history: [],
  redoHistory: [],
  mapOffset: { x: 0, y: 0 }
};

let tokens = [];

const DOM = {
  map: null,
  wrapper: null,
  sidebar: null,
  zoomLabel: null,
  loading: null,
  library: null,
  initiative: null,
  contextMenu: null,
  fog: null
};

window.addEventListener("load", init);

function init(){
  cacheDOM();
  ensureFog();
  loadStorage();
  registerEvents();

  if(typeof applyGrid === "function") applyGrid();
  if(typeof renderLibrary === "function") renderLibrary();
  if(typeof renderTokens === "function") renderTokens();

  updateZoom();
  updateMapPosition();
  hideLoading();
  toast("Mesa Escandinavo pronta.");
}

function cacheDOM(){
  DOM.map = document.getElementById("map");
  DOM.wrapper = document.getElementById("mapWrapper");
  DOM.sidebar = document.getElementById("sidebar");
  DOM.zoomLabel = document.getElementById("zoomValue");
  DOM.loading = document.getElementById("loading");
  DOM.library = document.getElementById("libraryList");
  DOM.initiative = document.getElementById("initiativeList");
  DOM.contextMenu = document.getElementById("contextMenu");
}

function ensureFog(){
  if(!DOM.wrapper) return;
  let fog = document.getElementById("fogOverlay");
  if(!fog){
    fog = document.createElement("div");
    fog.id = "fogOverlay";
    DOM.wrapper.appendChild(fog);
  }
  DOM.fog = fog;
  fog.classList.toggle("on", !!App.fogEnabled);
}

function registerEvents(){
  window.addEventListener("resize", () => updateZoom());
  document.addEventListener("keydown", keyboard);
  document.addEventListener("keyup", keyboardUp);

  if(DOM.wrapper){
    DOM.wrapper.addEventListener("wheel", mouseZoom, { passive: false });
  }
}

function saveHistory(){
  const state = {
    zoom: App.zoom,
    grid: App.gridVisible,
    snap: App.snapGrid,
    tokens: JSON.parse(JSON.stringify(tokens))
  };
  App.history.push(state);
  if(App.history.length > 50) App.history.shift();
  App.redoHistory = [];
}

function undo(){
  if(!App.history.length){
    toast("Nada para desfazer.");
    return;
  }
  App.redoHistory.push({
    zoom: App.zoom,
    grid: App.gridVisible,
    snap: App.snapGrid,
    tokens: JSON.parse(JSON.stringify(tokens))
  });
  const state = App.history.pop();
  App.zoom = state.zoom;
  App.gridVisible = state.grid;
  App.snapGrid = state.snap;
  tokens = JSON.parse(JSON.stringify(state.tokens));
  App.selectedTokens = [];
  if(typeof applyGrid === "function") applyGrid();
  renderTokens();
  updateZoom();
  saveStorage();
}

function redo(){
  if(!App.redoHistory.length){
    toast("Nada para refazer.");
    return;
  }
  App.history.push({
    zoom: App.zoom,
    grid: App.gridVisible,
    snap: App.snapGrid,
    tokens: JSON.parse(JSON.stringify(tokens))
  });
  const state = App.redoHistory.pop();
  App.zoom = state.zoom;
  App.gridVisible = state.grid;
  App.snapGrid = state.snap;
  tokens = JSON.parse(JSON.stringify(state.tokens));
  App.selectedTokens = [];
  if(typeof applyGrid === "function") applyGrid();
  renderTokens();
  updateZoom();
  saveStorage();
}

function clearSelection(){
  App.selectedTokens = [];
  document.querySelectorAll(".token.selected").forEach(el => {
    el.classList.remove("selected");
  });
}

function addSelection(id){
  const sid = String(id);
  if(!App.selectedTokens.includes(sid)){
    App.selectedTokens.push(sid);
  }
}

function renderSelection(){
  document.querySelectorAll(".token").forEach(el => {
    el.classList.toggle("selected", App.selectedTokens.includes(String(el.dataset.id)));
  });
}

function copySelection(){
  App.clipboard = [];
  App.selectedTokens.forEach(id => {
    const token = tokens.find(t => String(t.id) === String(id));
    if(token) App.clipboard.push(structuredClone(token));
  });
  toast(App.clipboard.length ? "Copiado." : "Nada selecionado.");
}

function pasteSelection(){
  if(!App.clipboard.length){
    toast("Área de transferência vazia.");
    return;
  }
  saveHistory();
  App.clipboard.forEach(token => {
    tokens.push({
      ...token,
      id: String(Date.now()) + Math.random().toString(16).slice(2),
      x: token.x + 50,
      y: token.y + 50
    });
  });
  renderTokens();
  saveStorage();
  toast("Colado.");
}

function duplicateSelection(){
  copySelection();
  pasteSelection();
}

function updateZoom(){
  if(!DOM.map) return;
  DOM.map.style.transform =
    `translate(calc(-50% + ${App.mapOffset.x}px), calc(-50% + ${App.mapOffset.y}px)) scale(${App.zoom})`;
  if(DOM.zoomLabel){
    DOM.zoomLabel.textContent = Math.round(App.zoom * 100) + "%";
  }
}

function updateMapPosition(){
  updateZoom();
}

function mouseZoom(e){
  e.preventDefault();
  const delta = e.deltaY < 0 ? 0.1 : -0.1;
  App.zoom = Math.min(App.maxZoom, Math.max(App.minZoom, App.zoom + delta));
  updateZoom();
}

function keyboard(e){
  if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  if(e.key === "Delete" || e.key === "Backspace"){
    e.preventDefault();
    if(typeof deleteSelection === "function") deleteSelection();
  }
  if(e.key === "Escape"){
    clearSelection();
    if(typeof closeContextMenu === "function") closeContextMenu();
  }
  if(e.ctrlKey || e.metaKey){
    if(e.key === "z"){ e.preventDefault(); undo(); }
    if(e.key === "y"){ e.preventDefault(); redo(); }
    if(e.key === "c"){ e.preventDefault(); copySelection(); }
    if(e.key === "v"){ e.preventDefault(); pasteSelection(); }
  }
}

function keyboardUp(e){
  if(e.key === " " && typeof stopPan === "function") stopPan();
}

function hideLoading(){
  if(!DOM.loading) return;
  setTimeout(() => {
    DOM.loading.style.opacity = "0";
    setTimeout(() => {
      if(DOM.loading) DOM.loading.remove();
    }, 400);
  }, 500);
}

function toast(msg){
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}
