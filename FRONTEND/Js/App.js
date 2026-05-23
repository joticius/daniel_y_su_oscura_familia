// ============================================================
// GESTOR DE HISTORIAS DE USUARIO — App.js
// Maneja tabs, modal y consumo del microservicio REST.
// ============================================================

const API_BASE = 'http://localhost:9000';
let sprintData = [];

function activarTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const screens = document.querySelectorAll('.screen');

    tabs.forEach(function (t) {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });
    screens.forEach(function (s) {
        s.classList.toggle('active', s.id === 'screen-' + tabId);
    });
}

function calcularBadgeClass(estado) {
    switch (estado) {
        case 'activa': return 'badge-active';
        case 'finalizada': return 'badge-done';
        case 'impedimento': return 'badge-block';
        default: return 'badge-new';
    }
}

function abrirModal() {
    document.getElementById('modalOverlay').classList.add('open');
}

function cerrarModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

function actualizarSprintDropdown(sprints) {
    const selectSprint = document.getElementById('selectSprint');
    selectSprint.innerHTML = '';

    if (!sprints || sprints.length === 0) {
        selectSprint.innerHTML = '<option value="0">Sin sprints disponibles</option>';
        return;
    }

    sprints.forEach(function (sprint) {
        const option = document.createElement('option');
        option.value = sprint.id;
        option.textContent = sprint.nombre;
        selectSprint.appendChild(option);
    });
}

function renderizarSprints(sprints) {
    sprintData = sprints;
    actualizarSprintDropdown(sprints);

    const sprintLabel = document.getElementById('sprintLabel');
    if (sprints.length > 0) {
        sprintLabel.textContent = sprints[0].nombre;
    }
}

function crearTarjetaBoard(historia) {
    const card = document.createElement('div');
    let cardClass = 'k-card';
    if (historia.estado === 'activa') cardClass += ' k-active';
    if (historia.estado === 'finalizada') cardClass += ' k-done';
    if (historia.estado === 'impedimento') cardClass += ' k-block';
    card.className = cardClass;

    card.innerHTML = `
        <span class="k-card-title">${historia.titulo}</span>
        <div class="k-card-footer">
            <span class="badge ${calcularBadgeClass(historia.estado)}">${historia.estado}</span>
            <span class="k-pts">${historia.puntos} pts</span>
        </div>
        <div class="k-card-author">
            <span class="avatar av-car sm">${historia.responsable.slice(0, 2).toUpperCase()}</span>
            <span class="k-author-name">${historia.responsable}</span>
        </div>
    `;
    return card;
}

function actualizarBoard(historias) {
    const columns = {
        nueva: document.getElementById('newColumn'),
        activa: document.getElementById('activeColumn'),
        finalizada: document.getElementById('doneColumn'),
        impedimento: document.getElementById('blockedColumn')
    };
    const counts = { nueva: 0, activa: 0, finalizada: 0, impedimento: 0 };

    Object.values(columns).forEach(function (col) {
        if (col) col.innerHTML = '';
    });

    historias.forEach(function (historia) {
        const estado = historia.estado || 'nueva';
        const target = columns[estado] || columns.nueva;
        const card = crearTarjetaBoard(historia);
        target.appendChild(card);
        counts[estado] = (counts[estado] || 0) + 1;
    });

    document.getElementById('countNew').textContent = counts.nueva;
    document.getElementById('countActive').textContent = counts.activa;
    document.getElementById('countDone').textContent = counts.finalizada;
    document.getElementById('countBlocked').textContent = counts.impedimento;
}

function actualizarResumenHistorias(historias) {
    const total = historias.length;
    const finalizadas = historias.filter(h => h.estado === 'finalizada').length;
    const bloqueadas = historias.filter(h => h.estado === 'impedimento').length;
    const puntosCompletados = historias.filter(h => h.estado === 'finalizada').reduce((sum, h) => sum + Number(h.puntos), 0);

    const totalStories = document.getElementById('totalStories');
    const completedStories = document.getElementById('completedStories');
    const blockedStories = document.getElementById('blockedStories');
    const pointsCompleted = document.getElementById('pointsCompleted');

    if (totalStories) totalStories.textContent = total;
    if (completedStories) completedStories.textContent = finalizadas;
    if (blockedStories) blockedStories.textContent = bloqueadas;
    if (pointsCompleted) pointsCompleted.textContent = puntosCompletados;
}

function renderizarHistorias(historias) {
    const recentStories = document.getElementById('recentStories');
    recentStories.innerHTML = '';

    if (!historias || historias.length === 0) {
        recentStories.innerHTML = '<div class="story-row"><div class="story-info"><span class="story-title">No hay historias todavía</span></div></div>';
        actualizarBoard([]);
        actualizarResumenHistorias([]);
        return;
    }

    historias.forEach(function (historia) {
        const badgeClass = calcularBadgeClass(historia.estado);
        const storyRow = document.createElement('div');
        storyRow.className = 'story-row';
        storyRow.innerHTML = "<div class=\"story-info\">" +
            "<span class=\"story-title\">" + historia.titulo + "</span>" +
            "<span class=\"story-meta\">" + historia.responsable + " · " + historia.puntos + " pts</span>" +
            "</div>" +
            "<span class=\"badge " + badgeClass + "\">" + historia.estado + "</span>";
        recentStories.appendChild(storyRow);
    });

    actualizarBoard(historias);
    actualizarResumenHistorias(historias);
}

function cargarSprints() {
    fetch(API_BASE + '/sprints')
        .then(function (res) {
            if (!res.ok) throw new Error('Error al cargar sprints');
            return res.json();
        })
        .then(renderizarSprints)
        .catch(function (err) {
            console.error('Error cargando sprints:', err);
        });
}

function cargarHistorias() {
    fetch(API_BASE + '/historias')
        .then(function (res) {
            if (!res.ok) throw new Error('Error al cargar historias');
            return res.json();
        })
        .then(renderizarHistorias)
        .catch(function (err) {
            console.error('Error cargando historias:', err);
        });
}

function guardarHistoria() {
    const titulo = document.getElementById('inputTitulo').value.trim();
    const descripcion = document.getElementById('inputDesc').value.trim();
    const selectSprint = document.getElementById('selectSprint');
    const puntos = document.getElementById('selectPuntos').value;
    const responsable = document.getElementById('selectResponsable').value;
    const estado = document.getElementById('selectEstado').value.toLowerCase();

    if (!titulo || selectSprint.value === '0') {
        document.getElementById('inputTitulo').focus();
        return;
    }

    const payload = {
        titulo: titulo,
        descripcion: descripcion,
        responsable: responsable,
        estado: estado,
        puntos: Number(puntos),
        fecha_creacion: new Date().toISOString().split('T')[0],
        sprint_id: Number(selectSprint.value)
    };

    fetch(API_BASE + '/historia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(function (res) {
            if (!res.ok) throw new Error('Error al crear historia');
            return res.json();
        })
        .then(function () {
            cerrarModal();
            cargarHistorias();
        })
        .catch(function (err) {
            console.error('Error creando historia:', err);
        });
}

function initApp() {
    const sprintSelector = document.getElementById('sprintSelector');
    const sprintOptions = document.querySelectorAll('.sprint-option');

    document.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            activarTab(tab.dataset.tab);
        });
    });

    document.querySelectorAll('[data-tab-target]').forEach(function (el) {
        el.addEventListener('click', function () {
            activarTab(el.dataset.tabTarget);
        });
    });

    sprintSelector.addEventListener('click', function (e) {
        e.stopPropagation();
        sprintSelector.classList.toggle('open');
    });

    sprintOptions.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.stopPropagation();
            sprintOptions.forEach(function (o) { o.classList.remove('active'); });
            opt.classList.add('active');
            document.getElementById('sprintLabel').textContent = 'Sprint ' + opt.dataset.sprint;
            sprintSelector.classList.remove('open');
        });
    });

    document.addEventListener('click', function () {
        sprintSelector.classList.remove('open');
    });

    document.getElementById('btnNuevaHistoria').addEventListener('click', abrirModal);
    document.getElementById('btnNuevaHistoria2').addEventListener('click', abrirModal);
    document.getElementById('btnAddStoryInline').addEventListener('click', abrirModal);
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
    document.getElementById('btnGuardar').addEventListener('click', guardarHistoria);
    document.getElementById('btnInforme').addEventListener('click', function () {
        activarTab('informe');
    });

    cargarSprints();
    cargarHistorias();
}

document.addEventListener('DOMContentLoaded', initApp);
