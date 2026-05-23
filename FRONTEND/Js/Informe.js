function calcularMetricas(historias) {
    const total        = historias.length;
    const finalizadas  = historias.filter(function (h) { return h.estado === 'finalizada'; }).length;
    const bloqueadas   = historias.filter(function (h) { return h.estado === 'impedimento'; }).length;
    const pendientes   = historias.filter(function (h) { return h.estado === 'nueva' || h.estado === 'activa'; }).length;
    const puntosTotal  = historias.reduce(function (sum, h) { return sum + Number(h.puntos); }, 0);
    const puntosCompletados = historias
        .filter(function (h) { return h.estado === 'finalizada'; })
        .reduce(function (sum, h) { return sum + Number(h.puntos); }, 0);
    const porcentaje   = total > 0 ? Math.round((finalizadas / total) * 100) : 0;
 
    return { total, finalizadas, bloqueadas, pendientes, puntosTotal, puntosCompletados, porcentaje };
}
 
function calcularProgresoPorResponsable(historias) {
    const mapa = {};
 
    historias.forEach(function (h) {
        if (!mapa[h.responsable]) {
            mapa[h.responsable] = { total: 0, finalizadas: 0, bloqueadas: 0, puntos: 0 };
        }
        mapa[h.responsable].total++;
        if (h.estado === 'finalizada') {
            mapa[h.responsable].finalizadas++;
            mapa[h.responsable].puntos += Number(h.puntos);
        }
        if (h.estado === 'impedimento') {
            mapa[h.responsable].bloqueadas++;
        }
    });
 
    // Convertir a array ordenado por nombre
    return Object.keys(mapa).sort().map(function (nombre) {
        const datos = mapa[nombre];
        const porcentaje = datos.total > 0 ? Math.round((datos.finalizadas / datos.total) * 100) : 0;
        return { nombre, porcentaje, ...datos };
    });
}
 
function obtenerDetaImpedimentos(historias) {
    const bloqueadas = historias.filter(function (h) { return h.estado === 'impedimento'; });
    if (bloqueadas.length === 0) return 'Sin impedimentos';
    if (bloqueadas.length === 1) return bloqueadas[0].titulo + ' · ' + bloqueadas[0].responsable;
    return bloqueadas.length + ' historias bloqueadas';
}
 
// ── Generación de PDF ──────────────────────────────────────
 
function pdfEscape(text) {
    return String(text)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\r/g, ' ')
        .replace(/\n/g, ' ');
}
 
function construirPDF(titulo, lineas) {
    const bodyLines = [];
    bodyLines.push('BT');
    bodyLines.push('/F1 12 Tf');
    bodyLines.push('50 760 Td');
    bodyLines.push('(' + pdfEscape(titulo) + ') Tj');
    bodyLines.push('0 -20 Td');
 
    lineas.forEach(function (linea, index) {
        if (index > 0) bodyLines.push('0 -16 Td');
        bodyLines.push('(' + pdfEscape(linea) + ') Tj');
    });
 
    bodyLines.push('ET');
    const body = bodyLines.join('\n') + '\n';
    const streamLength = new TextEncoder().encode(body).length;
 
    const header = '%PDF-1.3\n';
    const obj1   = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
    const obj2   = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
    const obj3   = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n';
    const obj4   = '4 0 obj\n<< /Length ' + streamLength + ' >>\nstream\n' + body + 'endstream\nendobj\n';
    const obj5   = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
 
    let pdf = header;
    const encoder = new TextEncoder();
    const offsets = [0];
    let cursor = encoder.encode(pdf).length;
 
    [obj1, obj2, obj3, obj4, obj5].forEach(function (obj) {
        offsets.push(cursor);
        pdf += obj;
        cursor += encoder.encode(obj).length;
    });
 
    const xrefStart = cursor;
    let xref = 'xref\n0 6\n0000000000 65535 f \n';
    for (let i = 1; i <= 5; i++) {
        xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
 
    const trailer = 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF';
    return pdf + xref + trailer;
}
 
function exportarInforme(historiasData, sprintData, sprintActivoId) {
    if (!historiasData || historiasData.length === 0) {
        alert('No hay datos de historias para exportar.');
        return;
    }
 
    const metricas   = calcularMetricas(historiasData);
    const responsables = calcularProgresoPorResponsable(historiasData);
    const sprintActivo = sprintData.find(function (s) { return s.id === sprintActivoId; });
    const nombreSprint = sprintActivo ? sprintActivo.nombre : 'Sprint';
 
    const lineas = [
        'Sprint: ' + nombreSprint,
        '─────────────────────────────',
        'Total historias:        ' + metricas.total,
        'Historias finalizadas:  ' + metricas.finalizadas + ' (' + metricas.porcentaje + '%)',
        'Historias en impedimento: ' + metricas.bloqueadas,
        'Historias pendientes:   ' + metricas.pendientes,
        'Puntos completados:     ' + metricas.puntosCompletados + ' de ' + metricas.puntosTotal,
        '',
        'Progreso por responsable:',
        '─────────────────────────────'
    ];
 
    responsables.forEach(function (r) {
        lineas.push(r.nombre + ': ' + r.finalizadas + '/' + r.total + ' historias · ' + r.puntos + ' pts (' + r.porcentaje + '%)');
    });
 
    lineas.push('');
    lineas.push('Listado de historias:');
    lineas.push('─────────────────────────────');
 
    historiasData.forEach(function (h) {
        const sprint = sprintData.find(function (s) { return s.id === h.sprint_id; });
        const nombreSprintH = sprint ? sprint.nombre : 'Sprint ' + h.sprint_id;
        lineas.push(h.titulo + ' | ' + h.responsable + ' | ' + h.puntos + ' pts | ' + h.estado + ' | ' + nombreSprintH);
    });
 
    const pdf = construirPDF('Informe ' + nombreSprint + ' — CamelloHub', lineas);
 
    const blob   = new Blob([pdf], { type: 'application/pdf' });
    const url    = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href     = url;
    enlace.download = 'informe-' + nombreSprint.toLowerCase().replace(' ', '-') + '.pdf';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}