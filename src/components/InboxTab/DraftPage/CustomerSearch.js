import React, { useState, useEffect } from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { app } from 'app'

import { InputSelect } from 'components/Forms/InputSelect'
import { Avatar } from 'components/Avatar/Avatar'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import styles from './CustomerSearch.scss'

const onChangeQuery = action('changeQuery', value => {
  // console.log('setting query in GUI to', value)
  app.ui.inboxTab.customerSearch.query = value
})

export const CustomerSearch = observer(({ onSelect, model }) => {
  const { query, results } = app.ui.inboxTab.customerSearch
  const { customer } = model

  const [focused, setFocused] = useState(false)

  useEffect(() => {
    onChangeQuery('')
  }, [model])

  useEffect(() => {
    if (customer) {
      const q = focused ? '' : `${customer.name}`
      onChangeQuery(q)
    }
  }, [focused, customer])

  const renderResults = () =>
    results.map(cust => {
      const { first_name, last_name, id, primaryContact } = cust

      return (
        <DropdownItem key={id} customClass={styles.CustomerSearch_customer} onClick={() => onSelect(cust)} close>
          <Avatar size='xxsmall' model={cust} />
          <div className={styles.CustomerSearch_customerName}>
            {first_name} {last_name}
          </div>
          {`<${primaryContact}>`}
        </DropdownItem>
      )
    })

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  return (
    <Dropdown
      position='bottomLeft'
      wide
      trigger={
        <InputSelect
          search
          onChange={e => onChangeQuery(e.target.value)}
          value={query}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      }
    >
      <DropdownItemsList>{renderResults()}</DropdownItemsList>
    </Dropdown>
  )
})
