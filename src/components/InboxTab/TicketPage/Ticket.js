import React, { useState, useRef, useContext, useEffect } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { TextButtonWithIcon } from 'components/Button/TextButtonWithIcon'
import { TicketAttributeHeader } from 'components/InboxTab/TicketAttributeHeader/TicketAttributeHeader'
import { ReadOnlyContext } from 'components/ReadOnlyContext'
import { Message } from 'models/core/Message'
import { MessagesList } from './MessagesList'
import { ReplyBox } from './ReplyBox'

import styles from './Ticket.scss'

export const Ticket = observer(({ scroll, stickyHeader, ticket }) => {
  const [replyBoxVisible, setReplyBoxVisible] = useState(false)

  const readOnly = useContext(ReadOnlyContext)

  const cssClass = classNames(styles.Ticket, {
    [styles.Ticket__stickyHeader]: stickyHeader,
  })
  const ref = useRef(null)

  useEffect(() => {
    setReplyBoxVisible(ticket.draft && true)
  }, [ticket.draft])

  const openReplyBox = mode => {
    ticket.setDraft(mode)
    setReplyBoxVisible(true)
  }

  const closeReplyBox = () => {
    ticket.draft.cancelEditing(ticket)
    setReplyBoxVisible(false)
  }

  const renderFooter = () =>
    replyBoxVisible ? (
      <ReplyBox
        ticket={ticket}
        customer={ticket.customer}
        mode={ticket.draft.type}
        message={ticket.draft}
        onClose={closeReplyBox}
      />
    ) : (
      <footer className={styles.Ticket_footer}>
        <div className={styles.Ticket_footerButtons}>
          <TextButtonWithIcon
            type='primary'
            icon='ticket_reply_m'
            size='large'
            onClick={() => openReplyBox(Message.TYPES.reply)}
          >
            Send a reply
          </TextButtonWithIcon>
          <TextButtonWithIcon
            type='primary'
            icon='ticket_note_m'
            size='large'
            onClick={() => openReplyBox(Message.TYPES.note)}
          >
            Add a note
          </TextButtonWithIcon>
        </div>
      </footer>
    )

  return (
    <section className={cssClass} ref={ref}>
      <TicketAttributeHeader ticket={ticket} sticky={stickyHeader} scroll={scroll} />
      {ticket.loaded ? <MessagesList ticket={ticket} replyBoxVisible={replyBoxVisible} /> : <div>Loading ticket</div>}
      {ticket.loaded && !readOnly ? renderFooter() : null}
    </section>
  )
})
