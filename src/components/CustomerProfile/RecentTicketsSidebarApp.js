import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { TimeFormat } from 'components/TimeFormat'
import { SidebarApp } from 'components/SidebarApp/SidebarApp'
import { Icon } from 'components/icons/Icon'

import styles from './RecentTicketsSidebarApp.scss'

export const RecentTicketsSidebarApp = observer(({ tickets }) => {
  const openTicketModal = ticket => {
    app.ui.inboxTab.ticketsModal.setTicket(ticket)
    app.ui.inboxTab.ticketsModal.setSingleDirectMode()
    app.ui.inboxTab.ticketsModal.setVisible(true)
  }

  const renderTicket = t => (
    <div className={styles.RecentTicketsSidebarApp_item} key={t.id} onClick={() => openTicketModal(t)}>
      <Icon id={`state_${t.state}_xs`} className={styles.RecentTicketsSidebarApp_itemIcon} />
      <div className={styles.RecentTicketsSidebarApp_itemTitle}>{t.subject}</div>
      <div className={styles.RecentTicketsSidebarApp_itemDate}>
        <TimeFormat time={t.updated_at} mode='full' />
      </div>
    </div>
  )

  return (
    <SidebarApp title='Recent tickets'>
      <div className={styles.RecentTicketsSidebarApp}>{(tickets || []).map(renderTicket)}</div>
    </SidebarApp>
  )
})
