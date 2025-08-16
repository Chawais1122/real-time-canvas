# Real-time Canvas Application

This repository contains a **full-stack** real-time collaborative canvas that fulfills the assessment requirements:
- React + TypeScript + Tailwind on the client
- Zustand for state management
- React-Konva for the HTML5 canvas
- Socket.io for real-time communication
- Node.js + TypeScript Socket.io server

## Quick Start

### 1) Server
```bash
cd server
cp .env.example .env   # optional, tweak PORT or CORS_ORIGIN
npm install
npm run dev
```

The server starts at `http://localhost:4000` by default.

### 2) Client
In a new terminal:
```bash
cd client
cp .env.example .env   # optional, tweak VITE_SERVER_URL
npm install
npm run dev
```
The client runs at `http://localhost:5173` (strict port).

## How To Verify Real-time Behavior
- Open **two or more** browser tabs at `http://localhost:5173`.
- Click **Add Rectangle** in one tab — it appears immediately in all tabs.
- Drag any rectangle — positions update in all other tabs **live**.

## Architecture Notes

### Client
- **Zustand store** holds a dictionary of rectangles keyed by `id`.
- **Optimistic UI** for adding rectangles (UI updates immediately, then emits `rectangle:add`).
- **Drag** emits `rectangle:move` events (throttled) and updates local state.
- **Socket listeners** apply `initial_state`, `rectangle:added`, and `rectangle:moved` updates.

### Server
- Keeps an in-memory `Map` of rectangles for simple demo persistence.
- On connect, emits `initial_state` to the new client.
- Listens for `rectangle:add` and `rectangle:move` and broadcasts changes accordingly.

## Event Contract
- Client -> Server:
  - `rectangle:add`  — payload: full rectangle
  - `rectangle:move` — payload: `{ id, x, y }`
- Server -> Client:
  - `initial_state`    — payload: `Rectangle[]`
  - `rectangle:added`  — payload: full rectangle
  - `rectangle:moved`  — payload: `{ id, x, y }`

## Production Build
- Build the client: `cd client && npm run build`
- Build the server: `cd server && npm run build && npm start`

## Notes
- CORS is restricted to the client dev origin by default (`CORS_ORIGIN`).
- No database is used (assessment only requires real-time broadcast).

---
*Prepared to match the assessment’s technology and feature requirements.*
