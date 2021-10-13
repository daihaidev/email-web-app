import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import { Ticket } from 'models/core/Ticket'

import styles from './TypeSwitcher.scss'

const onChangeType = action('changeType', value => {
  app.ui.inboxTab.draft.setType(value)
})

export const TypeSwitcher = observer(() => {
  const typePhone = app.ui.inboxTab.draft.type === Ticket.TYPES.phone

  const blockCss = classNames(styles.TypeSwitcher, {
    [styles.TypeSwitcher_isPhone]: typePhone,
  })

  const isEmail = classNames(styles.TypeSwitcher_button, {
    [styles.TypeSwitcher_button__isActive]: !typePhone,
  })

  const isPhone = classNames(styles.TypeSwitcher_button, {
    [styles.TypeSwitcher_button__isActive]: typePhone,
  })

  return (
    <div className={blockCss}>
      <span role='button' className={isPhone} onClick={() => onChangeType(Ticket.TYPES.phone)}>
        Track phone call
      </span>
      <span role='button' className={isEmail} onClick={() => onChangeType(Ticket.TYPES.email)}>
        Send email
      </span>
    </div>
  )
})
