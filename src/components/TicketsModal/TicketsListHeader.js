import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { Search } from 'components/Search/Search'
import { Pagination } from 'components/Pagination/Pagination'

import styles from './TicketsListHeader.scss'

export const TicketsListHeader = observer(() => {
  const onChangeHandler = e => {
    app.ui.inboxTab.ticketSearch.query = e.target.value
  }

  return (
    <div className={styles.TicketsListHeader}>
      <div className={styles.TicketsListHeader_title}>Tickets history</div>
      <div className={styles.TicketsListHeader_search}>
        <Search value={app.ui.inboxTab.ticketSearch.query} onChange={onChangeHandler} />
      </div>
      <div className={styles.TicketsListHeader_pagination}>
        <Pagination value={1} prevDisabled />
      </div>
    </div>
  )
})
