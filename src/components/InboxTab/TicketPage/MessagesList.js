import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react'

import { MultiCollapseButton } from 'components/Button/MultiCollapseButton'
import { ReadOnlyContext } from 'components/ReadOnlyContext'
import { Message } from 'models/core/Message'
import { Note } from './Note'
import { EmailReply } from './EmailReply'
import { ReplyBox } from './ReplyBox'
import { AuditEvent } from './AuditEvent'

const MIN_COLLAPSE_LENGTH = 5
const filterMessagesCallback = m => m.type !== Message.TYPES.event && !m.isDraft

export const MessagesList = observer(({ ticket, replyBoxVisible }) => {
  const readOnly = useContext(ReadOnlyContext)

  let { messages } = ticket

  if (readOnly) {
    messages = messages.filter(m => !m.isDraft)
  }

  const onlyMessages = messages.filter(filterMessagesCallback)

  if (onlyMessages.length > 0) {
    onlyMessages[onlyMessages.length - 1].collapsed = false
  }

  const [collapsed, setCollapsed] = useState(onlyMessages.length >= MIN_COLLAPSE_LENGTH)

  const applyDraftTopShadow = (item, prevEl) => {
    if (!item.isDraft || item.collapsed || item.editing) {
      return false
    }
    if (!prevEl) {
      return false
    }
    return !prevEl.isDraft || (prevEl.isDraft && prevEl.collapsed)
  }

  const applyDraftBottomShadow = (item, nextEl) => {
    if (!item.isDraft || item.collapsed || item.editing) {
      return false
    }
    if (!nextEl) {
      return !replyBoxVisible
    }
    return !nextEl.isDraft || (nextEl.isDraft && nextEl.collapsed)
  }

  const hideBottomBorder = (item, nextEl) => {
    return !!((!item.isDraft || (item.isDraft && item.collapsed)) && nextEl && nextEl.isDraft && !nextEl.collapsed)
  }

  const hideHoverShadowTop = prevEl => prevEl && prevEl.isDraft && !prevEl.collapsed

  const hideHoverShadowBottom = nextEl => nextEl && nextEl.isDraft && !nextEl.collapsed

  const renderMessages = (msgs, hideTopHoverShadow) => {
    if (!msgs.length) return null
    return msgs.map((m, i, arr) => {
      const nextEl = arr[i + 1]
      const prevEl = arr[i - 1]
      const shouldApplyBottomShadow = applyDraftBottomShadow(m, nextEl)

      const styling = {
        draftTopShadow: applyDraftTopShadow(m, prevEl),
        draftBottomShadow: shouldApplyBottomShadow,
        hideBorder: shouldApplyBottomShadow || hideBottomBorder(m, nextEl),
        hideHoverShadowTop: hideTopHoverShadow || hideHoverShadowTop(prevEl),
        hideHoverShadowBottom: hideHoverShadowBottom(nextEl),
      }

      switch (m.type) {
        case Message.TYPES.note:
          return m.editing ? (
            <ReplyBox
              key={m.id}
              ticket={ticket}
              customer={ticket.customer}
              mode={Message.TYPES.note}
              message={m}
              onClose={() => {
                m.editing = false
              }}
            />
          ) : (
            <Note key={m.id} styling={styling} message={m} readOnly={readOnly} />
          )
        case Message.TYPES.reply:
          return <EmailReply styling={styling} key={m.id} message={m} readOnly={readOnly} />
        case Message.TYPES.event:
          return <AuditEvent styling={styling} key={m.id} event={m} />
        default:
          return null
      }
    })
  }

  if (collapsed) {
    const secondLastMessageId = onlyMessages[onlyMessages.length - 2].id
    const indexOfSecondLastMessage = messages.findIndex(m => m.id === secondLastMessageId)

    const firstMessage = messages.slice(0, 1)
    const collapsedMessages = messages.slice(1, indexOfSecondLastMessage)
    const collapsedMessagesLength = collapsedMessages.filter(filterMessagesCallback).length
    const restMessages = messages.slice(indexOfSecondLastMessage)

    return (
      <>
        {renderMessages(firstMessage, true)}
        {!collapsed ? (
          renderMessages(collapsedMessages)
        ) : (
          <MultiCollapseButton
            onClick={() => setCollapsed(false)}
            text={`${collapsedMessagesLength} collapsed messages`}
          />
        )}
        {renderMessages(restMessages)}
      </>
    )
  }
  return <>{renderMessages(messages)}</>
})
