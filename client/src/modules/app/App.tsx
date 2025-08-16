import React from 'react'
import { CanvasStage } from '../canvas/CanvasStage'
import { Controls } from '../controls/Controls'
import { ConnectionStatus } from '../status/ConnectionStatus'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Real-time Canvas</h1>
          <ConnectionStatus />
        </div>
      </header>

      <main className="mx-auto max-w-6xl w-full px-4 py-6 flex-1 flex flex-col gap-4">
        <Controls />
        <div className="rounded-2xl border bg-white shadow-sm p-3 flex-1 min-h-[480px]">
          <CanvasStage />
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4">
        Built with React, Tailwind, Zustand, React-Konva, and Socket.io
      </footer>
    </div>
  )
}
