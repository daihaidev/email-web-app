import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { FolderPage } from './FolderPage/FolderPage'
import { TicketPage } from './TicketPage/TicketPage'
import { DraftPage } from './DraftPage/DraftPage'
import { DateTimeModal } from '../DateTimeModal/DateTimeModal'

export const InboxTab = observer(() => {
  const klass = classNames({ uHidden: !app.ui.inboxTab.active })

  return (
    <div className={klass}>
      {app.ui.inboxTab.ticket ? <TicketPage /> : null}
      {app.ui.inboxTab.showFolderPage ? <FolderPage /> : null}
      {app.ui.inboxTab.draft ? <DraftPage /> : null}
      <DateTimeModal />
    </div>
  )
})
