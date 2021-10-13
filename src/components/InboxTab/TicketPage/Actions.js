import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import classNames from 'classnames'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { DropdownItemsList } from 'components/Dropdown/DropdownItemsList'
import { DropdownItem } from 'components/Dropdown/DropdownItem'
import { StateDropdown } from 'components/Dropdown/StateDropdown'
import { SnoozeDropdown } from 'components/Dropdown/SnoozeDropdown'
import { UserDropdown } from 'components/Dropdown/UserDropdown'
import { TicketDropdown } from 'components/Dropdown/TicketDropdown'
import { LabelSearchDropdown } from 'components/Dropdown/LabelSearchDropdown'

import styles from './Actions.scss'

export const Actions = observer(() => {
  const isDropdownInline = app.viewport !== 'xs'

  return (
    <div className={styles.Actions}>
      {app.ui.inboxTab.activeFolder ? (
        <div className={classNames(styles.Actions_button, styles.Actions_button__isFirst)}>
          <ButtonWithIcon
            iconId='ui_back_m'
            onClick={() => app.router.navigate('inbox.folder', { id: app.ui.inboxTab.activeFolder.id })}
          />
        </div>
      ) : null}
      <div
        className={classNames(styles.Actions_button, {
          [styles.Actions_button__isFirst]: !app.ui.inboxTab.activeFolder,
        })}
      >
        <Dropdown
          position='bottomLeft'
          inline={isDropdownInline}
          trigger={isActive => <ButtonWithIcon iconId='action_state_m' isActive={isActive} />}
        >
          {(setOpen, inModal) => (
            <StateDropdown onClick={state => app.ui.inboxTab.ticket.setState(state)} inModal={inModal} />
          )}
        </Dropdown>
      </div>
      <div className={styles.Actions_button}>
        <Dropdown
          position='bottomLeft'
          inline={isDropdownInline}
          trigger={isActive => <ButtonWithIcon iconId='action_snooze_m' isActive={isActive} />}
        >
          {(setOpen, inModal) => (
            <SnoozeDropdown
              onClick={snoozeUntil => app.ui.inboxTab.ticket.setState('snoozed', snoozeUntil)}
              inModal={inModal}
            />
          )}
        </Dropdown>
      </div>
      <div className={styles.Actions_button}>
        <Dropdown
          inline={isDropdownInline}
          position='bottomLeft'
          trigger={isActive => <ButtonWithIcon iconId='action_assign_m' isActive={isActive} />}
        >
          {(setOpen, inModal) => (
            <UserDropdown
              onClick={userId => app.ui.inboxTab.ticket.assignUser(userId)}
              inboxId={app.ui.inboxTab.ticket.inbox_id}
              inModal={inModal}
            />
          )}
        </Dropdown>
      </div>
      <div className={styles.Actions_button}>
        <LabelSearchDropdown
          trigger={isActive => <ButtonWithIcon iconId='action_label_m' isActive={isActive} />}
          context={{ tickets: [app.ui.inboxTab.ticket] }}
          onAddLabelClick={labelId => app.ui.inboxTab.ticket.addLabel(labelId)}
          onRemoveLabelClick={labelId => app.ui.inboxTab.ticket.removeLabel(labelId)}
        />
      </div>
      <div className={styles.Actions_button}>
        <Dropdown
          position='bottomLeft'
          inline={isDropdownInline}
          trigger={isActive => <ButtonWithIcon iconId='action_macro_m' isActive={isActive} />}
        >
          {(setOpen, inModal) => (
            <DropdownItemsList fullWidth={inModal}>
              <DropdownItem text>Escalate to management</DropdownItem>
              <DropdownItem text>Macros title</DropdownItem>
            </DropdownItemsList>
          )}
        </Dropdown>
      </div>
      <div className={styles.Actions_button}>
        <TicketDropdown ticket={app.ui.inboxTab.ticket} />
      </div>
    </div>
  )
})
