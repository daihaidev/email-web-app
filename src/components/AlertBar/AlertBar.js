import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import styles from './AlertBar.scss'

export const AlertBar = observer(() => {
  if (!app.alertProvider.alert) {
    return null
  }

  const className = classNames(styles.AlertBar, {
    [styles[`AlertBar__${app.alertProvider.alert.type}`]]: true,
  })

  const createMessage = () => ({ __html: app.alertProvider.alert.message })

  return (
    <>
      {alert && (
        <div className={className}>
          <div dangerouslySetInnerHTML={createMessage()} />
        </div>
      )}
    </>
  )
})
