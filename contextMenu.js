// ==========================================
// ESCANDINAVO RPG - CONTEXT MENU
// ==========================================

let contextTokenId = null;

window.addEventListener("load", initContextMenu);

function initContextMenu(){
  document.addEventListener("contextmenu", openContextMenu);

  const map = {
    renameToken: renameContextToken,
    changeColor: changeContextColor,
    changeImage: changeContextImage,
    rotateToken: rotateContextToken,
    deleteToken: deleteContextToken
  };

  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if(el) el.onclick = map[id];
  });
}

function openContextMenu(e){
  const token = e.target.closest(".token");
  if(!token || !DOM.contextMenu) return;

  e.preventDefault();
  contextTokenId = token.dataset.id;

  DOM.contextMenu.style.display = "block";
  DOM.contextMenu.style.left = e.pageX + "px";
  DOM.contextMenu.style.top = e.pageY + "px";
}

function closeContextMenu(){
  if(DOM.contextMenu) DOM.contextMenu.style.display = "none";
}

function renameContextToken(){
  const token = findToken(contextTokenId);
  if(!token) return;
  const name = prompt("Novo nome:", token.name);
  if(name){
    token.name = name;
    renderTokens();
    saveStorage();
  }
  closeContextMenu();
}

function changeContextColor(){
  const token = findToken(contextTokenId);
  if(!token) return;
  const color = prompt("Cor HEX (ex: #ff0000):", token.color);
  if(color){
    token.color = color;
    renderTokens();
    saveStorage();
  }
  closeContextMenu();
}

function changeContextImage(){
  changeTokenImage(contextTokenId);
  closeContextMenu();
}

function rotateContextToken(){
  rotateToken(contextTokenId);
  closeContextMenu();
}

function deleteContextToken(){
  deleteToken(contextTokenId);
  closeContextMenu();
}
