import React from 'react'
import { observer } from 'mobx-react'
import { Icon } from 'components/icons/Icon'
import styles from './InputGroup.scss'

export const InputGroup = observer(props => {
  const renderIcon = () => (props.iconId ? <Icon id={props.iconId} className={styles.InputGroup_icon} /> : null)

  const renderHeaderSlot = () =>
    props.headerSlot ? <div className={styles.InputGroup_headerSlot}>{props.headerSlot}</div> : null

  return (
    <div>
      <div className={styles.InputGroup_header}>
        {renderIcon()}
        <label className={styles.InputGroup_label}>{props.label}</label>
        {renderHeaderSlot()}
      </div>
      {props.children}
    </div>
  )
})

InputGroup.Field = observer(props => {
  return <div className={styles.InputGroup_field}>{props.children}</div>
})
