import React from 'react'
import { observer } from 'mobx-react'

import { app } from 'app'
import { Inbox } from './Inbox'

export const FoldersList = observer(({ onNavigate }) => (
  <>
    {app.unifiedInbox ? <Inbox key={app.unifiedInbox.id} model={app.unifiedInbox} onNavigate={onNavigate} /> : null}
    {app.inboxes.map(inbox =>
      inbox.folders.length > 0 ? <Inbox key={inbox.id} model={inbox} onNavigate={onNavigate} /> : null
    )}
  </>
))
