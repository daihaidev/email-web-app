import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import styles from './Checkbox.scss'

export const Checkbox = observer(({ checkboxId, onChange, isChecked, noHoverIfChecked, size }) => {
  return (
    <div
      className={classNames(styles.Checkbox, {
        [styles[`Checkbox__${size}`]]: size,
      })}
    >
      <input
        type='checkbox'
        id={checkboxId}
        className={styles.Checkbox_checkboxInput}
        onChange={onChange}
        checked={isChecked}
      />
      <label
        htmlFor={checkboxId}
        className={classNames(
          styles.Checkbox_checkboxLabel,
          {
            [styles.Checkbox_checkboxLabel__noHoverIfChecked]: noHoverIfChecked && isChecked,
          },
          {
            [styles[`Checkbox_checkboxLabel__${size}`]]: size,
          }
        )}
      >
        <Icon id='ui_checkMark_xs' className={styles.Checkbox_tickIcon} />
      </label>
    </div>
  )
})
