import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { TextButtonWithIcon } from 'components/Button/TextButtonWithIcon'

import styles from './SingleHeader.scss'

export const SingleHeader = observer(() => {
  const { ticket, mode, MODES } = app.ui.inboxTab.ticketsModal

  const navigateToList = () => {
    app.ui.inboxTab.ticketsModal.setTicket(null)
    app.ui.inboxTab.ticketsModal.setListMode()
  }

  const setMergeMode = () => {
    app.ui.inboxTab.ticketsModal.setMergeFromPreviewMode()
  }

  const backButton =
    mode === MODES.single_history ? <ButtonWithIcon iconId='ui_back_m' onClick={navigateToList} /> : null

  const listButton =
    mode === MODES.single_direct ? (
      <ButtonWithIcon
        iconId='customer_history_m'
        onClick={navigateToList}
        customWrapperClass={styles.TicketsModal_ticketActionsButton}
      />
    ) : null

  return (
    <div className={styles.SingleHeader}>
      {backButton}
      <div className={styles.SingleHeader_title}>{`Ticket #${ticket.number}`}</div>
      <div className={styles.SingleHeader_actions}>
        <TextButtonWithIcon
          icon='action_merge_m'
          onClick={setMergeMode}
          customWrapperClass={styles.SingleHeader_actionsButton}
        >{`Merge into #${ticket.number}`}</TextButtonWithIcon>
        <ButtonWithIcon iconId='action_expand_m' customWrapperClass={styles.SingleHeader_actionsButton} />
        {listButton}
        <div className={styles.SingleHeader_nav}>
          <div className={styles.SingleHeader_navButton}>
            <ButtonWithIcon iconId='ui_previous_m' />
          </div>
          <ButtonWithIcon iconId='ui_next_m' />
        </div>
      </div>
    </div>
  )
})
