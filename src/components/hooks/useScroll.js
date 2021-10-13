import { useState, useLayoutEffect } from 'react'

export const useScroll = ref => {
  const [scroll, setScroll] = useState(0)
  const [direction, setDirection] = useState(null)

  useLayoutEffect(() => {
    if (ref.current) {
      let prevPosition = ref.current.scrollTop
      const callback = () => {
        const currentPosition = ref.current.scrollTop
        const newDirection = prevPosition < currentPosition ? 'bottom' : 'top'
        setScroll(currentPosition)
        setDirection(newDirection)
        prevPosition = currentPosition
      }
      ref.current.addEventListener('scroll', callback)
      return () => ref.current.removeEventListener('scroll', callback)
    }
    return null
  }, [])

  return { scroll, direction }
}
