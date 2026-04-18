// main.js - Manipulação RPG

const map = document.getElementById('map');
const gridOverlay = document.getElementById('grid-overlay');
const palette = document.getElementById('palette');
let history = [];

const defaultTokens = [
    { type: 'emoji', value: '🧙', label: 'Mago' },
    { type: 'emoji', value: '🧝', label: 'Elfo' },
    { type: 'emoji', value: '🧟', label: 'Zumbi' },
    { type: 'emoji', value: '🐉', label: 'Dragão' },
    { type: 'emoji', value: '👑', label: 'Rei' },
    { type: 'emoji', value: '🧿', label: 'Manipulador' },
    { type: 'emoji', value: '🕵️', label: 'Espião' },
    { type: 'emoji', value: '🦹', label: 'Vilão' },
    { type: 'emoji', value: '🧬', label: 'Mutante' }
];

function createPalette() {
    palette.innerHTML = '';
    
    defaultTokens.forEach(token => {
        const div = document.createElement('div');
        div.className = 'palette-item';
        div.draggable = true;
        div.dataset.type = token.type;
        div.dataset.value = token.value;
        div.innerHTML = token.value;
        div.title = token.label;

        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                type: token.type,
                value: token.value
            }));
        });

        palette.appendChild(div);
    });
}

// Upload de Background
document.getElementById('bg-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        map.style.backgroundImage = `url('${ev.target.result}')`;
        map.style.backgroundSize = 'cover';
        map.style.backgroundPosition = 'center';
        updateStatus('✅ Mapa carregado!');
    };
    reader.readAsDataURL(file);
});

// Upload de Tokens Personalizados
document.getElementById('token-upload').addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const item = document.createElement('div');
            item.className = 'palette-item';
            item.draggable = true;
            item.dataset.type = 'image';
            item.dataset.value = ev.target.result;

            const img = document.createElement('img');
            img.src = ev.target.result;
            item.appendChild(img);

            item.addEventListener('dragstart', (dragEvent) => {
                dragEvent.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'image',
                    value: ev.target.result
                }));
            });

            palette.insertBefore(item, palette.lastElementChild || null);
        };
        reader.readAsDataURL(file);
    });
});

// Drag & Drop no Mapa
map.addEventListener('dragover', (e) => { e.preventDefault(); map.style.borderColor = '#ff00cc'; });
map.addEventListener('dragleave', () => { map.style.borderColor = '#300066'; });

map.addEventListener('drop', (e) => {
    e.preventDefault();
    map.style.borderColor = '#300066';

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const payload = JSON.parse(data);
    const rect = map.getBoundingClientRect();
    
    let x = e.clientX - rect.left - 45;
    let y = e.clientY - rect.top - 45;

    const snap = parseInt(document.getElementById('snap-range').value) || 0;
    if (snap > 0) {
        x = Math.round(x / snap) * snap;
        y = Math.round(y / snap) * snap;
    }

    createToken(payload, x, y);
    saveToHistory();
});

function createToken(payload, x, y) {
    const tokenElement = document.createElement('div');
    tokenElement.className = 'token';
    tokenElement.style.left = `${x}px`;
    tokenElement.style.top = `${y}px`;
    tokenElement.style.width = '90px';
    tokenElement.style.height = '90px';

    if (payload.type === 'image') {
        const img = document.createElement('img');
        img.src = payload.value;
        tokenElement.appendChild(img);
    } else {
        tokenElement.classList.add('emoji-token');
        tokenElement.innerHTML = `<span>${payload.value}</span>`;
    }

    makeDraggable(tokenElement);

    tokenElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm('Excluir este boneco?')) {
            tokenElement.remove();
            saveToHistory();
        }
    });

    tokenElement.addEventListener('dblclick', () => {
        const newSize = prompt('Novo tamanho do boneco (px):', '90');
        if (newSize && !isNaN(newSize)) {
            tokenElement.style.width = newSize + 'px';
            tokenElement.style.height = newSize + 'px';
        }
    });

    map.appendChild(tokenElement);
    updateStatus('Boneco colocado');
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    el.onmousedown = function(e) {
        if (e.button === 2) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = el.offsetTop - pos2;
        let newLeft = el.offsetLeft - pos1;

        const snap = parseInt(document.getElementById('snap-range').value) || 0;
        if (snap > 0) {
            newTop = Math.round(newTop / snap) * snap;
            newLeft = Math.round(newLeft / snap) * snap;
        }

        el.style.top = newTop + "px";
        el.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        saveToHistory();
    }
}

// Grid Toggle
document.getElementById('grid-toggle').addEventListener('change', (e) => {
    gridOverlay.style.opacity = e.target.checked ? '1' : '0';
});

// Snap Range
document.getElementById('snap-range').addEventListener('input', (e) => {
    document.getElementById('snap-value').textContent = e.target.value + 'px';
});

// Botões
document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Apagar tudo?')) {
        map.innerHTML = '<div id="grid-overlay" class="grid-overlay"></div><div id="status">Mapa limpo</div>';
        history = [];
    }
});

document.getElementById('undo-btn').addEventListener('click', () => {
    // Implementação simples de undo (pode ser melhorada depois)
    alert('Função de desfazer será aprimorada na próxima versão!');
});

document.getElementById('save-btn').addEventListener('click', () => {
    alert('Função de salvar JSON será implementada em breve!');
});

document.getElementById('load-btn').addEventListener('click', () => {
    document.getElementById('load-json').click();
});

// Status
function updateStatus(text) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = text;
    setTimeout(() => {
        statusEl.textContent = 'Manipulação ativa • Arraste os bonecos';
    }, 2500);
}

// Inicialização
function init() {
    createPalette();
    updateStatus('Bem-vindo ao Manipulação RPG!');
    console.log('%cManipulação RPG carregado com sucesso!', 'color:#ff00cc; font-family:monospace');
}

window.onload = init;
