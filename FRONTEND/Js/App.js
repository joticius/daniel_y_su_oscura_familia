let sprintData     = [];   // Lista de sprints cargados desde la API
let historiasData  = [];   // Lista de historias cargadas desde la API
let sprintActivoId = null; // ID del sprint seleccionado en el dropdown
 
// ── Carga de datos ────────────────────────────────────────
 
function cargarSprints(activarUltimo) {
    getSprints()
        .then(function (sprints) {
            sprintData = sprints;

            // Si se pide activar el último (sprint recién creado), usarlo
            // Si ya había un sprint activo y sigue existiendo, mantenerlo
            // Si no hay nada, activar el primero
            if (activarUltimo && sprints.length > 0) {
                sprintActivoId = sprints[sprints.length - 1].id;
            } else if (!sprintActivoId || !sprints.find(function (s) { return s.id === sprintActivoId; })) {
                sprintActivoId = sprints.length > 0 ? sprints[0].id : null;
            }
 
            var sprintActivo = sprints.find(function (s) { return s.id === sprintActivoId; });
            var nombreActivo = sprintActivo ? sprintActivo.nombre : '—';
 
            renderizarDropdownSprints(sprints, sprintActivoId);
            actualizarSprintLabel(nombreActivo);
            actualizarSprintDropdownModal(sprints);

            // Refrescar vistas para que el filtro refleje el sprint activo
            refrescarVistas();
        })
        .catch(function (err) {
            console.error('Error cargando sprints:', err);
        });
}
 
function cargarHistorias() {
    getHistorias()
        .then(function (historias) {
            historiasData = historias;
            refrescarVistas();
        })
        .catch(function (err) {
            console.error('Error cargando historias:', err);
        });
}
 
// ── Refresco de todas las vistas con los datos actuales ───
 
function refrescarVistas() {
    // Filtrar historias por el sprint activo seleccionado en el dropdown
    var historiasFiltradas = sprintActivoId
        ? historiasData.filter(function (h) { return Number(h.sprint_id) === Number(sprintActivoId); })
        : historiasData;

    var metricas         = calcularMetricas(historiasFiltradas);
    var responsables     = calcularProgresoPorResponsable(historiasFiltradas);
    var detaImpedimentos = obtenerDetaImpedimentos(historiasFiltradas);
 
    var sprintActivo = sprintData.find(function (s) { return s.id === sprintActivoId; });
    var nombreSprint = sprintActivo ? sprintActivo.nombre : '—';
 
    // Dashboard
    actualizarMetricasDashboard(metricas, nombreSprint);
    renderizarProgresoResponsables(responsables);
    renderizarUltimasHistorias(historiasFiltradas);
 
    // Board — se pasan los callbacks de editar y eliminar
    actualizarBoard(historiasFiltradas, abrirModalEdicion, confirmarEliminar);
 
    // Informe
    actualizarPantallaInforme(metricas, responsables, detaImpedimentos, nombreSprint);
}
 
// ── Crear historia ────────────────────────────────────────
 
function guardarHistoria() {
    const titulo      = document.getElementById('inputTitulo').value.trim();
    const descripcion = document.getElementById('inputDesc').value.trim();
    const responsable = document.getElementById('inputResponsable').value.trim();
    const puntos      = document.getElementById('selectPuntos').value;
    const estado      = document.getElementById('selectEstado').value;
    const sprintId    = Number(document.getElementById('selectSprint').value);
    const historiaId  = document.getElementById('btnGuardar').dataset.historiaId;
 
    if (!titulo) {
        document.getElementById('inputTitulo').focus();
        return;
    }
    if (!responsable) {
        document.getElementById('inputResponsable').focus();
        return;
    }
 
    const payload = {
        titulo:         titulo,
        descripcion:    descripcion,
        responsable:    responsable,
        estado:         estado,
        puntos:         Number(puntos),
        fecha_creacion: new Date().toISOString().split('T')[0],
        sprint_id:      sprintId
    };
 
    // Si hay historiaId en el botón, es edición; si no, es creación
    const peticion = historiaId
        ? putHistoria(Number(historiaId), payload)
        : postHistoria(payload);
 
    peticion
        .then(function () {
            cerrarModal();
            cargarHistorias();
        })
        .catch(function (err) {
            console.error('Error guardando historia:', err);
        });
}
 
// ── Crear sprint ──────────────────────────────────────────

function guardarSprint() {
    var nombre = document.getElementById('inputSprintNombre').value.trim();
    var inicio = document.getElementById('inputSprintInicio').value;
    var fin    = document.getElementById('inputSprintFin').value;

    if (!nombre) {
        document.getElementById('inputSprintNombre').focus();
        return;
    }
    if (!inicio) {
        document.getElementById('inputSprintInicio').focus();
        return;
    }
    if (!fin) {
        document.getElementById('inputSprintFin').focus();
        return;
    }
    if (fin < inicio) {
        alert('La fecha de fin no puede ser anterior a la de inicio.');
        document.getElementById('inputSprintFin').focus();
        return;
    }

    var payload = {
        nombre:       nombre,
        fecha_inicio: inicio,
        fecha_fin:    fin
    };

    postSprint(payload)
        .then(function () {
            cerrarModalSprint();
            // Recargar sprints activando el recién creado (último de la lista)
            // Las historias ya están en memoria, solo se refresca el filtro
            cargarSprints(true);
        })
        .catch(function (err) {
            console.error('Error creando sprint:', err);
        });
}

// ── Editar historia ───────────────────────────────────────
 
function abrirModalEdicion(historia) {
    // Pasamos la historia completa a ui.js para que rellene el modal
    abrirModal(historia);
}
 
// ── Eliminar historia ─────────────────────────────────────
 
function confirmarEliminar(historia) {
    if (!confirm('¿Eliminar "' + historia.titulo + '"? Esta acción no se puede deshacer.')) return;
 
    deleteHistoria(historia.id)
        .then(function () {
            cargarHistorias();
        })
        .catch(function (err) {
            console.error('Error eliminando historia:', err);
        });
}
 
// ── Event listeners ───────────────────────────────────────
 
function initApp() {
 
    // Tabs
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
 
    // Sprint selector (dropdown topbar)
    const sprintSelector = document.getElementById('sprintSelector');
    sprintSelector.addEventListener('click', function (e) {
        e.stopPropagation();
        sprintSelector.classList.toggle('open');
    });
 
    document.getElementById('sprintDropdown').addEventListener('click', function (e) {
        const opcion = e.target.closest('.sprint-option');
        if (!opcion) return;
 
        document.querySelectorAll('.sprint-option').forEach(function (o) {
            o.classList.remove('active');
        });
        opcion.classList.add('active');
 
        sprintActivoId = Number(opcion.dataset.sprint);
        actualizarSprintLabel(opcion.textContent);
        sprintSelector.classList.remove('open');
        refrescarVistas();
    });
 
    // Cerrar dropdown de sprint y menús de tarjetas al hacer clic fuera
    document.addEventListener('click', function () {
        sprintSelector.classList.remove('open');
        cerrarMenusAbiertos();
    });
 
    // Modal — Nuevo sprint
    document.getElementById('btnNuevoSprint').addEventListener('click', abrirModalSprint);
    document.getElementById('btnCerrarModalSprint').addEventListener('click', cerrarModalSprint);
    document.getElementById('btnCancelarSprint').addEventListener('click', cerrarModalSprint);
    document.getElementById('btnGuardarSprint').addEventListener('click', guardarSprint);

    document.getElementById('modalSprintOverlay').addEventListener('click', function (e) {
        if (e.target === document.getElementById('modalSprintOverlay')) {
            cerrarModalSprint();
        }
    });

    // Modal — Nueva historia (sin argumentos = modo creación)
    document.getElementById('btnNuevaHistoria').addEventListener('click', function () { abrirModal(); });
    document.getElementById('btnNuevaHistoria2').addEventListener('click', function () { abrirModal(); });
    document.getElementById('btnAddStoryInline').addEventListener('click', function () { abrirModal(); });
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
    document.getElementById('btnGuardar').addEventListener('click', guardarHistoria);
 
    // Informe
    document.getElementById('btnInforme').addEventListener('click', function () {
        activarTab('informe');
    });
    document.getElementById('btnExportarInforme').addEventListener('click', function () {
        exportarInforme(historiasData, sprintData, sprintActivoId);
    });
 
    // Carga inicial — cargarHistorias primero para tener los datos,
    // luego cargarSprints que al terminar llama refrescarVistas con el filtro listo
    cargarHistorias();
    cargarSprints(false);
}
 
document.addEventListener('DOMContentLoaded', initApp);