<?php

namespace App\sprints\Presentacion\Repositorios;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\sprints\Controladores\sprintsController;
use Exception;

class sprintsRepositorio
{
    function allsprint(Request $request, Response $response)
    {
        $controller = new sprintsController();
        $sprints = $controller->obtenerSprints();
        $response->getBody()->write($sprints);
        return $response->withHeader("Content-Type", "application/json");
    }

    function createsprint(Request $request, Response $response)
    {
        $data = json_decode($request->getBody()->getContents(), true);
        $controller = new sprintsController();
        $sprint = $controller->crearsprint($data);
        $response->getBody()->write($sprint);
        return $response->withStatus(201)->withHeader("Content-Type", "application/json");
    }

    function detailsprint(Request $req, Response $resp, $args)
    {
        try {
            $id = $args['id'];
            $controller = new sprintsController();
            $sprint = $controller->obtenerSprint($id);
            $resp->getBody()->write($sprint);
            return $resp->withHeader("Content-Type", "application/json");
        } catch (Exception $ex) {
            $resp->getBody()->write("Error: " . $ex->getMessage());
            return $resp->withStatus(400);
        }
    }

    function updatesprint(Request $req, Response $resp, $args)
    {
        try {
            $id = $args['id'];
            $data = json_decode($req->getBody()->getContents(), true);
            $controller = new sprintsController();
            $sprint = $controller->modificarsprint($id, $data);
            $resp->getBody()->write($sprint);
            return $resp->withStatus(200)->withHeader("Content-Type", "application/json");
        } catch (Exception $ex) {
            $resp->getBody()->write("Error: " . $ex->getMessage());
            return $resp->withStatus(400);
        }
    }

    function deletesprint(Request $req, Response $resp, $args)
    {
        try {
            $id = $args['id'];
            $controller = new sprintsController();
            $controller->eliminarSprint($id);
            $resp->getBody()->write(json_encode(['msg' => 'Sprint eliminado']));
            return $resp->withStatus(200)->withHeader("Content-Type", "application/json");
        } catch (Exception $ex) {
            $resp->getBody()->write("Error: " . $ex->getMessage());
            return $resp->withStatus(400);
        }
    }
}
