import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { Sidebar } from 'components/Layout/Sidebar'
import { Page } from 'components/Layout/Page'
import { CustomerProfile, toggleCustomerProfileEditor } from 'components/CustomerProfile/CustomerProfile'
import { action } from 'mobx'
import { TicketPageHeader } from './TicketPageHeader'
import { Ticket } from './Ticket'
import styles from './TicketPage.scss'
import { useScroll } from '../../hooks/useScroll'

const onCloseEditor = () => toggleCustomerProfileEditor(false)

const onSaveProfile = action('customerProfileEditorSave', profile => {
  app.customers.forEach(customer => {
    if (customer.id === profile.id) {
      Object.keys(profile).forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(profile, prop)) {
          customer[prop] = profile[prop]
        }
      })
    }
  })

  onCloseEditor()
})

export const TicketPage = observer(() => {
  const scrollRef = useRef(null)
  const scroll = useScroll(scrollRef)

  const klass = classNames({
    uHidden: !app.ui.inboxTab.ticketPageIsActive,
  })

  const renderSidebar = () => (
    <Sidebar>
      <div className={styles.TicketPage_sidebar}>
        <CustomerProfile
          customer={app.ui.inboxTab.ticket.customer}
          onSave={onSaveProfile}
          onClose={onCloseEditor}
          ticketId={app.ui.inboxTab.ticket.id}
        />
      </div>
    </Sidebar>
  )

  const renderHeader = () => <TicketPageHeader />

  const renderTicket = () => {
    switch (app.ui.inboxTab.ticket.notFoundReason) {
      case 'notFound':
        return <div>Oops! Can&apos;t find the ticket you are looking for :(</div>
      case 'forbidden':
        return <div>You don&apos;t have the permission to view this ticket!</div>
      default:
        return <Ticket stickyHeader scroll={scroll} ticket={app.ui.inboxTab.ticket} />
    }
  }

  return (
    <Page header={renderHeader()} sidebar={renderSidebar()} customClass={klass} ref={scrollRef}>
      {renderTicket()}
    </Page>
  )
})
