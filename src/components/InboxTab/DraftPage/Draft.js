import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { ReplyBox } from 'components/InboxTab/TicketPage/ReplyBox'
import { InputSelect } from 'components/Forms/InputSelect'
import { TextButtonWithIcon } from 'components/Button/TextButtonWithIcon'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { Input } from 'components/Forms/Input'
import { TicketAttributeHeader } from 'components/InboxTab/TicketAttributeHeader/TicketAttributeHeader'
import { Ticket } from 'models/core/Ticket'
import { Message } from 'models/core/Message'
import { modes } from './modes'
import { TypeSwitcher } from './TypeSwitcher'
import { CreateCustomer } from './CreateCustomer'
import { CustomerSearch } from './CustomerSearch'
import styles from './Draft.scss'

export const Draft = observer(({ onSelectCustomer, onCreateCustomer }) => {
  const { customer, type } = app.ui.inboxTab.draft
  const [createCustomerMode, setCreateCustomerMode] = useState(false)
  const mode = app.ui.inboxTab.draftMode
  const bodyPrefix = mode === modes.split ? `Created by splitting ticket #${app.ui.inboxTab.ticket.number}. ` : ''

  const renderMessage = () => {
    if (mode === modes.draft) return null

    const text =
      mode === modes.forward ? (
        <>
          A new ticket will be created that includes all public replies on ticket{' '}
          <span className={styles.Draft_messageTicket}>#{app.ui.inboxTab.ticket.number}</span>.
        </>
      ) : (
        'The selected customer reply will be copied over to this new ticket. No changes will be made to the original ticket.'
      )

    return <div className={styles.Draft_message}>{text}</div>
  }

  const renderTypeSwitcher = () => {
    if (mode !== modes.draft) return null
    return (
      <div className={styles.Draft_row}>
        <TypeSwitcher />
      </div>
    )
  }

  const renderCustomerRow = () => {
    let inputBlock
    if (mode === modes.split && customer) {
      inputBlock = <Input disabled value={`${customer.first_name} ${customer.last_name}`} />
    } else {
      inputBlock = createCustomerMode ? (
        <CreateCustomer onClose={() => setCreateCustomerMode(false)} onClick={onCreateCustomer} />
      ) : (
        <CustomerSearch model={app.ui.inboxTab.draft} onSelect={onSelectCustomer} />
      )
    }

    const buttonBlock =
      !createCustomerMode && mode !== modes.split ? (
        <TextButtonWithIcon
          onClick={() => setCreateCustomerMode(true)}
          customClass={styles.Draft_createCustomer}
          icon='ui_add2_xs'
          type='primaryText'
        >
          Create new customer
        </TextButtonWithIcon>
      ) : null

    return (
      <div className={styles.Draft_row}>
        <div className={styles.Draft_rowLabel}>Customer</div>
        <div className={styles.Draft_rowInput}>{inputBlock}</div>
        {buttonBlock}
      </div>
    )
  }

  const inboxValue = () => {
    const { inbox_id } = app.ui.inboxTab.draft
    if (!inbox_id) return ''
    return app.inboxes.find(x => x.id === inbox_id).name
  }

  const getReplyBoxMode = () => {
    switch (true) {
      case mode === modes.forward:
        return Message.TYPES.reply
      case mode === modes.split:
        return Message.TYPES.note
      default:
        return type === Ticket.TYPES.phone ? Message.TYPES.note : Message.TYPES.reply
    }
  }

  return (
    <div className={styles.Draft}>
      <TicketAttributeHeader isDraft ticket={app.ui.inboxTab.draft} />

      {renderMessage()}

      <div className={styles.Draft_row}>
        <div className={styles.Draft_rowLabel}>Inbox</div>
        <div className={styles.Draft_rowInput}>
          <Dropdown wide position='bottomLeft' trigger={<InputSelect value={inboxValue()} onChange={() => {}} />}>
            <DropdownItemsList>
              {app.inboxes.map(({ name, id }) => (
                <DropdownItem text key={name} onClick={() => app.ui.inboxTab.draft.moveToInbox(id)}>
                  {name}
                </DropdownItem>
              ))}
            </DropdownItemsList>
          </Dropdown>
        </div>
      </div>

      {renderCustomerRow()}
      {renderTypeSwitcher()}

      <ReplyBox
        permanent
        ticket={app.ui.inboxTab.draft}
        customer={customer}
        bodyPrefix={bodyPrefix}
        mode={getReplyBoxMode()}
        message={app.ui.inboxTab.draft.draft}
        onClose={() => {}}
      />
    </div>
  )
})
