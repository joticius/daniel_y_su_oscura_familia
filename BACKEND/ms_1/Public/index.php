<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../App/Configuration/DataCon.php';

// Middleware CORS
$cors = require __DIR__ . '/../Middlewars/CorsMiddlewar.php';

// Endpoints separados
$sprintsEndpoints   = require __DIR__ . '/../App/sprints/Presentacion/Routers/Endpoints.php';
$historiasEndpoints = require __DIR__ . '/../App/historias/Presentacion/Routers/Endpoints.php';

$app = AppFactory::create();

// Activar CORS
$cors($app);

// Cargar endpoints
$sprintsEndpoints($app);
$historiasEndpoints($app);

$app->run();
