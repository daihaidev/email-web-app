import React from 'react'
import { observer } from 'mobx-react'
import { Header } from 'components/Layout/Header'
import { Search } from 'components/Search/Search'
import { AddButton } from 'components/InboxTab/AddButton/AddButton'
import { BulkActions } from './BulkActions'
import { NavControls } from './NavControls'
import { FolderSelectorMobile } from './FolderSelectorMobile'
import styles from './FolderPageHeader.scss'
import { AppMenuButton } from '../../AppMenu/AppMenuButton'

export const FolderPageHeader = observer(({ folder }) => {
  return (
    <Header title='Inbox' headingSlot={<AddButton />}>
      <AppMenuButton />
      <BulkActions folder={folder} />
      <FolderSelectorMobile />
      <div className={styles.FolderPageHeader_search}>
        <Search />
      </div>
      <NavControls folder={folder} />
    </Header>
  )
})
