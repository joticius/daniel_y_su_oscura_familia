// ============================================================
// ui.js — Manipulación del DOM
// Todas las funciones que leen o escriben elementos HTML.
// Recibe datos ya procesados y los pinta en pantalla.
// ============================================================

// ── Tabs ──────────────────────────────────────────────────

function activarTab(tabId) {
    document.querySelectorAll('.tab').forEach(function (t) {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });
    document.querySelectorAll('.screen').forEach(function (s) {
        s.classList.toggle('active', s.id === 'screen-' + tabId);
    });
}

// ── Modal ─────────────────────────────────────────────────

function abrirModal(historia) {
    // Si se pasa una historia, el modal está en modo edición
    const esEdicion = historia && historia.id;

    document.getElementById('modalTitulo').textContent         = esEdicion ? 'Editar historia' : 'Nueva historia de usuario';
    document.getElementById('inputTitulo').value               = esEdicion ? historia.titulo      : '';
    document.getElementById('inputDesc').value                 = esEdicion ? historia.descripcion  : '';
    document.getElementById('inputResponsable').value          = esEdicion ? historia.responsable  : '';
    document.getElementById('selectPuntos').value              = esEdicion ? historia.puntos        : '1';
    document.getElementById('selectEstado').value              = esEdicion ? historia.estado        : 'nueva';
    document.getElementById('selectSprint').value              = esEdicion ? historia.sprint_id     : '';

    // Guardamos el id en el botón para que app.js sepa si es edición o creación
    document.getElementById('btnGuardar').dataset.historiaId   = esEdicion ? historia.id : '';

    document.getElementById('modalOverlay').classList.add('open');
}

function cerrarModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

// ── Menú contextual de tarjeta ────────────────────────────

function cerrarMenusAbiertos() {
    document.querySelectorAll('.k-card-menu.open').forEach(function (m) {
        m.classList.remove('open');
    });
}

// ── Sprint selector y dropdown ────────────────────────────

function renderizarDropdownSprints(sprints, sprintActivoId) {
    const dropdown = document.getElementById('sprintDropdown');
    dropdown.innerHTML = '';

    sprints.forEach(function (sprint) {
        const li = document.createElement('li');
        li.className       = 'sprint-option' + (sprint.id === sprintActivoId ? ' active' : '');
        li.dataset.sprint  = sprint.id;
        li.textContent     = sprint.nombre;
        dropdown.appendChild(li);
    });
}

function actualizarSprintLabel(nombreSprint) {
    document.getElementById('sprintLabel').textContent = nombreSprint;
}

function actualizarSprintDropdownModal(sprints) {
    const select = document.getElementById('selectSprint');
    select.innerHTML = '';

    sprints.forEach(function (sprint) {
        const option       = document.createElement('option');
        option.value       = sprint.id;
        option.textContent = sprint.nombre;
        select.appendChild(option);
    });
}

// ── Dashboard — métricas ──────────────────────────────────

function actualizarMetricasDashboard(metricas, nombreSprint) {
    document.getElementById('totalStories').textContent              = metricas.total;
    document.getElementById('completedStories').textContent          = metricas.finalizadas;
    document.getElementById('blockedStories').textContent            = metricas.bloqueadas;
    document.getElementById('pointsCompleted').textContent           = metricas.puntosCompletados;
    document.getElementById('metaSprintActivo').textContent          = nombreSprint;
    document.getElementById('metaPorcentajeFinalizadas').textContent = metricas.porcentaje + '% del sprint';
    document.getElementById('metaTotalPuntos').textContent           = 'de ' + metricas.puntosTotal + ' totales';
}

// ── Dashboard — progreso por responsable ──────────────────

function renderizarProgresoResponsables(responsables) {
    const lista = document.getElementById('progressList');
    lista.innerHTML = '';

    if (responsables.length === 0) {
        lista.innerHTML = '<p class="empty-msg">Sin datos de responsables aún.</p>';
        return;
    }

    responsables.forEach(function (r) {
        const colorBarra = r.bloqueadas > 0 ? 'fill-amber' : 'fill-green';
        const iniciales  = r.nombre.slice(0, 2).toUpperCase();

        const item = document.createElement('div');
        item.className = 'progress-item';
        item.innerHTML =
            '<div class="progress-meta">' +
                '<span class="avatar av-car sm">' + iniciales + '</span>' +
                '<span class="progress-name">' + r.nombre + '</span>' +
                '<span class="progress-pts">' + r.finalizadas + '/' + r.total + ' · ' + r.puntos + ' pts</span>' +
            '</div>' +
            '<div class="progress-bar-track">' +
                '<div class="progress-bar-fill ' + colorBarra + '" style="width:' + r.porcentaje + '%"></div>' +
            '</div>';

        lista.appendChild(item);
    });
}

// ── Dashboard — últimas historias ─────────────────────────

function renderizarUltimasHistorias(historias) {
    const lista = document.getElementById('recentStories');
    lista.innerHTML = '';

    if (!historias || historias.length === 0) {
        lista.innerHTML = '<div class="story-row"><div class="story-info"><span class="story-title">No hay historias todavía</span></div></div>';
        return;
    }

    historias.forEach(function (historia) {
        const badgeClass = calcularBadgeClass(historia.estado);
        const row        = document.createElement('div');
        row.className    = 'story-row';
        row.innerHTML    =
            '<div class="story-info">' +
                '<span class="story-title">' + historia.titulo + '</span>' +
                '<span class="story-meta">' + historia.responsable + ' · ' + historia.puntos + ' pts</span>' +
            '</div>' +
            '<span class="badge ' + badgeClass + '">' + historia.estado + '</span>';
        lista.appendChild(row);
    });
}

// ── Tablero Kanban ────────────────────────────────────────

function calcularBadgeClass(estado) {
    switch (estado) {
        case 'activa':      return 'badge-active';
        case 'finalizada':  return 'badge-done';
        case 'impedimento': return 'badge-block';
        default:            return 'badge-new';
    }
}

function crearTarjetaBoard(historia, onEditar, onEliminar) {
    const card      = document.createElement('div');
    let cardClass   = 'k-card';
    if (historia.estado === 'activa')       cardClass += ' k-active';
    if (historia.estado === 'finalizada')   cardClass += ' k-done';
    if (historia.estado === 'impedimento')  cardClass += ' k-block';
    card.className  = cardClass;

    const iniciales = historia.responsable.slice(0, 2).toUpperCase();

    card.innerHTML =
        '<div class="k-card-top">' +
            '<span class="k-card-title">' + historia.titulo + '</span>' +
            // Botón de tres puntos para abrir el menú
            '<button class="k-card-menu-btn" title="Opciones">' +
                '<i class="ti ti-dots-vertical"></i>' +
            '</button>' +
            // Menú contextual
            '<div class="k-card-menu">' +
                '<button class="k-menu-item k-menu-edit">' +
                    '<i class="ti ti-pencil"></i> Editar' +
                '</button>' +
                '<button class="k-menu-item k-menu-delete">' +
                    '<i class="ti ti-trash"></i> Eliminar' +
                '</button>' +
            '</div>' +
        '</div>' +
        '<div class="k-card-footer">' +
            '<span class="badge ' + calcularBadgeClass(historia.estado) + '">' + historia.estado + '</span>' +
            '<span class="k-pts">' + historia.puntos + ' pts</span>' +
        '</div>' +
        '<div class="k-card-author">' +
            '<span class="avatar av-car sm">' + iniciales + '</span>' +
            '<span class="k-author-name">' + historia.responsable + '</span>' +
        '</div>';

    // Abrir/cerrar menú al hacer clic en los tres puntos
    card.querySelector('.k-card-menu-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        const menu = card.querySelector('.k-card-menu');
        const estaAbierto = menu.classList.contains('open');
        cerrarMenusAbiertos();
        if (!estaAbierto) menu.classList.add('open');
    });

    // Editar
    card.querySelector('.k-menu-edit').addEventListener('click', function (e) {
        e.stopPropagation();
        cerrarMenusAbiertos();
        onEditar(historia);
    });

    // Eliminar
    card.querySelector('.k-menu-delete').addEventListener('click', function (e) {
        e.stopPropagation();
        cerrarMenusAbiertos();
        onEliminar(historia);
    });

    return card;
}

function actualizarBoard(historias, onEditar, onEliminar) {
    const columns = {
        nueva:       document.getElementById('newColumn'),
        activa:      document.getElementById('activeColumn'),
        finalizada:  document.getElementById('doneColumn'),
        impedimento: document.getElementById('blockedColumn')
    };
    const counts = { nueva: 0, activa: 0, finalizada: 0, impedimento: 0 };

    Object.values(columns).forEach(function (col) {
        if (col) col.innerHTML = '';
    });

    historias.forEach(function (historia) {
        const estado = historia.estado || 'nueva';
        const target = columns[estado] || columns.nueva;
        target.appendChild(crearTarjetaBoard(historia, onEditar, onEliminar));
        counts[estado]++;
    });

    document.getElementById('countNew').textContent     = counts.nueva;
    document.getElementById('countActive').textContent  = counts.activa;
    document.getElementById('countDone').textContent    = counts.finalizada;
    document.getElementById('countBlocked').textContent = counts.impedimento;
}

// ── Pantalla de informe ───────────────────────────────────

function actualizarPantallaInforme(metricas, responsables, detaImpedimentos, nombreSprint) {
    document.getElementById('informeSprintTitulo').textContent     = 'Informe ' + nombreSprint;
    document.getElementById('reportFinalizadas').textContent       = metricas.finalizadas;
    document.getElementById('reportPorcentaje').textContent        = metricas.porcentaje + '% del total del sprint';
    document.getElementById('reportPuntosCompletados').textContent = metricas.puntosCompletados;
    document.getElementById('reportPuntosTotal').textContent       = 'de ' + metricas.puntosTotal + ' puntos totales';
    document.getElementById('reportImpedimentos').textContent      = metricas.bloqueadas;
    document.getElementById('reportImpedimentoDetalle').textContent = detaImpedimentos;
    document.getElementById('reportPendientes').textContent        = metricas.pendientes;

    renderizarResumenResponsables(responsables);
}

// ── Modal de nuevo sprint ─────────────────────────────────

function abrirModalSprint() {
    document.getElementById('inputSprintNombre').value = '';
    document.getElementById('inputSprintInicio').value = '';
    document.getElementById('inputSprintFin').value    = '';
    document.getElementById('modalSprintOverlay').classList.add('open');
}

function cerrarModalSprint() {
    document.getElementById('modalSprintOverlay').classList.remove('open');
}

function renderizarResumenResponsables(responsables) {
    const lista = document.getElementById('responsableList');
    lista.innerHTML = '';

    if (responsables.length === 0) {
        lista.innerHTML = '<p class="empty-msg">Sin datos de responsables aún.</p>';
        return;
    }

    responsables.forEach(function (r) {
        const iniciales = r.nombre.slice(0, 2).toUpperCase();
        let badgeClass  = 'badge-active';
        if (r.porcentaje === 100) badgeClass = 'badge-done';
        if (r.bloqueadas > 0)    badgeClass = 'badge-block';

        const row       = document.createElement('div');
        row.className   = 'responsable-row';
        row.innerHTML   =
            '<span class="avatar av-car lg">' + iniciales + '</span>' +
            '<div class="responsable-info">' +
                '<span class="responsable-name">' + r.nombre + '</span>' +
                '<span class="responsable-detail">' +
                    r.finalizadas + ' finalizada(s) · ' + r.bloqueadas + ' impedimento(s) · ' + r.puntos + ' pts acumulados' +
                '</span>' +
            '</div>' +
            '<span class="badge ' + badgeClass + '">' + r.porcentaje + '%</span>';

        lista.appendChild(row);
    });
}