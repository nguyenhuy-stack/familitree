import { useState, useRef, useCallback, useEffect } from 'react'

export function useZoomPan(initialScale = 0.55) {
  const [view, setView] = useState({ scale: initialScale, x: 0, y: 0 })
  const isPanning = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Initial centering
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setView(v => ({ ...v, x: rect.width / 2, y: 100 }))
    }
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const zoomDir = e.deltaY > 0 ? -1 : 1
    const factor = 0.2 // Sensitivity increased for snappier zoom
    
    setView(prev => {
      const delta = zoomDir * factor * prev.scale
      const newScale = Math.min(2, Math.max(0.05, prev.scale + delta))
      const ratio = newScale / prev.scale

      return {
        scale: newScale,
        x: mouseX - (mouseX - prev.x) * ratio,
        y: mouseY - (mouseY - prev.y) * ratio
      }
    })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    isPanning.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y
    lastMouse.current = { x: e.clientX, y: e.clientY }
    setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }))
  }, [])

  const handleMouseUp = useCallback(() => { isPanning.current = false }, [])

  const zoomCenter = (dir: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    setView(prev => {
      const newScale = Math.min(2, Math.max(0.05, prev.scale + dir * 0.1 * prev.scale))
      const ratio = newScale / prev.scale
      return {
        scale: newScale,
        x: cx - (cx - prev.x) * ratio,
        y: cy - (cy - prev.y) * ratio
      }
    })
  }

  const zoomIn = () => zoomCenter(1)
  const zoomOut = () => zoomCenter(-1)
  const reset = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setView({ scale: initialScale, x: rect.width / 2, y: 100 })
    }
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  return { view, containerRef, handleMouseDown, handleMouseMove, handleMouseUp, zoomIn, zoomOut, reset }
}
