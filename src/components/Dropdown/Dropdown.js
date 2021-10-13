import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import className from 'classnames'
import { useOutsideClick } from 'components/hooks/useOutsideClick'
import { DropdownModalMobile } from './DropdownModalMobile'
import { DropdownContext } from './DropdownContext'
import styles from './Dropdown.scss'

export const Dropdown = observer(
  ({
    modalTitle,
    customInnerClass,
    trigger,
    children,
    submenu,
    position,
    wide,
    inline = true,
    onClose,
    onOpen,
    isDisabled,
  }) => {
    const ref = useRef(null)
    const [open, setOpen] = useState(false)

    const handleClose = () => {
      if (onClose) {
        onClose()
      }
      setOpen(false)
    }

    const handleOpen = () => {
      if (onOpen) {
        onOpen()
      }
      setOpen(true)
    }

    const onToggle = () => (open ? handleClose() : handleOpen())

    useOutsideClick(
      ref,
      () => {
        handleClose()
      },
      open
    )

    const dropDownCSS = className(styles.Dropdown, {
      [styles.Dropdown__submenu]: submenu,
      [styles.Dropdown__wide]: wide,
    })

    const dropDownToggleCSS = className(styles.Dropdown_toggle, {
      [styles.Dropdown_toggle__submenu]: submenu,
    })

    // For Modal view B we can add one more class with pseudo for background and centered position
    const dropDownInnerCSS = className(styles.Dropdown_inner, styles[`Dropdown_inner__${position}`], {
      [styles.Dropdown_inner__submenu]: submenu,
      [customInnerClass]: customInnerClass,
    })

    const renderDropDownContent = () => {
      if (!open) return null

      return !inline ? (
        <DropdownModalMobile
          modalTitle={modalTitle}
          onClose={e => {
            e.stopPropagation()
            setOpen(false)
          }}
        >
          {typeof children === 'function' ? children(setOpen, true) : children}
        </DropdownModalMobile>
      ) : (
        <div className={dropDownInnerCSS}>{typeof children === 'function' ? children(setOpen) : children}</div>
      )
    }

    const dropdown = (
      <div className={dropDownCSS} ref={ref}>
        <div
          className={dropDownToggleCSS}
          onMouseEnter={() => submenu && setOpen(true)}
          onMouseLeave={() => submenu && setOpen(false)}
        >
          <div
            onClick={e => {
              if (isDisabled) return false
              e.stopPropagation()
              return onToggle()
            }}
          >
            {typeof trigger === 'function' ? trigger(open) : trigger}
          </div>
          {renderDropDownContent()}
        </div>
      </div>
    )

    // Create context only for parent dropdown
    return submenu ? dropdown : <DropdownContext.Provider value={handleClose}>{dropdown}</DropdownContext.Provider>
  }
)
