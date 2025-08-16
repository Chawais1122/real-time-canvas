import { create } from 'zustand'
import type { Rectangle, RectId } from '../types'

interface CanvasState {
  rectangles: Record<RectId, Rectangle>
  setAll: (rects: Rectangle[]) => void
  add: (rect: Rectangle) => void
  updatePosition: (id: RectId, x: number, y: number) => void
  reset: () => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  rectangles: {},
  setAll: (rects) => set(() => ({
    rectangles: rects.reduce((acc, r) => { acc[r.id] = r; return acc }, {} as Record<RectId, Rectangle>)
  })),
  add: (rect) => set((s) => ({
    rectangles: { ...s.rectangles, [rect.id]: rect }
  })),
  updatePosition: (id, x, y) => set((s) => {
    const target = s.rectangles[id]
    if (!target) return s
    return { rectangles: { ...s.rectangles, [id]: { ...target, x, y } } }
  }),
  reset: () => set({ rectangles: {} })
}))
