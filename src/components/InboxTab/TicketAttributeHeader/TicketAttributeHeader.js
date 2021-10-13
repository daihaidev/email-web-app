import React, { useRef, useState, useEffect, useContext } from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import classNames from 'classnames'
import { action } from 'mobx'

import { InboxPill } from 'components/Pill/InboxPill'
import { TextWithIconPill } from 'components/Pill/TextWithIconPill'
import { TicketLabels } from 'components/InboxTab/TicketPage/TicketLabels'
import { UserPill } from 'components/Pill/UserPill'
import { useSize } from 'components/hooks/useSize'
import { TicketStatePill } from 'components/Pill/TicketStatePill'
import { TextEditable } from 'components/Forms/TextEditable'
import { ReadOnlyContext } from 'components/ReadOnlyContext'

import styles from './TicketAttributeHeader.scss'

const onChangeTicketSubject = action('changeTicketSubject', (e, ticket) => {
  ticket.subject = e.target.value
})

export const TicketAttributeHeader = observer(({ ticket, isDraft, sticky, scroll }) => {
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false)
  const [isHeaderAttached, setHeaderAttached] = useState(false)
  const [transformValue, setTransformValue] = useState(0)
  const { number } = ticket
  const cssClass = classNames(styles.TicketAttributeHeader, {
    [styles.TicketAttributeHeader__isDraft]: isDraft,
    [styles.TicketAttributeHeader__isSticky]: sticky,
    [styles.TicketAttributeHeader__isAttached]: isHeaderAttached,
    [styles.TicketAttributeHeader__isCollapsed]: isHeaderCollapsed,
  })

  const readOnly = useContext(ReadOnlyContext)

  useEffect(() => {
    const scrollOffset = app.viewport === 'sm' ? 130 : 70

    if (sticky && scroll) {
      if (scroll.direction === 'bottom') {
        if (scroll.scroll > scrollOffset) {
          setTransformValue(scroll.scroll - 15)
          if (!isHeaderAttached) {
            setHeaderAttached(true)
          }
          if (!isHeaderCollapsed) {
            setHeaderCollapsed(true)
          }
        }
      }

      if (scroll.direction === 'top') {
        if (scroll.scroll < 15) {
          if (isHeaderAttached) {
            setHeaderAttached(false)
          }
          setTransformValue(0)
        } else {
          setTransformValue(scroll.scroll - 15)
        }
        setHeaderCollapsed(false)
      }
    }
  }, [scroll, sticky])

  const ref = useRef(null)
  const leftBlockRef = useRef(null)
  const size = useSize(leftBlockRef)

  const renderInboxPill = () => {
    let inbox = app.inboxes[0]
    if (ticket.inbox_id) {
      inbox = app.inboxes.find(x => x.id === ticket.inbox_id)
    }
    return <InboxPill model={inbox} />
  }

  const renderTicketNumberPill = () => {
    const type = ticket.type || app.account.defaultTicketType
    return <TextWithIconPill iconId={`ticketType_${type}_s`} text={number ? `#${number}` : ''} />
  }

  const renderUserPill = () => {
    let userPill = <UserPill unassigned />
    if (ticket.user_id) {
      userPill = <UserPill model={ticket.user} />
    }
    return <div className={styles.TicketAttributeHeader_userPill}>{userPill}</div>
  }

  const expandHeader = e => {
    e.stopPropagation()
    const condition = isHeaderCollapsed && e.target.className.includes(styles.TicketAttributeHeader)
    if (condition) {
      setHeaderCollapsed(false)
    }
  }

  const style = {
    transform: `translateY(${transformValue}px)`,
  }

  return (
    <header className={cssClass} ref={ref} onClick={expandHeader} style={style}>
      <div className={styles.TicketAttributeHeader_left} ref={leftBlockRef}>
        <div className={styles.TicketAttributeHeader_subject}>
          <TextEditable
            readOnly={readOnly}
            inputMode={isDraft}
            placeholder='Set Subject'
            value={ticket.subject}
            onChange={e => onChangeTicketSubject(e, ticket)}
            onBlur={e => ticket.setSubject(e.target.value)}
          />
        </div>
        {size ? <TicketLabels ticket={ticket} readOnly={readOnly} size={size} /> : null}
      </div>
      <div className={styles.TicketAttributeHeader_right}>
        <div className={styles.TicketAttributeHeader_info}>
          {renderInboxPill()}
          {renderTicketNumberPill()}
        </div>
        <div className={styles.TicketAttributeHeader_state}>
          {renderUserPill()}
          <TicketStatePill state={ticket.state} snoozedUntil={ticket.snoozed_until} />
        </div>
      </div>
    </header>
  )
})
