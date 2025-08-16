import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useCanvasStore } from '../store/store'
import { socket } from '../socket/socket'
import type { Rectangle } from '../types'
import { throttle } from '../utils/throttle'

// Canvas dimensions are responsive; we keep container width in state
export function CanvasStage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const rectangles = useCanvasStore((s) => s.rectangles)
  const updatePosition = useCanvasStore((s) => s.updatePosition)
  const setAll = useCanvasStore((s) => s.setAll)
  const add = useCanvasStore((s) => s.add)

  // Resize observer for responsive canvas
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      setSize({ width: rect.width, height: Math.max(460, rect.height) })
    })
    ro.observe(el)
    const rect = el.getBoundingClientRect()
    setSize({ width: rect.width, height: Math.max(460, rect.height) })
    return () => ro.disconnect()
  }, [])

  // Socket listeners
  useEffect(() => {
    function onInitialState(payload: Rectangle[]) {
      setAll(payload)
    }
    function onAdded(rect: Rectangle) {
      add(rect)
    }
    function onMoved(payload: { id: string; x: number; y: number }) {
      updatePosition(payload.id, payload.x, payload.y)
    }

    socket.on('initial_state', onInitialState)
    socket.on('rectangle:added', onAdded)
    socket.on('rectangle:moved', onMoved)
    return () => {
      socket.off('initial_state', onInitialState)
      socket.off('rectangle:added', onAdded)
      socket.off('rectangle:moved', onMoved)
    }
  }, [setAll, add, updatePosition])

  const handleDragMove = throttle((e: any, id: string) => {
    const node = e.target
    const x = node.x()
    const y = node.y()
    updatePosition(id, x, y)
    socket.emit('rectangle:move', { id, x, y })
  }, 50)

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage width={size.width} height={size.height} className="bg-slate-100 rounded-xl">
        <Layer>
          {Object.values(rectangles).map((r) => (
            <Rect
              key={r.id}
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              fill={r.fill}
              cornerRadius={8}
              draggable
              shadowBlur={2}
              shadowOpacity={0.3}
              onDragMove={(e) => handleDragMove(e, r.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
