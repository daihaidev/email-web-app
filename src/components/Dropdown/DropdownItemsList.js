import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import className from 'classnames'
import styles from './DropdownItemsList.scss'

export const DropdownItemsList = observer(({ customClass, children, horizontal, noScroll, fullWidth }) => {
  const [hasScrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    if (!noScroll && children && children.length > 8) {
      setHasScrollbar(true)
    } else {
      setHasScrollbar(false)
    }
  })

  const dropDownItemsCSS = className(styles.DropdownItemsList, {
    [styles.DropdownItemsList__withScroll]: hasScrollbar,
    [styles.DropdownItemsList__fullWidth]: fullWidth,
    [customClass]: customClass,
  })

  const dropDownItemsInnerCSS = className(styles.DropdownItemsList_items, {
    [styles.DropdownItemsList_items__withScroll]: hasScrollbar,
    [styles.DropdownItemsList_items__horizontal]: horizontal,
  })

  return (
    <div className={dropDownItemsCSS}>
      <div className={dropDownItemsInnerCSS}>{children}</div>
    </div>
  )
})
