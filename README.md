# CamelloHub - Gestor de Historias de Usuario

Aplicación web para gestionar historias de usuario con un tablero Kanban integrado.

## Requisitos

- PHP 8.0+
- MySQL/MariaDB
- Composer (para instalar dependencias del backend)

## Instalación rápida

1. Clona el repositorio en tu máquina local
2. Navega a la carpeta del proyecto
ejecite esto en cmd del proyecto: php -S 127.0.0.1:8000 -t BACKEND/ms_1/Public BACKEND/ms_1/Public/index.php
3. Ejecuta el script de inicio:


## Estructura del Proyecto

```
/
├── FRONTEND/              # Frontend estático (HTML, CSS, JS)
│   ├── Index.html
│   ├── Css/
│   │   └── Estilos.css
│   └── Js/
│       └── App.js
├── BACKEND/
│   └── ms_1/
│       ├── app/           # Lógica de la aplicación
│       ├── Public/        # Punto de entrada (index.php)
│       ├── vendor/        # Dependencias de Composer
│       ├── Middlewares/   # CORS y middlewares
│       └── DataBase.sql   # Script de base de datos
└── start-app.bat          # Script para iniciar ambos servidores
```

## Base de datos

La base de datos se crea automáticamente en la primera solicitud. Los datos incluyen:
- 3 Sprints predefinidos (Sprint 1, 2, 3)
- Tabla de Historias de Usuario

## Características

- ✅ Dashboard con métricas en tiempo real
- ✅ Tablero Kanban con columnas de estado
- ✅ Crear, editar y eliminar historias
- ✅ Gestión de sprints
- ✅ Respuesta API RESTful con CORS habilitado
- ✅ Interfaz limpia y responsiva

## Stack Tecnológico

**Frontend:**
- HTML5 + CSS3 (sin frameworks)
- JavaScript Vanilla (ES6+)

**Backend:**
- PHP 8.2
- Slim 4 (microframework)
- Illuminate Database (Eloquent ORM)
- MySQL

