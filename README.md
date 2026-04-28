# TP 6 - PROG4

Proyecto basado en TP5 y adaptado al TP6 (React Router + CRUD multipantalla).

## Estructura

- `backend/` API Node.js + Express + PostgreSQL
- `frontend/` React + TypeScript + React Router

## Requisitos (modo local)

- PostgreSQL instalado
- Node.js instalado

## Base de datos

Crear una base con:

- Nombre: `practico6`
- Usuario: `postgres`
- Password: `postgres` (o el que configures)

Si tus credenciales son distintas, copiar `backend/.env.example` a `backend/.env` y ajustar.

## Backend

```bash
cd backend
npm install
npm run dev
```

Backend local: `http://localhost:8080`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local: `http://localhost:5173`

## Rutas TP6 (frontend)

- `/` listado de participantes
- `/nuevo` alta de participante
- `/editar/:id` edicion de participante
