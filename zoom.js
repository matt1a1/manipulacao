// ==========================================
// ESCANDINAVO RPG - ZOOM
// ==========================================

window.addEventListener("load", initZoom);

function initZoom(){
  const plus = document.getElementById("zoomIn");
  const minus = document.getElementById("zoomOut");

  if(plus){
    plus.onclick = () => changeZoom(0.1);
  }
  if(minus){
    minus.onclick = () => changeZoom(-0.1);
  }

  updateZoom();
}

function changeZoom(value){
  App.zoom += value;
  if(App.zoom < App.minZoom) App.zoom = App.minZoom;
  if(App.zoom > App.maxZoom) App.zoom = App.maxZoom;
  updateZoom();
}

function resetZoom(){
  App.zoom = 1;
  App.mapOffset = { x: 0, y: 0 };
  updateZoom();
  toast("Zoom restaurado.");
}
