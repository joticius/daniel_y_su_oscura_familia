<?php

use Slim\App;
use App\historias\Presentacion\Repositorios\historiasRepositorio;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    // Endpoints directos
    $app->post('/historia', [historiasRepositorio::class, 'createhistoria']);
    $app->get('/historias', [historiasRepositorio::class, 'allhistoria']);
    $app->get('/historia/{id}', [historiasRepositorio::class, 'detailhistoria']);
    $app->put('/historia/{id}', [historiasRepositorio::class, 'updatehistoria']);
    $app->delete('/historia/{id}', [historiasRepositorio::class, 'deletehistoria']);
};
