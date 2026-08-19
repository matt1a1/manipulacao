// ==========================================
// UI.JS
// ESCANDINAVO RPG
// ==========================================

window.addEventListener("load", () => {
    registerUI();
});

function registerUI(){

    // ---- Modal Novo Token ----
    const openBtn = document.getElementById("openCreateToken");
    const modal = document.getElementById("createTokenModal");
    const closeBtn = document.getElementById("closeCreateToken");
    const closeBackdrop = document.getElementById("closeCreateTokenBackdrop");
    const sizeRange = document.getElementById("tokenSize");
    const sizeLabel = document.getElementById("tokenSizeValue");
    const createBtn = document.getElementById("createToken");

    function openCreateModal(){
        if(!modal) return;
        modal.hidden = false;
        const nameInput = document.getElementById("tokenName");
        if(nameInput){
            nameInput.value = "";
            nameInput.focus();
        }
        if(sizeRange && sizeLabel){
            sizeRange.value = 50;
            sizeLabel.textContent = "50px";
        }
        const color = document.getElementById("tokenColor");
        if(color) color.value = "#6366f1";
        const img = document.getElementById("tokenImage");
        if(img) img.value = "";
    }

    function closeCreateModal(){
        if(modal) modal.hidden = true;
    }

    if(openBtn) openBtn.onclick = openCreateModal;
    if(closeBtn) closeBtn.onclick = closeCreateModal;
    if(closeBackdrop) closeBackdrop.onclick = closeCreateModal;

    if(sizeRange && sizeLabel){
        sizeRange.oninput = function(){
            sizeLabel.textContent = this.value + "px";
        };
    }

    if(createBtn){
        createBtn.onclick = function(){
            createTokenFromForm();
            closeCreateModal();
        };
    }

    // ---- Zoom ----
    const zoomIn = document.getElementById("zoomIn");
    const zoomOut = document.getElementById("zoomOut");

    if(zoomIn){
        zoomIn.onclick = () => {
            App.zoom += 0.1;
            if(App.zoom > App.maxZoom) App.zoom = App.maxZoom;
            updateZoom();
        };
    }

    if(zoomOut){
        zoomOut.onclick = () => {
            App.zoom -= 0.1;
            if(App.zoom < App.minZoom) App.zoom = App.minZoom;
            updateZoom();
        };
    }

    // ---- Histórico / clipboard ----
    const undoButton = document.getElementById("undo");
    const redoButton = document.getElementById("redo");
    if(undoButton) undoButton.onclick = undo;
    if(redoButton) redoButton.onclick = redo;

    const copy = document.getElementById("copy");
    if(copy) copy.onclick = copySelection;

    const paste = document.getElementById("paste");
    if(paste) paste.onclick = pasteSelection;

    const duplicate = document.getElementById("duplicate");
    if(duplicate) duplicate.onclick = duplicateSelection;

    // ---- Salvar / Carregar ----
    const save = document.getElementById("save");
    if(save){
        save.onclick = () => {
            saveStorage();
            toast("Mesa salva.");
        };
    }

    const load = document.getElementById("load");
    if(load){
        load.onclick = () => {
            loadStorage();
            renderTokens();
            updateZoom();
            if(typeof applyGrid === "function") applyGrid();
            toast("Mesa carregada.");
        };
    }

    // ---- Grid (usa grid.js) ----
    // toggleGrid já é ligado em grid.js — não sobrescrever aqui

    // ---- Fog ----
    const fog = document.getElementById("toggleFog");
    if(fog){
        fog.onclick = () => {
            App.fogEnabled = !App.fogEnabled;
            if(typeof toggleFog === "function") toggleFog();
            saveStorage();
            toast(App.fogEnabled ? "Fog ativado." : "Fog desativado.");
        };
    }

    // ---- Régua ----
    const measure = document.getElementById("toggleMeasure");
    if(measure){
        measure.onclick = () => {
            App.measureMode = !App.measureMode;
            toast(App.measureMode ? "Régua ativada." : "Régua desativada.");
        };
    }

    // ---- Upload de mapa ----
    const uploadMap = document.getElementById("uploadMap");
    const mapLoader = document.getElementById("mapLoader");

    if(uploadMap && mapLoader){
        uploadMap.onclick = () => mapLoader.click();

        mapLoader.onchange = function(e){
            const file = e.target.files && e.target.files[0];
            if(!file) return;

            const reader = new FileReader();
            reader.onload = function(){
                if(!DOM.map) return;
                DOM.map.style.backgroundImage = `url(${reader.result})`;
                DOM.map.style.backgroundSize = "cover";
                DOM.map.style.backgroundPosition = "center";
                DOM.map.classList.add("image");
                localStorage.setItem("escandinavo_map", reader.result);
                toast("Mapa carregado.");
            };
            reader.readAsDataURL(file);
            mapLoader.value = "";
        };
    }

    // Restaurar mapa salvo
    const savedMap = localStorage.getItem("escandinavo_map");
    if(savedMap && DOM.map){
        DOM.map.style.backgroundImage = `url(${savedMap})`;
        DOM.map.style.backgroundSize = "cover";
        DOM.map.style.backgroundPosition = "center";
        DOM.map.classList.add("image");
    }

    // ---- Mapa padrão ----
    const defaultMap = document.getElementById("defaultMap");
    if(defaultMap){
        defaultMap.onclick = () => {
            if(DOM.map){
                DOM.map.style.backgroundImage = "";
                DOM.map.classList.remove("image");
            }
            localStorage.removeItem("escandinavo_map");
            toast("Mapa padrão.");
        };
    }

    // ---- Limpar mapa ----
    const clear = document.getElementById("clearMap");
    if(clear){
        clear.onclick = () => {
            if(confirm("Apagar todos os tokens?")){
                saveHistory();
                tokens = [];
                App.selectedTokens = [];
                renderTokens();
                saveStorage();
                toast("Mapa limpo.");
            }
        };
    }

    // ---- Iniciativa ----
    const initiativeBtn = document.getElementById("initiative");
    const initiativePanel = document.getElementById("initiativePanel");
    const closeInitiative = document.getElementById("closeInitiative");
    const rollInitiative = document.getElementById("rollInitiative");

    function renderInitiative(){
        const list = document.getElementById("initiativeList");
        if(!list) return;
        list.innerHTML = "";

        if(!tokens.length){
            list.innerHTML = "<p style='color:#94a3b8;font-size:13px'>Nenhum token na mesa.</p>";
            return;
        }

        const rows = tokens.map(t => ({
            name: t.name,
            roll: Math.floor(Math.random() * 20) + 1
        })).sort((a, b) => b.roll - a.roll);

        rows.forEach(r => {
            const div = document.createElement("div");
            div.className = "initiative-item";
            div.innerHTML = `<span>${r.name}</span><span class="roll">${r.roll}</span>`;
            list.appendChild(div);
        });
    }

    if(initiativeBtn && initiativePanel){
        initiativeBtn.onclick = () => {
            const open = !initiativePanel.hidden;
            initiativePanel.hidden = open;
            if(!open) renderInitiative();
        };
    }

    if(closeInitiative && initiativePanel){
        closeInitiative.onclick = () => {
            initiativePanel.hidden = true;
        };
    }

    if(rollInitiative){
        rollInitiative.onclick = renderInitiative;
    }

    // Fechar menu de contexto ao clicar fora
    document.addEventListener("click", (e) => {
        if(DOM.contextMenu && !DOM.contextMenu.contains(e.target)){
            if(typeof closeContextMenu === "function") closeContextMenu();
        }
    });

    // ESC fecha modal
    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape"){
            closeCreateModal();
            if(initiativePanel) initiativePanel.hidden = true;
        }
    });
}

function updateUI(){
    const grid = document.getElementById("toggleGrid");
    if(grid){
        grid.textContent = App.gridVisible ? "Grid ON" : "Grid OFF";
    }
}
