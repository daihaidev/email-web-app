import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { TicketModal } from 'components/TicketModal/TicketModal'
import { Ticket } from 'components/InboxTab/TicketPage/Ticket'
import { ReadOnlyContext } from 'components/ReadOnlyContext'
import { MergeNote } from './MergeNote'
import { MergeContent } from './MergeContent'
import { TicketsList } from './TicketsList'
import { TicketsListHeader } from './TicketsListHeader'
import { MergeHeader } from './MergeHeader'
import { SingleHeader } from './SingleHeader'

import styles from './TicketsModal.scss'

export const TicketsModal = observer(() => {
  const { isVisible, ticket, mode, MODES } = app.ui.inboxTab.ticketsModal

  const closeModal = () => app.ui.inboxTab.ticketsModal.setVisible(false)

  const renderSingle = () => {
    return ticket ? <Ticket ticket={ticket} customClass={styles.TicketsModal_ticket} /> : null
  }

  const renderMerge = () => {
    return (
      <>
        <MergeContent />
        <MergeNote />
      </>
    )
  }

  let header, content

  switch (mode) {
    case MODES.list:
      header = <TicketsListHeader />
      content = <TicketsList />
      break
    case MODES.single_history:
      header = <SingleHeader />
      content = renderSingle()
      break
    case MODES.single_direct:
      header = <SingleHeader />
      content = renderSingle()
      break
    case MODES.merge_from_preview:
      header = <MergeHeader />
      content = renderMerge()
      break
    case MODES.merge:
      header = <MergeHeader />
      content = renderMerge()
      break
    default:
      break
  }

  return (
    <ReadOnlyContext.Provider value>
      <TicketModal isVisible={isVisible} onClose={closeModal} header={header}>
        {content}
      </TicketModal>
    </ReadOnlyContext.Provider>
  )
})
