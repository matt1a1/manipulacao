// ==========================================
// GRID SYSTEM
// ESCANDINAVO RPG
// ==========================================

const Grid = {
    enabled: true,
    size: 50,
    sizes: [25, 50, 75, 100]
};

window.addEventListener("load", () => {
    initGrid();
});

function initGrid(){
    const button = document.getElementById("toggleGrid");
    if(button){
        button.addEventListener("click", toggleGrid);
    }
    // Sincronizar com App se já carregado
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
    if(button){
        button.textContent = Grid.enabled ? "Grid ON" : "Grid OFF";
    }
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

function changeGridSize(size){
    if(!Grid.sizes.includes(size)) return;
    Grid.size = size;
    App.gridSize = size;
    applyGrid();
    toast("Grid alterado para " + size + "px");
}

function nextGridSize(){
    let index = Grid.sizes.indexOf(Grid.size);
    index++;
    if(index >= Grid.sizes.length) index = 0;
    changeGridSize(Grid.sizes[index]);
}

function snapPosition(x, y){
    if(!App.snapGrid){
        return { x, y };
    }
    return {
        x: Math.round(x / Grid.size) * Grid.size,
        y: Math.round(y / Grid.size) * Grid.size
    };
}

function toggleSnap(){
    App.snapGrid = !App.snapGrid;
    toast(App.snapGrid ? "Snap ativado." : "Snap desativado.");
}

function getGridCell(x, y){
    return {
        x: Math.floor(x / Grid.size),
        y: Math.floor(y / Grid.size)
    };
}

function saveGrid(){
    localStorage.setItem("grid", JSON.stringify({
        enabled: Grid.enabled,
        size: Grid.size
    }));
}

function loadGrid(){
    const data = localStorage.getItem("grid");
    if(!data) return;
    const config = JSON.parse(data);
    Grid.enabled = config.enabled;
    Grid.size = config.size;
    App.gridSize = config.size;
    App.gridVisible = config.enabled;
    applyGrid();
    updateGridButton();
}
