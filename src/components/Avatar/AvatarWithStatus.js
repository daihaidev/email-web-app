import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { Avatar } from './Avatar'
import styles from './AvatarWithStatus.scss'

export const AvatarWithStatus = observer(({ size, model, button }) => {
  const cssClass = classNames(styles.AvatarWithStatus, styles[`AvatarWithStatus__${size}`], {
    [styles.AvatarWithStatus__isActive]: app.currentUser.preferences.availableForChat,
    [styles.AvatarWithStatus__isButton]: button,
  })

  return (
    <div className={cssClass}>
      <div className={styles.AvatarWithStatus_avatar}>
        <Avatar model={model} size={size} />
      </div>
      <div className={styles.AvatarWithStatus_status} />
    </div>
  )
})
