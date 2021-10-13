import { App } from 'components/App'
import React from 'react'
import ReactDOM from 'react-dom'

import { InboxTab } from './InboxTab'
import { ChatTab } from './ChatTab'
import { DevTab } from './DevTab'

export class UI {
  constructor() {
    this.inboxTab = new InboxTab()
    this.chatTab = new ChatTab()
    this.devTab = new DevTab()

    this.initializeReact()
  }

  initializeReact() {
    ReactDOM.render(<App />, document.getElementById('root'))
  }
}
