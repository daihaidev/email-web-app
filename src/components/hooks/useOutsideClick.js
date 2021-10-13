import { useEffect } from 'react'

export const useOutsideClick = (ref, callback, enabled) => {
  useEffect(() => {
    if (enabled) {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }
        callback(event)
      }

      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener, { passive: true })

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener, { passive: true })
      }
    }
    return undefined
  }, [enabled])
}
