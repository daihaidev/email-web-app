import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Avatar } from 'components/Avatar/Avatar'
import { Icon } from 'components/icons/Icon'
import { TicketsModal } from 'components/TicketsModal/TicketsModal'
import { Ticket } from 'models/core/Ticket'
import { CustomerProfileEditor } from './CustomerProfileEditor'
import { RecentTicketsSidebarApp } from './RecentTicketsSidebarApp'

import styles from './CustomerProfile.scss'

export const toggleCustomerProfileEditor = value => {
  app.ui.inboxTab.customerProfileEditorOpen = value
}

// TODO: Probably better to extract editor from profile to avoid passing props
export const CustomerProfile = observer(({ customer, onSave, ticketId }) => {
  if (!customer) {
    return null
  }

  const { emails, first_name, twitters, last_name, notes, phones } = customer

  const renderEditor = () => {
    if (!app.ui.inboxTab.customerProfileEditorOpen) return null
    return (
      <CustomerProfileEditor
        onSave={onSave}
        onClose={() => toggleCustomerProfileEditor(false)}
        customer={customer.cloneForProfileEdit()}
      />
    )
  }

  // Load recent tickets here to avoid cyclic reference
  Ticket.getRecentForCustomer(customer, ticketId)

  const renderTicketsModal = () => (app.ui.inboxTab.ticketsModal.isVisible ? <TicketsModal /> : null)

  const renderField = (value, icon) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null
    /* eslint-disable react/no-array-index-key */
    return (
      <div className={styles.CustomerProfile_info}>
        <div className={styles.CustomerProfile_infoIcon}>
          <Icon id={icon} className={styles.CustomerProfile_icon} />
        </div>
        {Array.isArray(value) && value.length ? value.map((val, i) => <div key={i}>{val}</div>) : value}
      </div>
    )
    /* eslint-enable react/no-array-index-key */
  }

  const showTicketsModal = () => {
    app.ui.inboxTab.ticketsModal.setListMode()
    app.ui.inboxTab.ticketsModal.setVisible(true)
  }

  return (
    <div className={styles.CustomerProfile}>
      <div className={styles.CustomerProfile_header}>
        <ButtonWithIcon iconId='customer_history_m' onClick={showTicketsModal} />
        {renderTicketsModal()}
        <div className={styles.CustomerProfile_avatar}>
          <Avatar model={customer} size='large' />
        </div>
        <ButtonWithIcon iconId='action_edit_m' onClick={() => toggleCustomerProfileEditor(true)} />
        {renderEditor()}
      </div>
      <div className={styles.CustomerProfile_name}>
        {first_name} {last_name}
      </div>
      {renderField(emails, 'ticketType_email_s')}
      {renderField(phones, 'ticketType_phone_s')}
      {renderField(twitters, 'ticketType_twitter_s')}
      {renderField(notes, 'ticket_note_s')}
      <div className={styles.CustomerProfile_apps}>
        <RecentTicketsSidebarApp tickets={customer.recentTickets} />
      </div>
    </div>
  )
})
