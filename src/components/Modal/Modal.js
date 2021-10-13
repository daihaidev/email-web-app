import React, { useRef } from 'react'
import { observer } from 'mobx-react'

import styles from './Modal.scss'

export const Modal = observer(props => {
  const overlay = useRef(null)

  const onClose = e => {
    if (e.target === overlay.current) {
      props.onClose()
    }
  }

  return props.isVisible ? (
    <div className={styles.Modal} ref={overlay} onClick={onClose}>
      <div className={styles.Modal_window}>{props.children}</div>
    </div>
  ) : null
})

Modal.Header = observer(props => {
  return (
    <div className={styles.Modal_header}>
      <div className={styles.Modal_title}>{props.title}</div>
      {props.children}
    </div>
  )
})

Modal.Body = observer(props => {
  return <div className={styles.Modal_body}>{props.children}</div>
})

Modal.Footer = observer(props => {
  return <div className={styles.Modal_footer}>{props.children}</div>
})
