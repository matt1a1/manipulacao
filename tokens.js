// ==========================================
// ESCANDINAVO RPG - TOKENS
// ==========================================

function newTokenId(){
  return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

function createToken(data = {}){
  saveHistory();

  const token = {
    id: newTokenId(),
    name: data.name || "Token",
    x: data.x != null ? data.x : 1400,
    y: data.y != null ? data.y : 1400,
    size: Number(data.size) || 50,
    color: data.color || "#6366f1",
    image: data.image || null,
    rotation: 0,
    hp: 100,
    maxHp: 100
  };

  tokens.push(token);
  renderTokens();
  saveStorage();
  toast("Token criado: " + token.name);
}

function createTokenFromForm(){
  const nameEl = document.getElementById("tokenName");
  const colorEl = document.getElementById("tokenColor");
  const sizeEl = document.getElementById("tokenSize");
  const imageEl = document.getElementById("tokenImage");

  const name = (nameEl && nameEl.value.trim()) || "Token";
  const color = (colorEl && colorEl.value) || "#6366f1";
  const size = sizeEl ? Number(sizeEl.value) : 50;
  const file = imageEl && imageEl.files && imageEl.files[0];

  const place = { name, color, size, x: 1400, y: 1400 };

  if(file){
    const reader = new FileReader();
    reader.onload = () => createToken({ ...place, image: reader.result });
    reader.readAsDataURL(file);
  } else {
    createToken(place);
  }
}

function renderTokens(){
  if(!DOM.map) return;

  DOM.map.querySelectorAll(".token").forEach(e => e.remove());

  tokens.forEach(token => {
    const el = document.createElement("div");
    el.className = "token";
    el.dataset.id = String(token.id);
    el.style.left = token.x + "px";
    el.style.top = token.y + "px";
    el.style.width = token.size + "px";
    el.style.height = token.size + "px";
    el.style.background = token.color;
    el.style.transform = `rotate(${token.rotation || 0}deg)`;

    if(App.selectedTokens.includes(String(token.id))){
      el.classList.add("selected");
    }

    if(token.image){
      const img = document.createElement("img");
      img.src = token.image;
      img.alt = token.name;
      img.draggable = false;
      el.appendChild(img);
    } else {
      const div = document.createElement("div");
      div.className = "fallback";
      div.textContent = (token.name || "?").charAt(0).toUpperCase();
      el.appendChild(div);
    }

    const name = document.createElement("div");
    name.className = "tokenName";
    name.textContent = token.name;
    el.appendChild(name);

    const hp = document.createElement("div");
    hp.className = "hpBar";
    const fill = document.createElement("div");
    fill.className = "hpFill";
    const maxHp = token.maxHp || 100;
    const cur = token.hp != null ? token.hp : maxHp;
    fill.style.width = Math.max(0, Math.min(100, (cur / maxHp) * 100)) + "%";
    hp.appendChild(fill);
    el.appendChild(hp);

    el.addEventListener("click", function(e){
      e.stopPropagation();
      if(!e.ctrlKey && !e.metaKey) clearSelection();
      addSelection(token.id);
      renderSelection();
    });

    el.addEventListener("dblclick", function(e){
      e.stopPropagation();
      rotateToken(token.id);
    });

    DOM.map.appendChild(el);
  });
}

function findToken(id){
  return tokens.find(t => String(t.id) === String(id));
}

function changeTokenImage(id){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      const token = findToken(id);
      if(token){
        token.image = reader.result;
        renderTokens();
        saveStorage();
        toast("Imagem atualizada.");
      }
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function rotateToken(id){
  const token = findToken(id);
  if(!token) return;
  token.rotation = (token.rotation || 0) + 45;
  renderTokens();
  saveStorage();
}

function deleteToken(id){
  saveHistory();
  tokens = tokens.filter(t => String(t.id) !== String(id));
  App.selectedTokens = App.selectedTokens.filter(sid => String(sid) !== String(id));
  renderTokens();
  saveStorage();
  toast("Token excluído.");
}

function deleteSelection(){
  if(!App.selectedTokens.length){
    toast("Nenhum token selecionado.");
    return;
  }
  saveHistory();
  const set = new Set(App.selectedTokens.map(String));
  tokens = tokens.filter(t => !set.has(String(t.id)));
  App.selectedTokens = [];
  renderTokens();
  saveStorage();
  toast("Tokens excluídos.");
}
