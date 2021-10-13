import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import styles from './StatusSwitcher.scss'

const onChangeStatus = action('changeStatus', value => {
  app.currentUser.preferences.availableForChat = value
})

export const StatusSwitcher = observer(() => {
  const status = app.currentUser.preferences.availableForChat

  const blockCss = classNames(styles.StatusSwitcher, {
    [styles.StatusSwitcher_isOnline]: status,
  })

  const onlineCss = classNames(styles.StatusSwitcher_button, {
    [styles.StatusSwitcher_button__isActive]: status,
  })

  const offlineCss = classNames(styles.StatusSwitcher_button, {
    [styles.StatusSwitcher_button__isActive]: !status,
  })

  const changeStatusHandler = (e, value) => {
    e.stopPropagation()
    onChangeStatus(value)
  }

  return (
    <div className={blockCss}>
      <span role='button' className={onlineCss} onClick={e => changeStatusHandler(e, true)}>
        Online
      </span>
      <span role='button' className={offlineCss} onClick={e => changeStatusHandler(e, false)}>
        Offline
      </span>
    </div>
  )
})
