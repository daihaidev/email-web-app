import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { generateId } from 'components/helpers'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { StateDropdown } from 'components/Dropdown/StateDropdown'
import { SnoozeDropdown } from 'components/Dropdown/SnoozeDropdown'
import { UserDropdown } from 'components/Dropdown/UserDropdown'
import { TicketDropdown } from 'components/Dropdown/TicketDropdown'
import styles from './BulkActions.scss'
import { LabelSearchDropdown } from '../../Dropdown/LabelSearchDropdown'

export const BulkActions = observer(({ folder }) => {
  const checkboxId = `bulkActionsCheckbox${generateId()}`
  const btnGroupOpened = folder.checkedTickets.length > 0

  return (
    <div className={styles.BulkActions}>
      {/* TODO: REFACTOR CHECKBOX IF I GOT CONFIRMATION */}
      <div className={styles.BulkActions_checkbox}>
        <input
          type='checkbox'
          id={checkboxId}
          className={styles.BulkActions_checkboxInput}
          checked={folder.checkedTickets.length === folder.tickets.length}
          onChange={() => folder.toggleCheckAllTickets()}
        />
        <label htmlFor={checkboxId} className={styles.BulkActions_checkboxLabel}>
          <Icon id='ui_checkMark_xs' className={styles.BulkActions_tickIcon} />
        </label>
      </div>
      <div
        className={classNames(styles.BulkActions_transitionGroup, {
          [styles.BulkActions_transitionGroup__opened]: btnGroupOpened,
          [styles.BulkActions_transitionGroup__closed]: !btnGroupOpened,
        })}
      >
        <div
          className={classNames(styles.BulkActions_btnGroup, {
            [styles.BulkActions_btnGroup__opened]: btnGroupOpened,
          })}
        >
          <Dropdown
            position='bottomLeft'
            trigger={isActive => <ButtonWithIcon iconId='action_state_m' isActive={isActive} />}
          >
            <StateDropdown onClick={state => folder.setStateBulk(state)} />
          </Dropdown>
          <Dropdown
            position='bottomLeft'
            trigger={isActive => <ButtonWithIcon iconId='action_snooze_m' isActive={isActive} />}
          >
            <SnoozeDropdown onClick={snoozeUntil => folder.setStateBulk('snoozed', snoozeUntil)} />
          </Dropdown>
          <Dropdown
            position='bottomLeft'
            trigger={isActive => <ButtonWithIcon iconId='action_assign_m' isActive={isActive} />}
          >
            <UserDropdown inboxId={folder.checkedTicketsInboxId} onClick={userId => folder.assignUserBulk(userId)} />
          </Dropdown>
          <LabelSearchDropdown
            trigger={isActive => <ButtonWithIcon iconId='action_label_m' isActive={isActive} />}
            context={{ tickets: folder.checkedTickets }}
            onAddLabelClick={labelId => folder.addLabelBulk(labelId)}
            onRemoveLabelClick={labelId => folder.removeLabelBulk(labelId)}
          />
          <Dropdown
            position='bottomLeft'
            trigger={isActive => <ButtonWithIcon iconId='action_macro_m' isActive={isActive} />}
          >
            <DropdownItemsList>
              <DropdownItem text>Escalate to management</DropdownItem>
              <DropdownItem text>Macros title</DropdownItem>
            </DropdownItemsList>
          </Dropdown>
          <TicketDropdown folder={folder} />
        </div>
      </div>
    </div>
  )
})
