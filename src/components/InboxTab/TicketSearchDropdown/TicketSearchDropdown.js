import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownSearch } from 'components/Dropdown/DropdownSearch'
import { TicketSummary } from 'components/InboxTab/TicketSummary/TicketSummary'
import { DropdownNoItems } from 'components/Dropdown/DropdownNoItems'
import styles from './TicketSearchDropdown.scss'

export const TicketSearchDropdown = observer(() => {
  const renderSearchResults = () => {
    const { results, query } = app.ui.inboxTab.ticketSearch

    if (!results.length) {
      return <DropdownNoItems text='No matches' />
    }

    if (!query) {
      return <div>No query</div>
    }

    return results.slice(0, results.length).map(item => {
      return (
        <div className={styles.TicketSearchDropdown_resultsItem} key={item.id}>
          <TicketSummary model={item} />
        </div>
      )
    })
  }

  const onChangeHandler = e => {
    app.ui.inboxTab.ticketSearch.query = e.target.value
  }

  return (
    <Dropdown
      customInnerClass={styles.TicketSearchDropdown__dropdownInner}
      trigger={<ButtonWithIcon iconId='ui_search_m' />}
    >
      <div className={styles.TicketSearchDropdown__content}>
        <DropdownSearch
          placeholder='Customer'
          onChange={onChangeHandler}
          customClass={styles.TicketSearchDropdown_input}
        />
      </div>
      <div className={styles.TicketSearchDropdown_results}>
        <div className={styles.TicketSearchDropdown_resultsScroll}>{renderSearchResults()}</div>
      </div>
    </Dropdown>
  )
})
