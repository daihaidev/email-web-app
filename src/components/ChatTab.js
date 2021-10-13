import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

// import "./ChatTab.scss"

export const ChatTab = observer(() => {
  const klass = classNames({ uHidden: !app.ui.chatTab.active })

  return <div className={klass}>ChatTab</div>
})
