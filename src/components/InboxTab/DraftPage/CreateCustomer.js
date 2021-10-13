import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { Input } from 'components/Forms/Input'
import { TextButton } from 'components/Button/TextButton'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'

import styles from './CreateCustomer.scss'

export const CreateCustomer = observer(({ onClose, onClick }) => {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const handleChange = (field, e) => {
    setCustomer({
      ...customer,
      [field]: e.target.value,
    })
  }

  const handleClick = () => {
    if (onClick) onClick(customer)
    // TODO After click, we don't close as customer update can return with error
    onClose()
  }

  return (
    <div className={styles.CreateCustomer}>
      <div className={styles.CreateCustomer_close}>
        <ButtonWithIcon iconId='action_close_xs' size='small' onClick={onClose} />
      </div>
      <div className={styles.CreateCustomer_row}>
        <label className={styles.CreateCustomer_label}>Name</label>
        <Input value={customer.name} onChange={e => handleChange('name', e)} />
      </div>
      <div className={styles.CreateCustomer_row}>
        <label className={styles.CreateCustomer_label}>Phone</label>
        <Input value={customer.phone} onChange={e => handleChange('phone', e)} />
      </div>
      <div className={styles.CreateCustomer_row}>
        <label className={styles.CreateCustomer_label}>Email</label>
        <Input type='email' value={customer.email} onChange={e => handleChange('email', e)} />
      </div>
      <div className={styles.CreateCustomer_row}>
        <TextButton type='primary' block onClick={handleClick}>
          Save customer
        </TextButton>
      </div>
    </div>
  )
})
