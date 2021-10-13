import React, { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import styles from './ContentScroll.scss'

export const ContentScroll = observer(({ children, height, trigger }) => {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [scrollHeight, setScrollHeight] = useState(null)

  useEffect(() => {
    if (
      contentRef.current &&
      containerRef.current &&
      contentRef.current.offsetHeight > containerRef.current.offsetHeight
    ) {
      setScrollHeight(containerRef.current.offsetHeight)
    } else {
      setScrollHeight(null)
    }
  }, [trigger])

  const containerClass = classNames({
    [styles.ContentScroll__withScroll]: scrollHeight,
  })

  const scrollClass = classNames({
    [styles.ContentScroll_scroll__withScroll]: scrollHeight,
  })

  const applyHeight = scrollHeight ? { height: `${scrollHeight}px` } : null

  return (
    <div ref={containerRef} className={containerClass} style={{ maxHeight: `${height}px` }}>
      <div className={scrollClass} style={applyHeight}>
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  )
})
