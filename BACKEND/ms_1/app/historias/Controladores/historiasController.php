<?php
namespace App\historias\Controladores;

use App\historias\Modelos\historia;
use Exception;

class historiasController {

    function gethistorias(){
        $rows = historia::all();
        return $rows->toJson();
    }
    
    function guardarhistoria($data){
        try {
            $historia = new historia();
            $historia->titulo = $data['titulo'];
            $historia->descripcion = $data['descripcion'];
            $historia->responsable = $data['responsable'];
            $historia->estado = $data['estado'] ?? 'nueva';
            $historia->puntos = $data['puntos'];
            $historia->fecha_creacion = $data['fecha_creacion'];
            $historia->fecha_finalizacion = $data['fecha_finalizacion'] ?? null;
            $historia->sprint_id = $data['sprint_id'];
            $historia->save();
            return $historia->toJson();
        } catch (Exception $e) {
            return json_encode(['error' => $e->getMessage()]);
        }
    }

    public function mostarhistoria($id) {
        $historia = historia::find($id);
        return $historia ? $historia->toJson() : json_encode(['error' => 'No encontrada']);
    }

    public function modificarhistoria($id, $data) {
        $historia = historia::find($id);
        if (!$historia) return json_encode(['error' => 'No encontrada']);
        $historia->fill($data);
        $historia->save();
        return $historia->toJson();
    }

    public function eliminarhistoria($id) {
        $historia = historia::find($id);
        if (!$historia) return json_encode(['error' => 'No encontrada']);
        $historia->delete();
        return json_encode(['success' => 'Historia eliminada']);
    }
}