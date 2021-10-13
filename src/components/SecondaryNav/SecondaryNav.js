import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { AvatarWithStatus } from 'components/Avatar/AvatarWithStatus'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { DropdownDivider } from 'components/Dropdown/DropdownDivider'
import { StatusSwitcher } from './StatusSwitcher'
import styles from './SecondaryNav.scss'

export const SecondaryNav = observer(() => {
  return (
    <div className={styles.SecondaryNav}>
      <div className={styles.SecondaryNav_notifications}>
        <ButtonWithIcon iconId='ui_notification_m' />
      </div>
      <Dropdown position='bottomRight' trigger={() => <AvatarWithStatus button size='small' model={app.currentUser} />}>
        <DropdownItemsList noScroll>
          <DropdownItem customClass={styles.SecondaryNav_status}>
            <StatusSwitcher />
          </DropdownItem>
          <DropdownItem text>Profile</DropdownItem>
          <DropdownItem text>Preferences</DropdownItem>
          <DropdownItem text>Security</DropdownItem>
          <DropdownItem text>Notifications</DropdownItem>
          <DropdownDivider />
          <DropdownItem text>Keyboard shortcuts</DropdownItem>
          <DropdownDivider />
          <DropdownItem text>Log out</DropdownItem>
        </DropdownItemsList>
      </Dropdown>
    </div>
  )
})
