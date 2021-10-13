import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { Dropdown } from 'components/Dropdown/Dropdown'
import { Icon } from 'components/icons/Icon'
import styles from './FolderSelectorMobile.scss'
import { FoldersList } from './FoldersList'

export const FolderSelectorMobile = observer(() => {
  if (app.viewport !== 'xs') return null

  const trigger = (
    <div role='button' className={styles.FolderSelectorMobile_trigger}>
      Available Tickets
      <Icon id='ui_uncollapseThick_xs' className={styles.FolderSelectorMobile_triggerIcon} />
    </div>
  )

  return (
    <Dropdown inline={false} trigger={trigger} modalTitle='Select Folder'>
      {onClose => {
        const closeDropdown = () => onClose(false)
        return <FoldersList onNavigate={closeDropdown} />
      }}
    </Dropdown>
  )
})
