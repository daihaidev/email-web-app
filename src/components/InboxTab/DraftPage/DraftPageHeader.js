import React from 'react'
import { observer } from 'mobx-react'

import { Header } from 'components/Layout/Header'
import { Search } from 'components/Search/Search'
import { Actions } from './Actions'
import styles from './DraftPageHeader.scss'

export const DraftPageHeader = observer(() => {
  return (
    <Header title='Inbox'>
      <Actions />
      <div className={styles.DraftPageHeader_search}>
        <Search />
      </div>
    </Header>
  )
})
