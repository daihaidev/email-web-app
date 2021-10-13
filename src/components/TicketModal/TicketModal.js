import React from 'react'
import { observer } from 'mobx-react'

import { Modal } from 'components/Modal/Modal'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'

import styles from './TicketModal.scss'

export const TicketModal = observer(({ children, onClose, header, isVisible }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className={styles.TicketModal}>
        <div className={styles.TicketModal_header}>
          <div className={styles.TicketModal_headerContent}>{header}</div>
          <div className={styles.TicketModal_close}>
            <ButtonWithIcon iconId='action_close_m' onClick={onClose} />
          </div>
        </div>
        {children}
      </div>
    </Modal>
  )
})
