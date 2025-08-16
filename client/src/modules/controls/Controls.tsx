import React from 'react'
import { useCanvasStore } from '../store/store'
import { socket } from '../socket/socket'
import type { Rectangle } from '../types'

function randomColor() {
  const colors = ['#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#eab308', '#14b8a6']
  return colors[Math.floor(Math.random() * colors.length)]
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function Controls() {
  const add = useCanvasStore((s) => s.add)

  const handleAdd = () => {
    const id = crypto.randomUUID()
    const rect: Rectangle = {
      id,
      x: randomBetween(40, 200),
      y: randomBetween(40, 200),
      width: randomBetween(80, 140),
      height: randomBetween(60, 120),
      fill: randomColor(),
    }
    add(rect) // optimistic update
    socket.emit('rectangle:add', rect)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleAdd}
        className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 active:opacity-80 transition"
      >
        Add Rectangle
      </button>
      <p className="text-sm text-slate-600">Click to add rectangles, then drag them around.</p>
    </div>
  )
}
