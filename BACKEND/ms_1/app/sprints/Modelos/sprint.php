<?php
namespace App\sprints\Modelos;

use Illuminate\Database\Eloquent\Model;

class sprint extends Model {

    protected $table = 'sprints';
    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_fin',
    ];
    public $timestamps = false;
}