import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import { Avatar } from 'components/Avatar/Avatar'
import { ButtonMore } from 'components/Button/ButtonMore'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { AlertBox } from 'components/AlertBox/AlertBox'
import { DeliveryFailure } from 'components/DeliveryFailure/DeliveryFailure'
import { TextWithIconPill } from 'components/Pill/TextWithIconPill'
import { ButtonActions } from 'components/Button/ButtonActions'
import { TimeFormat } from 'components/TimeFormat'
import styles from './Message.scss'

export const Message = observer(({ message, slotFrom, children, actions, styling, readOnly }) => {
  const { user_id, avatar_url, from_name, collapsed, isDraft } = message

  const { draftTopShadow, draftBottomShadow, hideBorder, hideHoverShadowTop, hideHoverShadowBottom } = styling

  const user = app.users.find(x => x.id === user_id)
  const messageCss = classNames(styles.Message, {
    [styles.Message__isExpanded]: !collapsed,
    [styles.Message__isDraft]: isDraft,
    [styles.Message__withTopShadow]: draftTopShadow,
    [styles.Message__withBottomShadow]: draftBottomShadow,
    [styles.Message__withHiddenBorder]: hideBorder,
    [styles.Message__withHiddenHoverTop]: hideHoverShadowTop,
    [styles.Message__withHiddenHoverBottom]: hideHoverShadowBottom,
  })

  const toggleMessageCollapsed = e => {
    const { target } = e
    const condition =
      collapsed ||
      (!collapsed && (target.closest(`.${styles.Message_details}`) || target.closest(`.${styles.Message_avatar}`)))
    if (condition) {
      message.toggleCollapsed()
    }
  }

  const renderActions = () =>
    actions && !readOnly ? (
      <Dropdown position='bottomRight' trigger={() => <ButtonActions transparent={isDraft} />}>
        {actions()}
      </Dropdown>
    ) : (
      <ButtonActions isDisabled onClick={e => e.stopPropagation()} />
    )

  const renderSlotFrom = () => (slotFrom ? <div className={styles.Message_fromSlot}>{slotFrom}</div> : null)

  const renderDraftPill = () =>
    isDraft ? (
      <div className={styles.Message_draftPill}>
        <TextWithIconPill fill mode='draft' text='Draft' iconId='action_edit_s' />
      </div>
    ) : null

  const avatarModel = () => {
    const nameParts = (from_name || '').split(' ')
    return user || { avatar_url, first_name: nameParts[0], last_name: nameParts.slice(1).join(' ') }
  }

  // TODO remove after final push
  const renderAlertBoxes = () =>
    app.ui.inboxTab.ticket && app.ui.inboxTab.ticket.id === 'ticket-2' ? (
      <div>
        <AlertBox message='Success message example.<br />This line contains a <a href="#">hyperlink</a>.' />
        <br />
        <AlertBox
          mode='important'
          message='Success message example.<br />This line contains a <a href="#">hyperlink</a>.'
        />
        <br />
        <AlertBox
          mode='success'
          message='Success message example.<br />This line contains a <a href="#">hyperlink</a>.'
        />
        <br />
        <AlertBox
          mode='notice'
          message='Success message example.<br />This line contains a <a href="#">hyperlink</a>.'
        />
        <br />
      </div>
    ) : null

  return (
    <div className={messageCss} onClick={toggleMessageCollapsed}>
      <div className={styles.Message_body}>
        <div className={styles.Message_avatar}>
          <Avatar model={avatarModel()} size='medium' />
        </div>

        <div className={styles.Message_content}>
          <div className={styles.Message_details}>
            <div className={styles.Message_from}>
              {from_name}
              {renderSlotFrom()}
            </div>
            {renderDraftPill()}
            <div className={styles.Message_detailsRight}>
              <span className={styles.Message_time}>
                <TimeFormat time={message.created_at} mode='hybrid' />
              </span>
              {!readOnly && <div className={styles.Message_actions}>{renderActions()}</div>}
            </div>
          </div>
          <div className={styles.Message_textContent}>
            <div className={styles.Message_text}>
              {children}
              {renderAlertBoxes()}
              <DeliveryFailure message={{ text: message.delivery_failure }} />
              <br />
            </div>
            <div className={styles.Message_more}>
              <ButtonMore />
            </div>
          </div>
        </div>

        <div className='uClear' />
      </div>

      <div className='uTopShadow' />
      <div className='uBottomShadow' />

      {isDraft && <div className={styles.Message_draftShadows} />}
    </div>
  )
})
