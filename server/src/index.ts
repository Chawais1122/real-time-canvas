import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

// ---------- Types ----------
type RectId = string;
export interface Rectangle {
  id: RectId;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

// In-memory store (simple demo persistence)
const rectangles = new Map<RectId, Rectangle>();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.get('/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN
  }
});

io.on('connection', (socket) => {
  console.log('[socket] client connected', socket.id);

  // Send current state to the newly connected client
  socket.emit('initial_state', Array.from(rectangles.values()));

  // rectangle:add -> broadcast new rectangle to all clients
  socket.on('rectangle:add', (rect: Rectangle) => {
    if (!rect || typeof rect.id !== 'string') return;
    rectangles.set(rect.id, rect);
    io.emit('rectangle:added', rect);
  });

  // rectangle:move -> broadcast to all *other* clients (not the mover)
  socket.on('rectangle:move', (payload: { id: RectId; x: number; y: number }) => {
    const { id, x, y } = payload || {};
    if (!id || typeof x !== 'number' || typeof y !== 'number') return;
    const existing = rectangles.get(id);
    if (existing) {
      existing.x = x;
      existing.y = y;
      rectangles.set(id, existing);
      socket.broadcast.emit('rectangle:moved', { id, x, y });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[socket] client disconnected', socket.id, reason);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
});
