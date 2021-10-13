import React from 'react'
import { observer } from 'mobx-react'
import { Icon } from 'components/icons/Icon'
import { DropdownItem } from './DropdownItem'
import styles from './DropdownItemLabeledIcon.scss'

export const DropdownItemLabeledIcon = observer(props => {
  const { iconId, label, ...passthrough } = props

  return (
    <DropdownItem {...passthrough}>
      <div className={styles.DropdownItemLabeledIcon}>
        <Icon id={iconId} className={styles.DropdownItemLabeledIcon_icon} />
        &nbsp;
        <span>{label}</span>
      </div>
    </DropdownItem>
  )
})
