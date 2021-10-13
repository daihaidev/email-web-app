import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import styles from './Sidebar.scss'

export const Sidebar = observer(({ children }) => {
  const sideBarCss = classNames(styles.Sidebar, {
    [styles.Sidebar__hasAlert]: app.alertProvider.alert,
  })

  return (
    <div className={sideBarCss}>
      <div className={styles.Sidebar_scroll}>{children}</div>
    </div>
  )
})
