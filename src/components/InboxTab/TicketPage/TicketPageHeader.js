import React from 'react'
import { observer } from 'mobx-react'

import { Header } from 'components/Layout/Header'
import { AppMenuButton } from 'components/AppMenu/AppMenuButton'
import { AddButton } from 'components/InboxTab/AddButton/AddButton'
import { TicketSearchDropdown } from 'components/InboxTab/TicketSearchDropdown/TicketSearchDropdown'
import { TicketColliders } from 'components/InboxTab/TicketPage/TicketColliders'
import { Actions } from './Actions'
import { NavControls } from './NavControls'
import styles from './TicketPageHeader.scss'

export const TicketPageHeader = observer(() => {
  return (
    <Header title='Inbox' headingSlot={<AddButton />}>
      <AppMenuButton />
      <Actions />
      <div className={styles.TicketPageHeader_ticketColliders}>
        <TicketColliders />
      </div>
      <div className={styles.TicketPageHeader_search}>
        <TicketSearchDropdown />
      </div>
      <NavControls />
    </Header>
  )
})
