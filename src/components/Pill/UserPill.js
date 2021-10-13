import React from 'react'
import { observer } from 'mobx-react'

import { Avatar } from 'components/Avatar/Avatar'
import styles from './UserPill.scss'

export const UserPill = observer(({ model, size = 'xsmall', unassigned }) => {
  const renderName = () => (unassigned ? 'Unassigned' : `${model.first_name} ${model.last_name}`)
  // const renderAvatar = () =>
  //   unassigned ? (
  //     <div className={styles.UserPill_unassigned}>
  //       <Icon id='unassigned' className={styles.UserPill_unassignedIcon} />
  //     </div>
  //   ) : (
  //     <Avatar size={size} model={model} />
  //   )

  return (
    <div className={styles.UserPill}>
      <Avatar size={size} model={model} />
      <div className={styles.UserPill_name}>{renderName()}</div>
    </div>
  )
})
