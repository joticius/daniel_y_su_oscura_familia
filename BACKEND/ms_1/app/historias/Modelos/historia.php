<?php
namespace app\historias\Modelos;

use Illuminate\Database\Eloquent\Model;

class historia extends Model {

    protected $table = 'historias';
    protected $fillable = [
        'titulo',
        'descripcion',
        'responsable',
        'estado',
        'puntos',
        'fecha_creacion',
        'fecha_finalizacion',
        'sprint_id',
    ];
    public $timestamps = false;
}