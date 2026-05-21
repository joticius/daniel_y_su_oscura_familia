// ============================================================
// GESTOR DE HISTORIAS DE USUARIO — App.js
// Navegación de tabs, modal y dropdown de sprint
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // --- NAVEGACIÓN POR TABS -----------------------------------
    var tabs = document.querySelectorAll('.tab');
    var screens = document.querySelectorAll('.screen');

    function activarTab(tabId) {
        tabs.forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        screens.forEach(function (s) {
            s.classList.toggle('active', s.id === 'screen-' + tabId);
        });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            activarTab(tab.dataset.tab);
        });
    });

    // Elementos del dashboard que navegan a otra pantalla
    document.querySelectorAll('[data-tab-target]').forEach(function (el) {
        el.addEventListener('click', function () {
            activarTab(el.dataset.tabTarget);
        });
    });

    // --- SPRINT SELECTOR DROPDOWN ------------------------------
    var sprintSelector = document.getElementById('sprintSelector');
    var sprintLabel    = document.getElementById('sprintLabel');
    var sprintOptions  = document.querySelectorAll('.sprint-option');

    sprintSelector.addEventListener('click', function (e) {
        e.stopPropagation();
        sprintSelector.classList.toggle('open');
    });

    sprintOptions.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.stopPropagation();
            sprintOptions.forEach(function (o) { o.classList.remove('active'); });
            opt.classList.add('active');
            sprintLabel.textContent = 'Sprint ' + opt.dataset.sprint;
            sprintSelector.classList.remove('open');
        });
    });

    document.addEventListener('click', function () {
        sprintSelector.classList.remove('open');
    });

    // --- MODAL: NUEVA HISTORIA ---------------------------------
    var modalOverlay = document.getElementById('modalOverlay');

    function abrirModal() {
        modalOverlay.classList.add('open');
    }

    function cerrarModal() {
        modalOverlay.classList.remove('open');
    }

    // Botones que abren el modal
    document.getElementById('btnNuevaHistoria').addEventListener('click', abrirModal);
    document.getElementById('btnNuevaHistoria2').addEventListener('click', abrirModal);
    document.getElementById('btnAddStoryInline').addEventListener('click', abrirModal);

    // Botones que cierran el modal
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);

    // Cerrar al hacer clic en el overlay (fondo oscuro)
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });

    // Botón guardar (solo cierra el modal en esta versión frontend)
    document.getElementById('btnGuardar').addEventListener('click', function () {
        var titulo = document.getElementById('inputTitulo').value.trim();
        if (!titulo) {
            document.getElementById('inputTitulo').focus();
            return;
        }
        cerrarModal();
        // Aquí iría la llamada al microservicio REST del backend
        // fetch('/api/historias', { method: 'POST', body: JSON.stringify({...}) })
    });

    // --- BOTÓN INFORME (topbar) --------------------------------
    document.getElementById('btnInforme').addEventListener('click', function () {
        activarTab('informe');
    });

});
