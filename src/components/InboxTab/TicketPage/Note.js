import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import { Icon } from 'components/icons/Icon'
import { TimeFormat } from 'components/TimeFormat'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { Message } from './Message'
import styles from './Note.scss'

export const Note = observer(({ message, styling, readOnly }) => {
  const contentClass = classNames(styles.Note_content, {
    [styles.Note_content__isExpanded]: !message.collapsed,
    [styles.Note_content__isDraft]: message.isDraft,
  })

  const renderIcon = () => <Icon id='ticket_note_s' className={styles.Note_icon} />

  const renderActions = () => (
    <DropdownItemsList>
      <DropdownItem
        text
        onClick={() => {
          message.editing = true
        }}
      >
        Edit Note
      </DropdownItem>
    </DropdownItemsList>
  )

  const isUpdated = !message.isDraft && message.updated_at && message.updated_at !== message.created_at
  const renderUpdated = () => {
    const user = app.users.find(u => u.id === message.updated_by_id)

    return (
      <div className={styles.Note_updated}>
        Last updated by {user.name} - <TimeFormat time={message.updated_at} mode='hybrid' />
      </div>
    )
  }

  const messageBody = () => ({ __html: message.body })

  return (
    <Message message={message} styling={styling} slotFrom={renderIcon()} actions={renderActions} readOnly={readOnly}>
      <div className={contentClass}>
        <div dangerouslySetInnerHTML={messageBody()} />
        {isUpdated && renderUpdated()}
      </div>
    </Message>
  )
})
