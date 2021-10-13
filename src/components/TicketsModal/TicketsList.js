import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { DropdownNoItems } from 'components/Dropdown/DropdownNoItems'
import { TicketSummary } from 'components/InboxTab/TicketSummary/TicketSummary'

import styles from './TicketsList.scss'

export const TicketsList = observer(() => {
  const { results, query } = app.ui.inboxTab.ticketSearch

  const navigateToTicket = t => {
    app.ui.inboxTab.ticketsModal.setTicket(t)
    app.ui.inboxTab.ticketsModal.setSingleHistoryMode()
  }

  let output

  if (!results.length) {
    output = <DropdownNoItems text='No matches' />
  } else if (!query) {
    output = <div>No query</div>
  } else {
    output = results.slice(0, results.length).map(item => (
      <div className={styles.TicketsList_Item} key={item.id}>
        <TicketSummary model={item} interactive={false} onClick={() => navigateToTicket(item)} />
      </div>
    ))
  }
  return <div className={styles.TicketsList}>{output}</div>
})
