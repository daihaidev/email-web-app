import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { LabelPill } from 'components/Pill/LabelPill'
import { ContentScroll } from 'components/ContentScroll/ContentScroll'
import { Dropdown } from './Dropdown'
import { DropdownSearch } from './DropdownSearch'
import { DropdownNoItems } from './DropdownNoItems'

import styles from './LabelSearchDropdown.scss'

export const LabelSearchDropdown = observer(({ trigger, context, onAddLabelClick, onRemoveLabelClick }) => {
  const isDropdownInline = app.viewport !== 'xs'

  const onQueryChange = e => {
    app.ui.inboxTab.labelSearch.query = e.target.value
  }

  const handleOpen = () => {
    app.ui.inboxTab.labelSearch.context = {
      tickets: context.tickets,
    }
  }

  const handleClose = () => {
    app.ui.inboxTab.labelSearch.query = ''
  }

  const { query, results } = app.ui.inboxTab.labelSearch

  const renderSearchResults = () => {
    if (query && !results.length) {
      return <DropdownNoItems text='No matches' />
    }

    const output = results.map(item => {
      const labelObject = app.labels.find(l => l.id === item.id)
      return {
        ...item,
        ...labelObject,
      }
    })

    return output.map(item => {
      return (
        <LabelSearchDropdown.Label key={item.id}>
          <LabelPill
            size='small'
            model={item}
            selected={item.selected}
            isSuggestion={item.suggestion}
            onClick={() => {
              if (item.selected) {
                onRemoveLabelClick(item.id)
              } else {
                onAddLabelClick(item.id)
              }
            }}
          />
        </LabelSearchDropdown.Label>
      )
    })
  }

  return (
    <Dropdown
      position='bottomLeft'
      inline={isDropdownInline}
      trigger={trigger}
      modalTitle='Add labels'
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <div>
        <div className={styles.LabelSearchDropdown_input}>
          <DropdownSearch searchPos='top' placeholder='Label...' onChange={onQueryChange} />
        </div>
        <LabelSearchDropdown.Content trigger={results.length}>{renderSearchResults()}</LabelSearchDropdown.Content>
      </div>
    </Dropdown>
  )
})

LabelSearchDropdown.Content = observer(({ trigger, children }) => (
  <div className={styles.LabelSearchDropdown}>
    <ContentScroll height={255} trigger={trigger}>
      <div className={styles.LabelSearchDropdown_content}>{children}</div>
    </ContentScroll>
  </div>
))

LabelSearchDropdown.Label = observer(({ children }) => (
  <div className={styles.LabelSearchDropdown_item}>{children}</div>
))
