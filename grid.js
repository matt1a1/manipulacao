// ==========================================
// ESCANDINAVO RPG - GRID
// ==========================================

const Grid = {
  enabled: true,
  size: 50,
  sizes: [25, 50, 75, 100]
};

window.addEventListener("load", initGrid);

function initGrid(){
  const button = document.getElementById("toggleGrid");
  if(button) button.addEventListener("click", toggleGrid);

  if(typeof App !== "undefined"){
    Grid.enabled = App.gridVisible !== false;
    Grid.size = App.gridSize || 50;
  }
  applyGrid();
  updateGridButton();
}

function toggleGrid(){
  Grid.enabled = !Grid.enabled;
  App.gridVisible = Grid.enabled;
  applyGrid();
  updateGridButton();
  if(typeof saveStorage === "function") saveStorage();
  toast(Grid.enabled ? "Grid ativado." : "Grid desativado.");
}

function updateGridButton(){
  const button = document.getElementById("toggleGrid");
  if(button) button.textContent = Grid.enabled ? "Grid ON" : "Grid OFF";
}

function applyGrid(){
  if(!DOM.map) return;

  DOM.map.classList.remove("grid25", "grid50", "grid75", "grid100", "no-grid");

  if(!Grid.enabled){
    DOM.map.classList.add("no-grid");
    return;
  }

  DOM.map.classList.add("grid" + Grid.size);
}
