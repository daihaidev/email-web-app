import React from 'react'
import { observer } from 'mobx-react'
// import classNames from 'classnames'
import { app } from 'app'

import { IconsPage } from './IconsPage'

export const DevTab = observer(() => {
  if (!app.ui.devTab.active) {
    return null
  }

  return <div>{app.ui.devTab.activePage === 'icons' && <IconsPage />}</div>
})
