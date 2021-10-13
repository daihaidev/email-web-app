import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import styles from './Avatar.scss'

export const Avatar = observer(({ model, size }) => {
  const avatarClass = classNames(styles.Avatar, styles[`Avatar__${size}`])

  if (!model) {
    // TODO don't have the right size icon yet
    return <Icon id='ticket_unassigned_m' className={styles.Avatar_unassignedIcon} />
  }

  const renderAvatar = () => {
    if (model) {
      if (model.avatar_url && model.avatar_url.length) {
        return <img src={model.avatar_url} className={styles.Avatar_img} alt='Avatar' />
      }

      if (model.first_name || model.last_name) {
        return <span>{`${model.first_name.charAt(0)}${(model.last_name || '').charAt(0)}`}</span>
      }
    }

    return <span>-</span>
  }

  return <div className={avatarClass}>{renderAvatar()}</div>
})

Avatar.Label = observer(props => {
  return (
    <div className={styles.Avatar_label}>
      <span>{props.children}</span>
    </div>
  )
})
