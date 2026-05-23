const API_BASE = 'http://127.0.0.1:8000';
 
function getSprints() {
    return fetch(API_BASE + '/sprints')
        .then(function (res) {
            if (!res.ok) throw new Error('Error al cargar sprints');
            return res.json();
        });
}
 
function getHistorias() {
    return fetch(API_BASE + '/historias')
        .then(function (res) {
            if (!res.ok) throw new Error('Error al cargar historias');
            return res.json();
        });
}
 
function postHistoria(payload) {
    return fetch(API_BASE + '/historia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(function (res) {
        if (!res.ok) throw new Error('Error al crear historia');
        return res.json();
    });
}
 
function putHistoria(id, payload) {
    return fetch(API_BASE + '/historia/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(function (res) {
        if (!res.ok) throw new Error('Error al actualizar historia');
        return res.json();
    });
}
 
function deleteHistoria(id) {
    return fetch(API_BASE + '/historia/' + id, {
        method: 'DELETE'
    }).then(function (res) {
        if (!res.ok) throw new Error('Error al eliminar historia');
        return res.json();
    });
}