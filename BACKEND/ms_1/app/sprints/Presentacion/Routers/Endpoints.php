<?php

use Slim\App;
use App\sprints\Presentacion\Repositorios\sprintsRepositorio;

return function (App $app) {
    $app->post('/sprint', [sprintsRepositorio::class, 'createsprint']);
    $app->get('/sprints', [sprintsRepositorio::class, 'allsprint']);
    $app->get('/sprint/{id}', [sprintsRepositorio::class, 'detailsprint']);
    $app->put('/sprint/{id}', [sprintsRepositorio::class, 'updatesprint']);
    $app->delete('/sprint/{id}', [sprintsRepositorio::class, 'deletesprint']);
};