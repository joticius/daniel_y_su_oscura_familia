<?php
namespace App\sprints\Controladores;

use App\sprints\Modelos\sprint;
use Exception;

class SprintController {

    // Crear un nuevo sprint
    public function crearsprint($data) {
        try {
            $sprint = new sprint();
            $sprint->nombre = $data['nombre'];
            $sprint->fecha_inicio = $data['fecha_inicio'];
            $sprint->fecha_fin = $data['fecha_fin'];
            $sprint->save();
            return $sprint->toJson();
        } catch (Exception $e) {
            return json_encode(['error' => $e->getMessage()]);
        }
    }

    // Obtener todos los sprints
    public function obtenerSprints() {
        return sprint::all()->toJson();
    }

    // Obtener un sprint por ID
    public function obtenersprint($id) {
        $sprint = sprint::find($id);
        return $sprint ? $sprint->toJson() : json_encode(['error' => 'Sprint no encontrado']);
    }

    // Modificar un sprint existente
    public function modificarsprint($id, $data) {
        $sprint = sprint::find($id);
        if (!$sprint) return json_encode(['error' => 'Sprint no encontrado']);

        $sprint->fill($data);
        $sprint->save();

        return $sprint->toJson();
    }

    // Eliminar un sprint
    public function eliminarSprint($id) {
        $sprint = sprint::find($id);
        if (!$sprint) return json_encode(['error' => 'Sprint no encontrado']);

        $sprint->delete();
        return json_encode(['success' => 'Sprint eliminado']);
    }
}
