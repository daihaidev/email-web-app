import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import classNames from 'classnames'

import { AlertBar } from 'components/AlertBar/AlertBar'
import { PrimaryNav } from 'components/PrimaryNav/PrimaryNav'
import { AppMenu } from 'components/AppMenu/AppMenu'
import { InboxTab } from 'components/InboxTab/InboxTab'
import { DevTab } from 'components/DevTab/DevTab'
import { action } from 'mobx'
import { ChatTab } from './ChatTab'
import { useSize } from './hooks/useSize'
import styles from './App.scss'

const onResizeViewport = action('resizeViewport', value => {
  app.viewport = value
})

export const AppContainer = observer(() => {
  const ref = useRef(null)
  const viewport = useSize(ref, {
    md: s => s.width >= 992,
    sm: s => s.width >= 768 && s.width < 992,
    xs: s => s.width < 768,
  })

  if (viewport) {
    const breakpoint = Object.keys(viewport.named).filter(key => viewport.named[key])
    onResizeViewport(breakpoint[0])
  }

  const renderApp = () => {
    if (!viewport) return null

    return (
      <div
        className={classNames(styles.App, `u${app.device.inputModeCapitalized}`, {
          uTouchOptimized: app.touchOptimized,
          uProduction: app.production,
          [styles.App__noAnimations]: !app.currentUser.preferences.animation,
        })}
      >
        <AlertBar />
        <AppMenu />
        <PrimaryNav />
        <div className={styles.App_content}>
          <InboxTab />
          <ChatTab />
          <DevTab />
        </div>
      </div>
    )
  }

  return <div ref={ref}>{renderApp()}</div>
})
