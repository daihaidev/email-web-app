import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import classNames from 'classnames'

import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { AvatarWithCollision } from 'components/Avatar/AvatarWithCollision'
import styles from './TicketColliders.scss'

export const TicketColliders = observer(() => {
  const { colliders } = app.ui.inboxTab.ticket

  if ((colliders || []).length === 0) return null

  const collidersToUsers = colliders.map(collider => {
    const user = app.users.find(x => x.id === collider.user_id)
    return {
      ...collider,
      ...user,
    }
  })

  const limit = 3
  const condition = collidersToUsers.length > limit
  const className = classNames(styles.TicketColliders, {
    [styles.TicketColliders__withDropDown]: condition,
  })
  const usersToRender = condition ? collidersToUsers.slice(0, 2) : collidersToUsers

  const renderDropDownItem = user => {
    const textMapping = {
      note: 'is writing a note',
      reply: 'is writing a reply',
      view: 'is viewing',
    }

    return (
      <DropdownItem key={user.id} customClass={styles.TicketColliders_dropDownItem}>
        <AvatarWithCollision model={user} size='xsmall' activity={user.activity} />
        <div className={styles.TicketColliders_dropDownText}>
          {`${user.firstName} ${user.lastName} ${textMapping[user.activity]}`}
        </div>
      </DropdownItem>
    )
  }

  const renderMoreButton = () => (
    <button type='button' className={styles.TicketColliders_more}>{`+${collidersToUsers.length - (limit - 1)}`}</button>
  )

  const renderUsersList = () => (
    <div className={className}>
      {usersToRender.map(user => (
        <div className={styles.TicketColliders_item} key={user.id}>
          <AvatarWithCollision animated model={user} size='small' activity={user.activity} />
        </div>
      ))}
      {condition && renderMoreButton()}
    </div>
  )

  const renderUsersListWithDropDown = () => (
    <Dropdown position='bottomRight' trigger={() => renderUsersList()}>
      <DropdownItemsList>{collidersToUsers.map(renderDropDownItem)}</DropdownItemsList>
    </Dropdown>
  )

  return condition ? renderUsersListWithDropDown() : renderUsersList()
})
