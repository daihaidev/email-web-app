import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { Message } from './Message'

import styles from './EmailReply.scss'

export const EmailReply = observer(({ message, styling, readOnly }) => {
  const cssButtonClass = classNames(styles.EmailReply_button, {
    [styles.EmailReply_button__isExpanded]: !message.collapsed,
  })

  const replyHandler = e => {
    e.stopPropagation()
  }

  const renderActions = () => {
    const onClick = () => app.router.navigate('inbox.split', { id: 'new', ticket_id: 123, message_id: 456 })
    return (
      <DropdownItem text onClick={onClick}>
        Create new ticket
      </DropdownItem>
    )
  }

  const renderButton = () => (
    <div className={cssButtonClass}>
      <ButtonWithIcon size='small' iconId='ui_uncollapseThick_xs' onClick={replyHandler} />
    </div>
  )

  const messageBody = () => ({ __html: message.body })

  return (
    <Message styling={styling} message={message} slotFrom={renderButton()} actions={renderActions} readOnly={readOnly}>
      <div dangerouslySetInnerHTML={messageBody()} />
    </Message>
  )
})
