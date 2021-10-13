import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'

import styles from './MergeHeader.scss'

export const MergeHeader = observer(() => {
  const backToTicket = () => {
    app.ui.inboxTab.ticketsModal.setSingleDirectMode()
  }

  const backButton =
    app.ui.inboxTab.ticketsModal.mode === app.ui.inboxTab.ticketsModal.MODES.merge_from_preview ? (
      <ButtonWithIcon iconId='ui_back_m' onClick={backToTicket} />
    ) : null

  return (
    <>
      <div className={styles.MergeHeader}>
        {backButton}
        <div className={styles.MergeHeader_title}>Merge tickets</div>
      </div>
      <div className={styles.MergeHeader_note}>
        <p>Select a recent ticket from Jon Wayne to merge into.</p>
        <p>
          All replies and notes from the current ticket will be moved to that ticket. Current ticket will be deleted.
          Merging cannot be undone.
        </p>
      </div>
    </>
  )
})
