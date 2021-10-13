import { useLayoutEffect, useState } from 'react'

import { app } from 'app'

export const useSize = (ref, namedSizes) => {
  const [size, setSize] = useState(null)

  useLayoutEffect(() => {
    if (ref.current != null) {
      setSize(app.device.resizeObserver.observe(ref.current, namedSizes))
      return () => app.device.resizeObserver.unobserve(ref.current)
    }
    return undefined
  }, [])

  return size
}
