import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'

import { app } from 'app'
import { Message } from 'models/core/Message'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { TextButton } from 'components/Button/TextButton'
import { Avatar } from 'components/Avatar/Avatar'
import { Icon } from 'components/icons/Icon'
import { SnoozeDropdown } from 'components/Dropdown/SnoozeDropdown'
import { MultiEmailInput } from 'components/Forms/MultiEmailInput'
import styles from './ReplyBox.scss'

export const ReplyBox = observer(({ message, ticket, mode, onClose, bodyPrefix = '', permanent, customer }) => {
  const user = app.currentUser

  const addPrefixToBody = body => (bodyPrefix ? `${bodyPrefix}${body}` : body)

  const [enableCC, setEnableCC] = useState(message && message.ccEmails.length > 0)
  const [enableBCC, setEnableBCC] = useState(message && message.bccEmails.length > 0)
  const [recipient, setRecipient] = useState(customer ? customer.primaryEmail : '')
  const [body, setBody] = useState(addPrefixToBody(''))
  const isReplyCollisionState = ticket.collisionState === 'reply'

  useEffect(() => {
    setBody(addPrefixToBody(message.body))
  }, [message.body, bodyPrefix])

  useEffect(() => {
    if (!recipient && customer && customer.primaryEmail) {
      setRecipient(customer.primaryEmail)
    }
  }, [customer])

  const renderUserWritingReply = () => {
    if (!isReplyCollisionState) return null
    return (
      <div className={styles.ReplyBox_author}>{`${app.ui.inboxTab.ticket.userWritingReply} is writing a reply`}</div>
    )
  }

  const cssClass = classNames(styles.ReplyBox, {
    [styles[`ReplyBox__${mode}`]]: mode,
    [styles.ReplyBox__permanent]: permanent,
    [styles.ReplyBox__isReply]: isReplyCollisionState,
  })

  const buttonGroupFirst = classNames(styles.ReplyBox_mainButton, styles.ReplyBox_mainButton__first)
  const buttonGroupLast = classNames(styles.ReplyBox_mainButton, styles.ReplyBox_mainButton__last)

  const addRecipient = recip => {
    setRecipient(recip)
  }

  const editReply = e => {
    const { value } = e.target
    const sliceLength = bodyPrefix.length - value.length
    const newValue = sliceLength >= 0 ? bodyPrefix : bodyPrefix + value.slice(sliceLength)
    setBody(newValue)
    if (message.isDraft) {
      message.saveDraftDebounced(ticket, newValue)
      message.saveDraftThrottled(ticket, newValue)
    }
  }

  const onReplyHeadersChange = (headerType, emails) => {
    message.setRecipients(headerType, emails)
    message.saveDraftDebounced(ticket, body)
  }

  const sendReply = () => {
    // TODO: send logic
  }

  const saveReply = () => {
    message.body = body
  }

  const renderMainAction = () => {
    switch (mode) {
      case Message.TYPES.reply:
        return (
          <div className={styles.ReplyBox_mainButtons}>
            <TextButton type='primary' size='large' customClass={buttonGroupFirst} onClick={sendReply}>
              Send a Reply
            </TextButton>
            <Dropdown
              position='topLeft'
              trigger={<ButtonWithIcon iconId='ui_more_m' type='primary' size='large' customClass={buttonGroupLast} />}
            >
              <DropdownItemsList>
                <DropdownItem>
                  <Dropdown
                    submenu
                    trigger={
                      <DropdownItem text submenu>
                        Send & Snooze
                      </DropdownItem>
                    }
                  >
                    <SnoozeDropdown onClick={snoozeUntil => message.submitWithState('snoozed', snoozeUntil)} />
                  </Dropdown>
                </DropdownItem>
                <DropdownItem text>Send & Hold</DropdownItem>
                <DropdownItem text>Send & Close</DropdownItem>
                <DropdownItem text>Send</DropdownItem>
              </DropdownItemsList>
            </Dropdown>
          </div>
        )
      case Message.TYPES.note:
        return (
          <TextButton type='primary' size='large' onClick={saveReply}>
            Save
          </TextButton>
        )
      default:
        return null
    }
  }

  const renderCC = () =>
    enableCC ? (
      <div className={styles.ReplyBox_recipientField}>
        <div className={styles.ReplyBox_recipientLabel}>Cc:</div>
        <div className={styles.ReplyBox_recipientContent}>
          <MultiEmailInput emails={message.ccEmails} onChange={emails => onReplyHeadersChange('cc', emails)} />
        </div>
      </div>
    ) : null

  const renderBCC = () =>
    enableBCC ? (
      <div className={styles.ReplyBox_recipientField}>
        <div className={styles.ReplyBox_recipientLabel}>Bcc:</div>
        <div className={styles.ReplyBox_recipientContent}>
          <MultiEmailInput emails={message.bccEmails} onChange={emails => onReplyHeadersChange('bcc', emails)} />
        </div>
      </div>
    ) : null

  const renderTo = () => {
    return (
      <div className={styles.ReplyBox_recipientSelect}>
        <strong>
          {customer.first_name} {customer.last_name}
        </strong>{' '}
        {`<${recipient}>`}
        <Icon className={styles.ReplyBox_recipientSelectIcon} id='ui_uncollapseThick_xs' />
      </div>
    )
  }

  const renderEmailsDropdown = () => {
    return !customer ? (
      <div className={styles.ReplyBox_placeholderTo}>Select the Customer above</div>
    ) : (
      <Dropdown position='bottomLeft' trigger={() => renderTo()}>
        <DropdownItemsList>
          {customer.emails.map((email, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <DropdownItem text key={i} onClick={() => addRecipient(email)}>
              {email}
            </DropdownItem>
          ))}
        </DropdownItemsList>
      </Dropdown>
    )
  }

  const renderContentTop = () => {
    switch (mode) {
      case Message.TYPES.reply:
        return (
          <div className={styles.ReplyBox_recipients}>
            <div className={styles.ReplyBox_recipientField}>
              <div className={styles.ReplyBox_recipientLabel}>To:</div>
              <div className={styles.ReplyBox_recipientContent}>{renderEmailsDropdown()}</div>
            </div>
            {renderCC()}
            {renderBCC()}
            <div className={styles.ReplyBox_recipientsButtons}>
              {!enableCC && (
                <TextButton customClass={styles.ReplyBox_recipientsButton} onClick={() => setEnableCC(true)}>
                  CC
                </TextButton>
              )}
              {!enableBCC && (
                <TextButton customClass={styles.ReplyBox_recipientsButton} onClick={() => setEnableBCC(true)}>
                  BCC
                </TextButton>
              )}
            </div>
          </div>
        )
      case Message.TYPES.note:
        return (
          <div className={styles.ReplyBox_noteFrom}>
            {message.from_name || 'Note'}
            <Icon id='ticket_note_s' className={styles.ReplyBox_noteIcon} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={cssClass}>
      <div className={styles.ReplyBox_main}>
        <div className={styles.ReplyBox_avatar}>
          <Avatar model={user} size='medium' />
        </div>
        <div className={styles.ReplyBox_content}>
          {renderContentTop()}
          <div className={styles.ReplyBox_body}>
            <TextareaAutosize value={body} className={styles.ReplyBox_textarea} onChange={editReply} />
          </div>
        </div>
      </div>
      <div className={styles.ReplyBox_actions}>
        {renderMainAction()}
        <div className={styles.ReplyBox_sectionLeft}>
          <ButtonWithIcon iconId='action_cannedResponse_m' />
          <ButtonWithIcon iconId='action_knowledgeBase_m' />
          <ButtonWithIcon iconId='action_image_m' />
          <ButtonWithIcon iconId='action_attach_m' />
        </div>
        <div className={styles.ReplyBox_sectionRight}>
          {renderUserWritingReply()}
          <ButtonWithIcon iconId='action_trash_m' onClick={onClose} />
        </div>
      </div>
    </div>
  )
})
