import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import styles from './Input.scss'

export const Input = observer(
  ({ placeholder, type, readOnly, disabled, value, onChange, customClass, onBlur, onFocus }) => {
    const cssClass = classNames(styles.Input, {
      [customClass]: customClass,
      [styles.Input__disabled]: disabled,
    })

    return (
      <input
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={onFocus}
        type={type}
        readOnly={readOnly}
        disabled={disabled}
        className={cssClass}
        value={value}
        onChange={onChange}
      />
    )
  }
)

Input.defaultProps = {
  type: 'text',
  readOnly: false,
  disabled: false,
}
