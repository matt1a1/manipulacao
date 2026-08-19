// ==========================================
// ESCANDINAVO RPG
// TOKENS.JS
// ==========================================

// `tokens` é declarado em main.js

function createToken(data = {}){
    saveHistory();

    const token = {
        id: Date.now() + Math.random(),
        name: data.name || "Token",
        x: data.x != null ? data.x : 300,
        y: data.y != null ? data.y : 300,
        size: data.size || 50,
        color: data.color || "#6366f1",
        image: data.image || null,
        rotation: 0,
        hp: 100,
        maxHp: 100
    };

    tokens.push(token);
    renderTokens();
    saveStorage();
    toast("Token criado.");
}

/** Lê o formulário do modal e cria o token (com imagem se houver). */
function createTokenFromForm(){
    const nameEl = document.getElementById("tokenName");
    const colorEl = document.getElementById("tokenColor");
    const sizeEl = document.getElementById("tokenSize");
    const imageEl = document.getElementById("tokenImage");

    const name = (nameEl && nameEl.value.trim()) || "Token";
    const color = (colorEl && colorEl.value) || "#6366f1";
    const size = sizeEl ? Number(sizeEl.value) : 50;

    const file = imageEl && imageEl.files && imageEl.files[0];

    if(file){
        const reader = new FileReader();
        reader.onload = function(){
            createToken({
                name,
                color,
                size,
                image: reader.result,
                x: 400,
                y: 400
            });
        };
        reader.readAsDataURL(file);
    } else {
        createToken({
            name,
            color,
            size,
            x: 400,
            y: 400
        });
    }
}

function renderTokens(){
    if(!DOM.map) return;

    DOM.map.querySelectorAll(".token").forEach(e => e.remove());

    tokens.forEach(token => {
        const el = document.createElement("div");
        el.className = "token";
        el.dataset.id = token.id;
        el.style.left = token.x + "px";
        el.style.top = token.y + "px";
        el.style.width = token.size + "px";
        el.style.height = token.size + "px";
        el.style.background = token.color;
        el.style.transform = `rotate(${token.rotation}deg)`;

        if(token.image){
            const img = document.createElement("img");
            img.src = token.image;
            img.alt = token.name;
            el.appendChild(img);
        } else {
            const div = document.createElement("div");
            div.className = "fallback";
            div.textContent = token.name.charAt(0).toUpperCase();
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
        fill.style.width = (token.hp / token.maxHp * 100) + "%";
        hp.appendChild(fill);
        el.appendChild(hp);

        el.onclick = function(e){
            e.stopPropagation();
            if(!e.ctrlKey) clearSelection();
            addSelection(token.id);
            renderSelection();
        };

        el.ondblclick = function(){
            rotateToken(token.id);
        };

        DOM.map.appendChild(el);
    });
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
            const token = tokens.find(t => t.id === id);
            if(token){
                token.image = reader.result;
                renderTokens();
                saveStorage();
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function resizeToken(id, size){
    const token = tokens.find(t => t.id === id);
    if(!token) return;
    token.size = Number(size);
    renderTokens();
    saveStorage();
}

function changeTokenColor(id, color){
    const token = tokens.find(t => t.id === id);
    if(!token) return;
    token.color = color;
    renderTokens();
    saveStorage();
}

function rotateToken(id){
    const token = tokens.find(t => t.id === id);
    if(!token) return;
    token.rotation += 45;
    renderTokens();
    saveStorage();
}

function deleteToken(id){
    saveHistory();
    tokens = tokens.filter(t => t.id !== id);
    App.selectedTokens = App.selectedTokens.filter(sid => sid !== id);
    renderTokens();
    saveStorage();
    toast("Token excluído.");
}

function deleteSelection(){
    if(App.selectedTokens.length === 0){
        toast("Nenhum token selecionado.");
        return;
    }
    saveHistory();
    tokens = tokens.filter(t => !App.selectedTokens.includes(t.id));
    App.selectedTokens = [];
    renderTokens();
    saveStorage();
    toast("Tokens excluídos.");
}

function damageToken(id, value){
    const token = tokens.find(t => t.id === id);
    if(!token) return;
    token.hp = Math.max(0, token.hp - value);
    renderTokens();
    saveStorage();
}

function healToken(id, value){
    const token = tokens.find(t => t.id === id);
    if(!token) return;
    token.hp = Math.min(token.maxHp, token.hp + value);
    renderTokens();
    saveStorage();
}
