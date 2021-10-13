import React from 'react'
import { observer } from 'mobx-react'

import styles from 'components/User.scss'
import { Avatar } from 'components/Avatar/Avatar'

export const User = observer(({ model, size }) => {
  return (
    <div className={styles.User}>
      <Avatar model={model} size={size} />{' '}
      <Avatar.Label>
        {model.first_name} {model.last_name}
      </Avatar.Label>
    </div>
  )
})
