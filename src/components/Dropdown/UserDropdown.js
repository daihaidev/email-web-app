import React from 'react'
import { observer } from 'mobx-react'

import { UserPill } from 'components/Pill/UserPill'
import { app } from 'app'
import { DropdownItemsList } from './DropdownItemsList'
import { DropdownItem } from './DropdownItem'

export const UserDropdown = observer(({ onClick, inboxId, inModal }) => {
  return (
    <DropdownItemsList fullWidth={inModal}>
      {app.users.map(user =>
        !inboxId || user.group_ids.includes(inboxId) ? (
          <DropdownItem key={user.id} onClick={() => onClick(user.id)}>
            <UserPill model={user} size='xxsmall' />
          </DropdownItem>
        ) : null
      )}
      <DropdownItem key='unassigned' onClick={() => onClick('')}>
        <UserPill unassigned size='xxsmall' />
      </DropdownItem>
    </DropdownItemsList>
  )
})
