import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { useOutsideClick } from 'components/hooks/useOutsideClick'
import { Input } from './Input'
import styles from './TextEditable.scss'

export const TextEditable = observer(({ value, onChange, onBlur, inputMode, placeholder, readOnly }) => {
  const [editMode, setEditMode] = useState(false)
  const cssClass = classNames(styles.TextEditable, {
    [styles.TextEditable__readOnly]: readOnly,
  })

  const inputCssClass = classNames(styles.TextEditable_input, {
    [styles.TextEditable_input__isEditable]: editMode || inputMode,
  })

  if (inputMode) {
    return (
      <Input
        placeholder={placeholder}
        value={value || ''}
        customClass={inputCssClass}
        onChange={onChange}
        onBlur={onBlur}
      />
    )
  }

  const ref = useRef(null)

  const enableEdit = () => {
    if (!readOnly) {
      ref.current.querySelector('input').focus()
      setEditMode(true)
    }
  }

  useOutsideClick(ref, () => setEditMode(false), editMode)

  return (
    <div className={cssClass} onClick={enableEdit} ref={ref}>
      <Input
        placeholder={placeholder}
        readOnly={!editMode}
        value={value || ''}
        customClass={inputCssClass}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  )
})
