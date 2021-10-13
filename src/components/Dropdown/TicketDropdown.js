import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { app } from 'app'
import { Dropdown } from './Dropdown'
import { ButtonWithIcon } from '../Button/ButtonWithIcon'
import { DropdownModalMobile } from './DropdownModalMobile'
import { DropdownItem } from './DropdownItem'
import { DropdownDivider } from './DropdownDivider'
import { DropdownItemLabeledIcon } from './DropdownItemLabeledIcon'
import { DropdownItemsList } from './DropdownItemsList'

export const TicketDropdown = observer(props => {
  const isMobile = app.viewport === 'xs'
  const dropdownPosition = isMobile ? 'bottomRight' : 'bottomLeft'

  const [modalOpen, setModalOpen] = useState(false)

  const modalContent = {}

  const renderSubMenu = (menuItem, inModal) => (
    <DropdownItemsList fullWidth={inModal}>
      {menuItem.submenu.map(item => (
        <DropdownItem text key={item.label} onClick={item.onClick} close>
          {item.label}
        </DropdownItem>
      ))}
    </DropdownItemsList>
  )

  const renderMenu = () => {
    let menuItems = [
      {
        icon: 'action_spam_m',
        label: 'Mark as Spam',
        onClick: () => (props.ticket ? props.ticket.setState('spam') : props.folder.setStateBulk('spam')),
      },
      {
        icon: 'action_trash_m',
        label: 'Send to Trash',
        onClick: () => (props.ticket ? props.ticket.setState('trash') : props.folder.setStateBulk('trash')),
      },
      {
        icon: 'action_archive_m',
        label: 'Archive',
        onClick: () => (props.ticket ? props.ticket.setState('archived') : props.folder.setStateBulk('archived')),
      },
      {
        icon: 'action_inbox_m',
        label: 'Move to inbox',
        submenu: app.activeInboxes.map(inbox => ({
          label: inbox.name,
          onClick: () => (props.ticket ? props.ticket.moveToInbox(inbox.id) : props.folder.moveToInboxBulk(inbox.id)),
        })),
        onClick: () => isMobile && setModalOpen(true),
      },
    ]

    if (props.ticket) {
      menuItems = menuItems.concat([
        {
          separator: true,
          label: 'separator-1',
        },
        {
          icon: 'customer_history_m',
          label: app.ui.inboxTab.ticket.activityShown ? 'Hide Activity' : 'Show activity',
          onClick: () =>
            app.ui.inboxTab.ticket.activityShown
              ? app.ui.inboxTab.ticket.hideActivity()
              : app.ui.inboxTab.ticket.showActivity(),
        },
        {
          icon: 'action_forward_m',
          label: 'Forward',
          onClick: () => app.router.navigate('inbox.forward', { id: 'new', ticket_id: app.ui.inboxTab.ticket.id }),
        },
        {
          icon: 'action_merge_m',
          label: 'Merge',
          onClick: () => {
            app.ui.inboxTab.ticketsModal.setMergeMode()
            app.ui.inboxTab.ticketsModal.setVisible(true)
          },
        },
        {
          separator: true,
          label: 'separator-2',
        },
        {
          icon: 'action_redact_m',
          label: 'Redact text',
        },
      ])
    }

    return (
      <>
        {menuItems.map(menuItem => {
          if (menuItem.hidden) {
            return null
          }

          if (menuItem.separator) {
            return <DropdownDivider key={menuItem.label} />
          }

          if (menuItem.submenu) {
            if (isMobile) {
              // menuItem.icon used as id there, should be replaced by id
              modalContent[menuItem.label] = renderSubMenu(menuItem, true)
              return (
                <DropdownItemLabeledIcon
                  submenu
                  key={menuItem.label}
                  iconId={menuItem.icon}
                  label={menuItem.label}
                  onClick={menuItem.onClick}
                />
              )
            }
            return (
              <DropdownItem key={menuItem.label} onClick={props.onClick}>
                <Dropdown
                  submenu
                  trigger={
                    <DropdownItemLabeledIcon
                      submenu
                      key={menuItem.label}
                      iconId={menuItem.icon}
                      label={menuItem.label}
                      onClick={menuItem.onClick}
                    />
                  }
                >
                  {renderSubMenu(menuItem)}
                </Dropdown>
              </DropdownItem>
            )
          }

          return (
            <DropdownItemLabeledIcon
              close={menuItem.close}
              iconId={menuItem.icon}
              label={menuItem.label}
              key={menuItem.label}
              onClick={menuItem.onClick}
            />
          )
        })}
      </>
    )
  }

  return (
    <>
      <Dropdown
        position={dropdownPosition}
        trigger={isActive => <ButtonWithIcon touchWidth={40} iconId='ui_more_m' isActive={isActive} />}
      >
        <DropdownItemsList>{renderMenu()}</DropdownItemsList>
      </Dropdown>
      {
        // Should be after renderMenu() call, because modalsContent.action_inbox_m is set in renderMenu
      }
      {modalOpen ? (
        <DropdownModalMobile
          onClose={e => {
            e.stopPropagation()
            setModalOpen(false)
          }}
        >
          {modalContent['Move to inbox']}
        </DropdownModalMobile>
      ) : null}
    </>
  )
})
