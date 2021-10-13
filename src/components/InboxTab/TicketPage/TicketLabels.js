import React, { useRef, useLayoutEffect, useState } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import { usePrevious } from 'components/hooks/usePrevious'
import { Icon } from 'components/icons/Icon'
import { LabelSearchDropdown } from 'components/Dropdown/LabelSearchDropdown'
import { LabelsList } from 'components/LabelsList/LabelsList'

import styles from './TicketLabels.scss'

export const TicketLabels = observer(({ ticket, readOnly, size }) => {
  const label_ids = ticket.label_ids || []
  const ref = useRef(null)
  const noLabelsAttached = label_ids.length === 0
  const previousWidth = usePrevious(size.width)
  const previousLabelCount = usePrevious(label_ids.length)

  const [itemsToRemove, setItemsToRemove] = useState(0)

  const handleLabelsInPopup = (innerWidth, outerWidth) => {
    if (previousWidth !== size.width || previousLabelCount !== label_ids.length) {
      setItemsToRemove(0)
    }
    if (innerWidth > outerWidth) {
      setItemsToRemove(itemsToRemove + 1)
    }
  }

  useLayoutEffect(() => {
    if (ref.current) {
      const innerWidth = ref.current.clientWidth
      handleLabelsInPopup(innerWidth, size.width)
    }
  }, [itemsToRemove, label_ids.length, size.width])

  const ticketLabels = app.labels.filter(label => label_ids.find(x => x === label.id))
  const visibleItems = itemsToRemove ? ticketLabels.slice(0, -itemsToRemove) : ticketLabels
  const restItems = itemsToRemove ? ticketLabels.slice(-itemsToRemove) : []

  const buttonClass = classNames(styles.TicketLabels_addButton, {
    [styles.TicketLabels_addButton__small]: !noLabelsAttached,
  })

  const renderNoLabels = () => {
    if (noLabelsAttached) {
      return <div className={styles.TicketLabels_noLabel}>No labels</div>
    }
    return null
  }

  const renderAddButton = () => {
    return (
      <LabelSearchDropdown
        trigger={
          <button type='button' className={buttonClass}>
            <Icon id='ui_add_xs' className={styles.TicketLabels_addButtonIcon} />
            <span className={styles.TicketLabels_addButtonText}>Add label...</span>
          </button>
        }
        context={{ tickets: [ticket] }}
        onAddLabelClick={labelId => ticket.addLabel(labelId)}
        onRemoveLabelClick={labelId => ticket.removeLabel(labelId)}
      />
    )
  }

  return (
    <div className={styles.TicketLabels}>
      <div className={styles.TicketLabels_inner} ref={ref}>
        {readOnly ? renderNoLabels() : renderAddButton()}
        <LabelsList
          ticket={ticket}
          visibleItems={visibleItems}
          restItems={restItems}
          labelCustomClass={styles.TicketLabels_label}
          size='small'
          onClose={readOnly ? null : id => ticket.removeLabel(id)}
        />
      </div>
    </div>
  )
})
