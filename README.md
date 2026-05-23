# CamelloHub - Gestor de Historias de Usuario

Aplicación web para gestionar historias de usuario con un tablero Kanban integrado.

## Requisitos

- PHP 8.0+
- MySQL/MariaDB
- Composer (para instalar dependencias del backend)

## Instalación rápida

1. Clona el repositorio en tu máquina local
2. Navega a la carpeta del proyecto
3. Ejecuta el script de inicio:

**Windows (PowerShell/CMD):**
```bash
start-app.bat
```

**Linux/Mac:**
```bash
php -S localhost:3000 -t FRONTEND &
php -S localhost:9000 -t BACKEND/ms_1/Public BACKEND/ms_1/Public/router.php &
```

## Acceso

Una vez ejecutado el script:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:9000

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

## Notas de Desarrollo

- Todo el CSS está centralizado en `FRONTEND/Css/Estilos.css`
- Sin estilos inline (excluyen código limpio)
- API RESTful con endpoints en `/BACKEND/ms_1/app/*/Presentacion/Routers/Endpoints.php`
- CORS completamente habilitado para desarrollo local
