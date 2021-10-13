import React, { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import styles from './SidebarApp.scss'

export const SidebarApp = observer(({ title, children, trigger }) => {
  const [height, setHeight] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  const contentRef = useRef(null)

  const className = classNames(styles.SidebarApp, {
    [styles.SidebarApp__isCollapsed]: collapsed,
  })

  const contentStyle = useMemo(() => {
    return {
      height: `${height}px`,
    }
  }, [height])

  useLayoutEffect(() => {
    if (contentRef.current != null) {
      setHeight(collapsed ? 0 : contentRef.current.clientHeight)
    }
  }, trigger && [trigger])

  return (
    <div className={className}>
      <div className={styles.SidebarApp_title} onClick={() => setCollapsed(!collapsed)}>
        {title}
      </div>
      <div className={styles.SidebarApp_content} style={contentStyle}>
        <div className={styles.SidebarApp_contentOpacity}>
          {children}
          <div ref={contentRef} className={styles.SidebarApp_contentClone}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
})
