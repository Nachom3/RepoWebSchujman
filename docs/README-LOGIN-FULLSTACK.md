# Proyecto Login Fullstack

Aplicación de autenticación completa con frontend y backend:

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Base de datos: SQLite
- Autenticación: JWT

## Estructura del proyecto

- `frontend/`: interfaz de usuario (login, registro, dashboard privado)
- `backend/`: API de autenticación y conexión a base de datos

## Requisitos

- Node.js 18+
- npm 9+

## Variables de entorno

Crear el archivo `backend/.env` a partir de `backend/.env.example`.

Variables disponibles:

- `PORT`: puerto del backend (por defecto `5000`)
- `JWT_SECRET`: secreto para firmar tokens JWT

## Instalación

### 1. Instalar todas las dependencias

```bash
npm run install:all
```

O manualmente:

```bash
npm install
cd backend && npm install && cd ../frontend && npm install
```

## Levantar el proyecto

### Opción 1: Una sola terminal (recomendado)

```bash
npm run dev
```

Esto levanta backend y frontend en paralelo:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Opción 2: Terminales separadas

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## Flujo de uso

1. Ir a `/register` y crear una cuenta.
2. Ir a `/login` e iniciar sesión.
3. Acceder a `/dashboard` (ruta protegida).
4. Cerrar sesión con el botón "Cerrar sesión".

## Endpoints principales

Base URL:

- `http://localhost:5000/api/auth`

### POST `/register`

Body:

```json
{
  "email": "usuario@mail.com",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### POST `/login`

Body:

```json
{
  "email": "usuario@mail.com",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "usuario@mail.com"
  }
}
```

### GET `/me` (protegido)

Header requerido:

- `Authorization: Bearer <jwt>`

Respuesta exitosa:

```json
{
  "id": 1,
  "email": "usuario@mail.com"
}
```
