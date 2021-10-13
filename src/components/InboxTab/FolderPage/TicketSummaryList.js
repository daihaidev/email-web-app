import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { TicketSummary } from 'components/InboxTab/TicketSummary/TicketSummary'
import styles from './TicketSummaryList.scss'

export const TicketSummaryList = observer(({ folder }) => {
  const { active, loaded, tickets, timeField } = folder
  // we use uHiddenInline because uHidden causes size changes which triggers
  // uSize on TicketSummary when flipping between folders
  const klass = classNames(styles.TicketSummaryList, { uHiddenInline: !active })

  const ticketSummaryItems = () =>
    tickets.map(ticket => <TicketSummaryList.TicketSummary key={ticket.id} model={ticket} timeField={timeField} />)

  if (loaded) {
    return tickets.length > 0 ? (
      <div className={klass}>{ticketSummaryItems()}</div>
    ) : (
      <div className={klass}>Woohoo! No Tickets Left!</div>
    )
  }
  return <div className={klass}>Loading</div>
})

TicketSummaryList.TicketSummary = observer(({ model, timeField }) => {
  const handleClick = () => {
    app.ui.inboxTab.setPreLoadedTicket(model)
    app.router.navigate('inbox.ticket', { id: model.id })
  }
  return (
    <div className={styles.TicketSummaryList_ticketSummary}>
      <TicketSummary model={model} timeField={timeField} onClick={handleClick} />
    </div>
  )
})
