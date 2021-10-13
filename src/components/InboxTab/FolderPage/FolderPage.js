import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import { Sidebar } from 'components/Layout/Sidebar'
import { Page } from 'components/Layout/Page'
import { FolderPageHeader } from './FolderPageHeader'
import { FoldersList } from './FoldersList'
import { TicketSummaryList } from './TicketSummaryList'
import styles from './FolderPage.scss'

export const FolderPage = observer(() => {
  const klass = classNames(styles.FolderPage, {
    uHidden: !app.ui.inboxTab.folderPageIsActive,
    [styles.FolderPage__hasAlert]: app.alertProvider.alert,
  })

  const renderSidebar = () => (
    <Sidebar>
      <FoldersList />
    </Sidebar>
  )

  const renderHeader = () => <FolderPageHeader folder={app.ui.inboxTab.activeFolder} />

  return (
    <Page className={klass} header={renderHeader()} sidebar={renderSidebar()} customClass={klass}>
      {app.unifiedInbox
        ? app.unifiedInbox.folders.map(folder => {
            return <TicketSummaryList key={folder.id} folder={folder} />
          })
        : null}
      {app.inboxes.map(inbox => {
        return inbox.folders.map(folder => {
          return inbox.folders.length > 0 ? <TicketSummaryList key={folder.id} folder={folder} /> : null
        })
      })}
    </Page>
  )
})
