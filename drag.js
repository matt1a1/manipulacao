// ==========================================
// ESCANDINAVO RPG - DRAG / PAN
// ==========================================

let draggingToken = null;
let dragOffset = { x: 0, y: 0 };
let panning = false;
let panStart = { x: 0, y: 0 };
let mapStart = { x: 0, y: 0 };
let spaceHeld = false;

window.addEventListener("load", () => {
  registerDrag();
});

function registerDrag(){
  if(!DOM.map || !DOM.wrapper) return;

  DOM.map.addEventListener("mousedown", mouseDown);
  DOM.wrapper.addEventListener("mousedown", mouseDownOnWrapper);
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);

  document.addEventListener("keydown", e => {
    if(e.code === "Space" && e.target.tagName !== "INPUT"){
      e.preventDefault();
      spaceHeld = true;
    }
  });
  document.addEventListener("keyup", e => {
    if(e.code === "Space"){
      spaceHeld = false;
      stopPan();
    }
  });
}

/** Converte clientX/Y para coordenadas dentro do #map */
function clientToMap(clientX, clientY){
  if(!DOM.map) return { x: 0, y: 0 };
  const rect = DOM.map.getBoundingClientRect();
  const x = (clientX - rect.left) / App.zoom;
  const y = (clientY - rect.top) / App.zoom;
  return { x, y };
}

function mouseDownOnWrapper(e){
  if(e.target.closest(".token")) return;
  if(e.button !== 0) return;

  if(spaceHeld || e.target === DOM.wrapper || e.target === DOM.map){
    startPan();
    panStart.x = e.clientX;
    panStart.y = e.clientY;
    mapStart.x = App.mapOffset.x;
    mapStart.y = App.mapOffset.y;
  }
}

function mouseDown(e){
  const tokenElement = e.target.closest(".token");
  if(!tokenElement) return;

  e.stopPropagation();

  const id = tokenElement.dataset.id;
  const token = tokens.find(t => String(t.id) === String(id));
  if(!token) return;

  saveHistory();

  if(!e.ctrlKey && !e.metaKey && !App.selectedTokens.includes(String(id))){
    clearSelection();
    addSelection(id);
    renderSelection();
  }

  draggingToken = token;
  const pos = clientToMap(e.clientX, e.clientY);
  dragOffset.x = pos.x - token.x;
  dragOffset.y = pos.y - token.y;
  tokenElement.classList.add("dragging");
}

function mouseMove(e){
  if(draggingToken){
    const pos = clientToMap(e.clientX, e.clientY);
    let x = pos.x - dragOffset.x;
    let y = pos.y - dragOffset.y;

    if(App.snapGrid){
      const g = App.gridSize || 50;
      x = Math.round(x / g) * g;
      y = Math.round(y / g) * g;
    }

    draggingToken.x = x;
    draggingToken.y = y;

    const el = document.querySelector(`.token[data-id="${draggingToken.id}"]`);
    if(el){
      el.style.left = x + "px";
      el.style.top = y + "px";
    }
    return;
  }

  if(panning){
    App.mapOffset.x = mapStart.x + (e.clientX - panStart.x);
    App.mapOffset.y = mapStart.y + (e.clientY - panStart.y);
    updateMapPosition();
  }
}

function mouseUp(){
  if(draggingToken){
    const el = document.querySelector(`.token[data-id="${draggingToken.id}"]`);
    if(el) el.classList.remove("dragging");
    draggingToken = null;
    saveStorage();
  }
  stopPan();
}

function startPan(){
  panning = true;
  if(DOM.wrapper) DOM.wrapper.classList.add("grabbing");
}

function stopPan(){
  panning = false;
  if(DOM.wrapper) DOM.wrapper.classList.remove("grabbing");
}
