import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { Customer } from 'models/core/Customer'
import { Modal } from 'components/Modal/Modal'
import { TextButton } from 'components/Button/TextButton'
import { Input } from 'components/Forms/Input'
import { TextArea } from 'components/Forms/TextArea'
import { InputGroup } from 'components/Forms/InputGroup'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Avatar } from 'components/Avatar/Avatar'

import styles from './CustomerProfileEditor.scss'

export const CustomerProfileEditor = observer(({ customer, onClose, onSave }) => {
  const onCancel = () => {
    onClose()
  }

  const addField = type => customer.addContactField(type)

  const handleEdit = (e, i, type) => {
    customer.setContactField(type, i, e.target.value)
  }

  const handleSingleEdit = (e, key) => {
    customer.setField(key, e.target.value)
  }

  const renderMainInfo = () => {
    return (
      <div className={styles.CustomerProfileEditor_mainInfo}>
        <div className={styles.CustomerProfileEditor_image}>
          <Avatar model={customer} size='large' />
        </div>
        <div className={styles.CustomerProfileEditor_firstName}>
          <Input
            placeholder='First name'
            value={customer.first_name}
            onChange={e => handleSingleEdit(e, Customer.fieldTypes.firstName)}
          />
        </div>
        <div className={styles.CustomerProfileEditor_lastName}>
          <Input
            placeholder='Last name'
            value={customer.last_name}
            onChange={e => handleSingleEdit(e, Customer.fieldTypes.lastName)}
          />
        </div>
      </div>
    )
  }

  const renderAddButton = addFieldCallback => (
    <ButtonWithIcon touchWidth={42} touchHeight={42} iconId='ui_add_xs' size='small' onClick={addFieldCallback} />
  )

  const renderNotes = () => (
    <div className={styles.CustomerProfileEditor_field}>
      <InputGroup iconId='ticket_note_s' label='Notes'>
        <InputGroup.Field>
          <TextArea value={customer.notes} onChange={e => handleSingleEdit(e, Customer.fieldTypes.notes)} />
        </InputGroup.Field>
      </InputGroup>
    </div>
  )

  const renderEmails = () => (
    <div className={styles.CustomerProfileEditor_field}>
      <InputGroup
        iconId='ticketType_email_s'
        label='Email'
        headerSlot={renderAddButton(() => addField(Customer.fieldTypes.emails))}
      >
        {customer.emails.map((email, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <InputGroup.Field key={i}>
            <Input type='email' value={email} onChange={e => handleEdit(e, i, Customer.fieldTypes.emails)} />
          </InputGroup.Field>
        ))}
      </InputGroup>
    </div>
  )

  const renderPhones = () => (
    <div className={styles.CustomerProfileEditor_field}>
      <InputGroup
        iconId='ticketType_phone_s'
        label='Phone'
        headerSlot={renderAddButton(() => addField(Customer.fieldTypes.phones))}
      >
        {customer.phones.map((phone, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <InputGroup.Field key={i}>
            <Input type='text' value={phone} onChange={e => handleEdit(e, i, Customer.fieldTypes.phones)} />
          </InputGroup.Field>
        ))}
      </InputGroup>
    </div>
  )

  const renderTwitters = () => (
    <div className={styles.CustomerProfileEditor_field}>
      <InputGroup
        iconId='ticketType_twitter_s'
        label='Twitter'
        headerSlot={renderAddButton(() => addField(Customer.fieldTypes.twitters))}
      >
        {customer.twitters.map((twitter, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <InputGroup.Field key={i}>
            <Input type='text' value={twitter} onChange={e => handleEdit(e, i, Customer.fieldTypes.twitters)} />
          </InputGroup.Field>
        ))}
      </InputGroup>
    </div>
  )

  const renderErrors = () => (
    <div>
      {Object.keys(customer.errors).map(field => (
        <div key={field}>
          {field}: {customer.errors[field]}
        </div>
      ))}
    </div>
  )

  return (
    <Modal isVisible={app.ui.inboxTab.customerProfileEditorOpen} onClose={onClose}>
      <Modal.Header title='Edit customer record'>
        <div className={styles.CustomerProfileEditor_buttons}>
          <TextButton>Merge customer</TextButton>
          <div className={styles.CustomerProfileEditor_divider} />
          <ButtonWithIcon iconId='action_close_m' onClick={onClose} />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.CustomerProfileEditor_body}>
          {renderMainInfo()}
          {renderNotes()}
          {renderEmails()}
          {renderPhones()}
          {renderTwitters()}
          {renderErrors()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.CustomerProfileEditor_footer}>
          <TextButton onClick={onCancel} size='large' type='primaryText'>
            Cancel
          </TextButton>
          <TextButton onClick={() => onSave(customer)} size='large' type='primary'>
            Save changes
          </TextButton>
        </div>
      </Modal.Footer>
    </Modal>
  )
})
