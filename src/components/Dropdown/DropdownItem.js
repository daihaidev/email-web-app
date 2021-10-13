import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import className from 'classnames'
import { Icon } from 'components/icons/Icon'
import { DropdownContext } from './DropdownContext'
import styles from './DropdownItem.scss'

export const DropdownItem = observer(({ text, customClass, submenu, onClick, children, close = true }) => {
  const handleClose = useContext(DropdownContext)

  const clickHandler = e => {
    e.stopPropagation()
    if (onClick) {
      onClick()
    }
    if (close) {
      handleClose()
    }
  }

  return (
    <div
      className={className(styles.DropdownItem, {
        [customClass]: customClass,
        [styles.DropdownItem__submenu]: submenu,
      })}
      onClick={clickHandler}
    >
      {text ? <span>{children}</span> : children}
      {submenu && <Icon id='ui_uncollapseThick_xs' className={styles.DropdownItem_submenuIcon} />}
    </div>
  )
})
