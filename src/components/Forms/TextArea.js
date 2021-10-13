import React from 'react'
import { observer } from 'mobx-react'
import styles from './TextArea.scss'

export const TextArea = observer(props => {
  return (
    <textarea
      readOnly={props.readOnly}
      disabled={props.disabled}
      className={styles.TextArea}
      value={props.value}
      onChange={props.onChange}
    />
  )
})

TextArea.defaultProps = {
  readOnly: false,
  disabled: false,
}
