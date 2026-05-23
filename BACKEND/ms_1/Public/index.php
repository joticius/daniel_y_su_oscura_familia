<?php
use Slim\Factory\AppFactory;
use App\sprints\Modelos\sprint;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../App/Configuration/DataCon.php';

$cors = require __DIR__ . '/../Middlewars/CorsMiddlewar.php';

$sprintsEndpoints   = require __DIR__ . '/../App/sprints/Presentacion/Routers/Endpoints.php';
$historiasEndpoints = require __DIR__ . '/../App/historias/Presentacion/Routers/Endpoints.php';

$app = AppFactory::create();

$cors($app);

$sprintsEndpoints($app);
$historiasEndpoints($app);

$app->run();
