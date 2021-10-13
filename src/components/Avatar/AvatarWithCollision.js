import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Avatar } from './Avatar'
import styles from './AvatarWithCollision.scss'

export const AvatarWithCollision = observer(({ size, model, activity, animated }) => {
  const cssClass = classNames(styles.AvatarWithCollision, {
    [styles[`AvatarWithCollision__${size}`]]: size,
    [styles[`AvatarWithCollision__${activity}`]]: activity,
    [styles.AvatarWithCollision__isAnimated]: animated,
  })

  return (
    <div className={cssClass}>
      <Avatar model={model} size={size} />
      <div className={styles.AvatarWithCollision_activity} />
    </div>
  )
})
