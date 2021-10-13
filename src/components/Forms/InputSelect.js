import React from 'react'
import { observer } from 'mobx-react'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Input } from './Input'
import styles from './InputSelect.scss'

export const InputSelect = observer(({ search, value, onChange, onFocus, onBlur }) => {
  return (
    <div className={styles.InputSelect}>
      <Input
        readOnly={!search}
        customClass={styles.InputSelect_input}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className={styles.InputSelect_iconBlock}>
        <ButtonWithIcon iconId='ui_uncollapseThick_xs' customClass={styles.InputSelect_button} />
      </div>
    </div>
  )
})
