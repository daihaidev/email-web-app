import React from 'react'
import { observer } from 'mobx-react'
import styles from './DropdownNoItems.scss'

export const DropdownNoItems = observer(props => {
  return <div className={styles.DropdownNoItems}>{props.text}</div>
})
