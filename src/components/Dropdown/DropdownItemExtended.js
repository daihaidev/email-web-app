import React from 'react'
import { observer } from 'mobx-react'
import { DropdownItem } from './DropdownItem'
import styles from './DropdownItemExtended.scss'

export const DropdownItemExtended = observer(props => {
  const { textPrimary, textSecondary, ...passthrough } = props

  return (
    <DropdownItem customClass={styles.DropdownItemExtended} {...passthrough}>
      <span>{textPrimary}</span>
      <small>{textSecondary}</small>
    </DropdownItem>
  )
})
