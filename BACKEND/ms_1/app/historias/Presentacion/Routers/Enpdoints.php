<?php

use Slim\App;
use App\historias\Presentacion\Repositorios\historiasRepositorio;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    // Endpoints directos
    $app->post('/historia', [HistoriaRepository::class, 'createhistoria']);
    $app->get('/historias', [HistoriaRepository::class, 'allhistoria']);
    $app->get('/historia/{id}', [HistoriaRepository::class, 'detailhistoria']);
    $app->put('/historia/{id}', [HistoriaRepository::class, 'updatehistoria']);
    $app->delete('/historia/{id}', [HistoriaRepository::class, 'deletehistoria']);
};
