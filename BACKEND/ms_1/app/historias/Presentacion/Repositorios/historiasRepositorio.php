<?php

namespace App\historias\Presentacion\Repositorios;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Historias\Controladores\historiasController;
use Exception;

class historiasRepositorio
{
    function allhistoria(Request $request, Response $response)
    {
        $controller = new historiasController();
        $historias = $controller->getHistorias();
        $response->getBody()->write($historias);
        return $response->withHeader("Content-Type", "application/json");
    }

    function createhistoria(Request $request, Response $response)
    {
        $data = json_decode($request->getBody()->getContents(), true);
        $controller = new historiasController();
        $historia = $controller->guardarHistoria($data);
        $response->getBody()->write($historia);
        return $response->withStatus(201)->withHeader("Content-Type", "application/json");
    }

    function detailhistoria(Request $req, Response $resp, $args)
    {
        try {
            $id = $args['id'];
            $controller = new historiasController();
            $historia = $controller->mostarhistoria($id);
            $resp->getBody()->write($historia);
            return $resp->withHeader("Content-Type", "application/json");
        } catch (Exception $ex) {
            $resp->getBody()->write("Error: " . $ex->getMessage());
            return $resp->withStatus(400);
        }
    }

    function updatehistoria(Request $req, Response $resp, $args)
    {
        try {
            $id = $args['id'];
            $data = json_decode($req->getBody()->getContents(), true);
            $controller = new historiasController();
            $historia = $controller->modificarhistoria($id, $data);
            $resp->getBody()->write($historia);
            return $resp->withStatus(200)->withHeader("Content-Type", "application/json");
        } catch (Exception $ex) {
            $resp->getBody()->write("Error: " . $ex->getMessage());
            return $resp->withStatus(400);
        }
    }

    function deletehistoria(Request $req, Response $resp, $args)
    {
        try {
            $id = $args['id'];
            $controller = new historiasController();
            $controller->eliminarhistoria($id);
            $resp->getBody()->write(json_encode(['msg' => 'Historia eliminada']));
            return $resp->withStatus(200)->withHeader("Content-Type", "application/json");
        } catch (Exception $ex) {
            $resp->getBody()->write("Error: " . $ex->getMessage());
            return $resp->withStatus(400);
        }
    }
}
