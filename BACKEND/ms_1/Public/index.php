<?php
use Slim\Factory\AppFactory;
use App\sprints\Modelos\sprint;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../App/Configuration/DataCon.php';

function seedDefaultSprints()
{
    $existing = sprint::pluck('nombre')->toArray();
    $defaults = [
        ['nombre' => 'Sprint 1', 'fecha_inicio' => '2026-05-01', 'fecha_fin' => '2026-05-15'],
        ['nombre' => 'Sprint 2', 'fecha_inicio' => '2026-05-16', 'fecha_fin' => '2026-05-31'],
        ['nombre' => 'Sprint 3', 'fecha_inicio' => '2026-06-01', 'fecha_fin' => '2026-06-15'],
    ];

    foreach ($defaults as $sprintData) {
        if (!in_array($sprintData['nombre'], $existing, true)) {
            sprint::create($sprintData);
        }
    }
}

$cors = require __DIR__ . '/../Middlewars/CorsMiddlewar.php';

// Endpoints separados
$sprintsEndpoints   = require __DIR__ . '/../App/sprints/Presentacion/Routers/Endpoints.php';
$historiasEndpoints = require __DIR__ . '/../App/historias/Presentacion/Routers/Endpoints.php';

$app = AppFactory::create();

seedDefaultSprints();

// Activar CORS
$cors($app);

// Cargar endpoints
$sprintsEndpoints($app);
$historiasEndpoints($app);

$app->run();
