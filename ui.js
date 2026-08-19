// ==========================================
// ESCANDINAVO RPG - UI / BOTÕES
// ==========================================

window.addEventListener("load", () => {
  registerUI();
});

function registerUI(){
  // Modal Novo Token
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
      setTimeout(() => nameInput.focus(), 50);
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
      if(typeof createTokenFromForm === "function") createTokenFromForm();
      closeCreateModal();
    };
  }

  // Undo / Redo / Copy / Paste / Duplicate
  bind("undo", undo);
  bind("redo", redo);
  bind("copy", copySelection);
  bind("paste", pasteSelection);
  bind("duplicate", duplicateSelection);

  // Save / Load
  bind("save", () => {
    saveStorage();
    toast("Mesa salva.");
  });

  bind("load", () => {
    loadStorage();
    if(typeof applyGrid === "function") applyGrid();
    renderTokens();
    updateZoom();
    ensureFog();
    toast("Mesa carregada.");
  });

  // Fog
  bind("toggleFog", () => {
    App.fogEnabled = !App.fogEnabled;
    ensureFog();
    if(DOM.fog) DOM.fog.classList.toggle("on", App.fogEnabled);
    saveStorage();
    toast(App.fogEnabled ? "Fog ativado." : "Fog desativado.");
  });

  // Régua (placeholder simples)
  bind("toggleMeasure", () => {
    App.measureMode = !App.measureMode;
    toast(App.measureMode ? "Régua ativada (em breve mais precisa)." : "Régua desativada.");
  });

  // Upload mapa
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
        DOM.map.style.backgroundRepeat = "no-repeat";
        DOM.map.classList.add("image");
        localStorage.setItem("escandinavo_map", reader.result);
        toast("Mapa carregado.");
      };
      reader.readAsDataURL(file);
      mapLoader.value = "";
    };
  }

  // Restaurar mapa
  const savedMap = localStorage.getItem("escandinavo_map");
  if(savedMap && DOM.map){
    DOM.map.style.backgroundImage = `url(${savedMap})`;
    DOM.map.style.backgroundSize = "cover";
    DOM.map.style.backgroundPosition = "center";
    DOM.map.style.backgroundRepeat = "no-repeat";
    DOM.map.classList.add("image");
  }

  bind("defaultMap", () => {
    if(DOM.map){
      DOM.map.style.backgroundImage = "";
      DOM.map.classList.remove("image");
    }
    localStorage.removeItem("escandinavo_map");
    if(typeof applyGrid === "function") applyGrid();
    toast("Mapa padrão.");
  });

  bind("clearMap", () => {
    if(!confirm("Apagar todos os tokens?")) return;
    saveHistory();
    tokens = [];
    App.selectedTokens = [];
    renderTokens();
    saveStorage();
    toast("Mapa limpo.");
  });

  // Iniciativa
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
      div.innerHTML = `<span>${escapeHtml(r.name)}</span><span class="roll">${r.roll}</span>`;
      list.appendChild(div);
    });
  }

  if(initiativeBtn && initiativePanel){
    initiativeBtn.onclick = () => {
      const willOpen = initiativePanel.hidden;
      initiativePanel.hidden = !willOpen;
      if(willOpen) renderInitiative();
    };
  }
  if(closeInitiative && initiativePanel){
    closeInitiative.onclick = () => { initiativePanel.hidden = true; };
  }
  if(rollInitiative) rollInitiative.onclick = renderInitiative;

  document.addEventListener("click", (e) => {
    if(DOM.contextMenu && !DOM.contextMenu.contains(e.target)){
      if(typeof closeContextMenu === "function") closeContextMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      closeCreateModal();
      if(initiativePanel) initiativePanel.hidden = true;
    }
  });
}

function bind(id, fn){
  const el = document.getElementById(id);
  if(el) el.onclick = fn;
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateUI(){
  const grid = document.getElementById("toggleGrid");
  if(grid){
    grid.textContent = App.gridVisible ? "Grid ON" : "Grid OFF";
  }
}
