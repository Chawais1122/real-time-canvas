import { io, Socket } from 'socket.io-client'

// Use .env if provided: VITE_SERVER_URL
const URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000'

// Singleton socket instance
export const socket: Socket = io(URL, {
  autoConnect: true,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
})
