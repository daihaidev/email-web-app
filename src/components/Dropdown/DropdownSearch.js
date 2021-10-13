import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import className from 'classnames'
import { useFocus } from 'components/hooks/useFocus'
import styles from './DropdownSearch.scss'

export const DropdownSearch = observer(({ customClass, searchPos, onChange, placeholder }) => {
  const [inputRef, setInputFocus] = useFocus()

  useEffect(() => {
    setInputFocus()
  })

  const containerClass = className(styles.DropdownSearch, {
    [styles[`DropdownSearch__${searchPos}`]]: searchPos,
    [customClass]: customClass,
  })

  return (
    <div className={containerClass}>
      <input type='text' placeholder={placeholder} ref={inputRef} onChange={onChange} />
    </div>
  )
})
