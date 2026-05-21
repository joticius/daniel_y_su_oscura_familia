<?php

use Slim\App;
use App\sprints\Presentacion\Repositorios\sprintRepositorio;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    // Endpoints directos
    $app->post('/sprint', [SprintRepository::class, 'createsprint']);
    $app->get('/sprints', [SprintRepository::class, 'allsprint']);
    $app->get('/sprint/{id}', [SprintRepository::class, 'detailsprint']);
    $app->put('/sprint/{id}', [SprintRepository::class, 'updatesprint']);
    $app->delete('/sprint/{id}', [SprintRepository::class, 'deletesprint']);

};