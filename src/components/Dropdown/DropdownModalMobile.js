import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { ButtonWithIcon } from '../Button/ButtonWithIcon'
import styles from './DropdownModalMobile.scss'

export const DropdownModalMobile = observer(({ onClose, children, modalTitle }) => {
  // For future implementation of Modal view B
  const modalCSS = classNames(styles.DropdownModalMobile)

  return (
    <div className={modalCSS}>
      <header className={styles.DropdownModalMobile_header}>
        <ButtonWithIcon iconId='action_close_m' width={44} height={44} onClick={onClose} />
        <div className={styles.DropdownModalMobile_title}>{modalTitle}</div>
      </header>
      <div className={styles.DropdownModalMobile_content}>
        <div className={styles.DropdownModalMobile_contentScroll}>{children}</div>
      </div>
    </div>
  )
})
