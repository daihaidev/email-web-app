import React, { useState, useRef, useLayoutEffect } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { useSwipeable } from 'react-swipeable'

import { app } from 'app'
import { generateId } from 'components/helpers'
import { VerticalLine } from 'components/InboxTab/VerticalLine'
import { Svg } from 'components/Svg'
import { Icon } from 'components/icons/Icon'
import { Rating } from 'components/Rating'
import { Avatar } from 'components/Avatar/Avatar'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { Checkbox } from 'components/Checkbox'
import { StateDropdown } from 'components/Dropdown/StateDropdown'
import { SnoozeDropdown } from 'components/Dropdown/SnoozeDropdown'
import { UserDropdown } from 'components/Dropdown/UserDropdown'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { useSize } from 'components/hooks/useSize'
import { usePrevious } from 'components/hooks/usePrevious'
import { TimeFormat } from 'components/TimeFormat'
import { LabelsList } from 'components/LabelsList/LabelsList'
import styles from './TicketSummary.scss'
import busyIndicator from './busyIndicator.svg'

export const TicketSummary = observer(({ model, timeField, onMouseEnter, onMouseLeave, onClick }) => {
  const ref = useRef(null)
  const size = useSize(ref, {
    // each of these numbers has been reduced by 326 when converting
    // from (window size based) media queries
    xl: s => s.width >= 1074,
    lg: s => s.width >= 874,
    md: s => s.width >= 521,
    mdOnly: s => s.width >= 521 && s.width < 874,
    mdDown: s => s.width < 874,
    sm: s => s.width <= 520,
  })
  const [actionsRevealedMobile, setActionsRevealedMobile] = useState(false)
  const [labelsFullWidthState, setLabelsFullWidthState] = useState(false)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActionsRevealedMobile(true),
    onSwipedRight: () => setActionsRevealedMobile(false),
  })
  const extended = !app.currentUser.preferences.compactTickets
  const labelsFullWidth = labelsFullWidthState && extended
  const ratingRenderConditionOne =
    size && ((!size.named.mdOnly && !size.named.sm && extended && !labelsFullWidth) || (!extended && size.named.md))
  const ratingRenderConditionTwo = size && ((size.named.sm && !extended) || (size.named.lg && labelsFullWidth))

  let containerEvents = {}

  if (app.device.isTouchInputMode) {
    containerEvents = {
      onTouchStart: onMouseEnter,
      onTouchEnd: onMouseLeave,
    }
  } else {
    containerEvents = {
      onMouseEnter,
      onMouseLeave,
    }
  }

  const renderAssignedUser = () => {
    const user = app.users.find(x => x.id === model.user_id)
    return <TicketSummary.User model={user} extended={extended} />
  }

  const renderTicketSummary = () => {
    const sizeClasses = {}
    Object.keys(size.named).forEach(key => {
      sizeClasses[styles[`TicketSummary__${key}`]] = size.named[key]
    })

    return (
      <div
        className={classNames(styles.TicketSummary, sizeClasses, {
          [styles.TicketSummary_checked]: model.checked,
        })}
        {...containerEvents}
        onClick={onClick}
        {...swipeHandlers}
      >
        <div
          className={classNames(styles.TicketSummary_inner, {
            [styles.TicketSummary_inner__checked]: model.checked,
            [styles.TicketSummary_inner__inProgress]: model.inProgress,
            [styles.TicketSummary_inner__actionsRevealedMobile]: actionsRevealedMobile,
            [styles.TicketSummary_inner__actionsHiddenMobile]: !actionsRevealedMobile,
            [styles.TicketSummary_inner__extended]: extended,
          })}
        >
          {model.kbFocus ? <VerticalLine modifier={styles.TicketSummary__focus} /> : null}
          <TicketSummary.ViewFlag viewFlag={model.collisionState} />
          <div
            className={classNames(styles.TicketSummary_stretchableArea, {
              [styles.TicketSummary_stretchableArea__extended]: extended,
            })}
          >
            <div className={styles.TicketSummary_mobileTop}>
              <TicketSummary.Customer ticket={model} onClick={() => model.toggleChecked()} />
              {size.named.sm && (
                <span className={styles.TicketSummary_time}>
                  <TimeFormat time={model[timeField]} mode='mini' />
                </span>
              )}
            </div>
            <div
              className={classNames(styles.TicketSummary_extendedModeContainer, {
                [styles.TicketSummary_extendedModeContainer__active]: labelsFullWidth,
              })}
            >
              <div
                className={classNames(styles.TicketSummary_extendedModeContainerTop, {
                  [styles.TicketSummary_extendedModeContainerTop__active]: extended,
                })}
              >
                {extended && (size.named.mdOnly || size.named.sm) ? (
                  <>
                    <TicketSummary.Rating rating={model.rating} />
                    <TicketSummary.Subject model={model} />
                  </>
                ) : null}
              </div>
              <div
                className={classNames(styles.TicketSummary_extendedModeContainerBottom, {
                  [styles.TicketSummary_extendedModeContainerBottom__active]: labelsFullWidth,
                })}
              >
                {ratingRenderConditionOne ? <TicketSummary.Rating rating={model.rating} /> : null}
                {model.label_ids.length ? (
                  <div
                    className={classNames(styles.TicketSummary_mobileBottom, {
                      [styles.TicketSummary_mobileBottom__extended]: labelsFullWidth,
                    })}
                  >
                    <TicketSummary.LabelList
                      ticket={model}
                      labelIds={model.label_ids}
                      labelsFullWidth={labelsFullWidth}
                      setLabelsFullWidthState={setLabelsFullWidthState}
                      extended={extended}
                      size={size}
                    />
                  </div>
                ) : null}
                <div className={styles.TicketSummary_mobileMiddle}>
                  {ratingRenderConditionTwo ? <TicketSummary.Rating rating={model.rating} /> : null}
                  <TicketSummary.Content model={model} extended={extended} size={size} />
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(styles.TicketSummary_fixedArea, {
              [styles.TicketSummary_fixedArea__extended]: extended,
            })}
          >
            <div
              className={classNames(styles.TicketSummary_fixedAreaLeft, {
                [styles.TicketSummary_fixedAreaLeft__extended]: extended,
              })}
            >
              <TicketSummary.State state={model.state} snoozedUntil={model.snoozed_until} extended={extended} />
              {renderAssignedUser()}
              <TicketSummary.Inbox inboxId={model.inbox_id} />
              <TicketSummary.Number model={model.number} extended={extended} size={size} />
              <TicketSummary.Replies replyCount={model.reply_count} type={model.type} />
            </div>
            {!size.named.sm && (
              <span className={styles.TicketSummary_time}>
                <TimeFormat time={model[timeField]} mode={extended ? 'full' : 'mini'} />
              </span>
            )}
          </div>
          {!size.named.sm && <TicketSummary.ExtraActions model={model} extended={extended} size={size} />}
        </div>
        {size.named.sm && <TicketSummary.ExtraActions model={model} extended={extended} size={size} />}
      </div>
    )
  }

  return <div ref={ref}>{size ? renderTicketSummary() : ''}</div>
})

TicketSummary.Customer = observer(({ ticket, onClick }) => {
  const checkboxId = `ticketSummaryUserId ${generateId()}`

  return (
    <div className={classNames(styles.TicketSummary_customer)}>
      <div className={styles.TicketSummary_customerAvatarWrapper} onClick={e => e.stopPropagation()}>
        <div className={styles.TicketSummary_checkboxContainer}>
          <Checkbox
            checkboxId={checkboxId}
            onChange={onClick}
            isChecked={ticket.checked}
            noHoverIfChecked
            size='small'
          />
        </div>
        <div className={styles.TicketSummary_customerAvatarContainer} onClick={onClick}>
          <Avatar model={ticket.customer} size='xsmall' />
        </div>
      </div>
      <Avatar.Label>
        {ticket.customer.first_name} {ticket.customer.last_name}
      </Avatar.Label>
    </div>
  )
})

TicketSummary.LabelList = observer(({ labelIds, extended, labelsFullWidth, setLabelsFullWidthState, size, ticket }) => {
  const labelListInnerRef = useRef(null)
  const previousWidth = usePrevious(size.width)
  const previousLabelCount = usePrevious(labelIds.length)
  const [itemsToRemove, setItemsToRemove] = useState(0)
  const swipeHandlers = useSwipeable({
    onSwiping: eventData => {
      if (!extended) {
        eventData.event.stopPropagation()
      }
    },
  })

  let maxWidth = 241
  if (extended) {
    if (size.named.md) {
      maxWidth = 279
    } else if (size.named.lg) {
      maxWidth = 505
    }
  } else {
    let newSize = 0
    if (size.named.lg) {
      newSize = size.width - 720
    } else if (size.named.md) {
      newSize = size.width - 400
    }
    if (newSize > maxWidth) {
      maxWidth = newSize
    }
  }

  const handleLabelsExtendedMode = innerWidth => {
    if (innerWidth > maxWidth || size.named.sm) {
      setLabelsFullWidthState(true)
    } else if (previousLabelCount !== labelIds.length) {
      setLabelsFullWidthState(false)
    }
  }

  const handleLabelsInPopup = innerWidth => {
    if (size.named.sm || (extended && itemsToRemove)) {
      setItemsToRemove(0)
      return
    }

    if (previousLabelCount !== labelIds.length || previousWidth !== size.width) {
      setItemsToRemove(0)
    }

    if (!extended && innerWidth > maxWidth) {
      setItemsToRemove(itemsToRemove + 1)
    }
  }

  useLayoutEffect(() => {
    if (labelListInnerRef.current === null) {
      return
    }

    const innerWidth = labelListInnerRef.current.clientWidth

    if (extended) {
      handleLabelsExtendedMode(innerWidth)
    }

    handleLabelsInPopup(innerWidth)
  }, [itemsToRemove, size.width, extended, labelIds.length])

  const cssClass = classNames(styles.TicketSummary_labelList, {
    [styles.TicketSummary_labelList__extended]: extended,
  })

  const innerCssClass = classNames(styles.TicketSummary_labelListInner, {
    [styles.TicketSummary_labelListInner__fullWidth]: labelsFullWidth,
  })

  const labelCssClass = classNames(styles.TicketSummary_label, {
    [styles.TicketSummary_label__fullWidth]: labelsFullWidth,
  })

  const labelsArr = app.labels.filter(label => labelIds.find(x => x === label.id))

  const labelsVisible = itemsToRemove ? labelsArr.slice(0, -itemsToRemove) : labelsArr

  const labelsRest = itemsToRemove ? labelsArr.slice(-itemsToRemove) : []

  return (
    <div className={cssClass}>
      <div {...swipeHandlers}>
        <div ref={labelListInnerRef}>
          <LabelsList
            ticket={ticket}
            innerCustomClass={innerCssClass}
            visibleItems={labelsVisible}
            restItems={labelsRest}
            labelCustomClass={labelCssClass}
            labelCssClass={labelCssClass}
            size='small'
          />
        </div>
      </div>
    </div>
  )
})

TicketSummary.Rating = observer(({ rating }) => {
  if (!rating) {
    return null
  }

  const ratingName = rating ? `rating_${rating}_m` : null

  const ratingIconClass = classNames(styles.TicketSummary_ratingIcon, styles[`TicketSummary_ratingIcon__${rating}`])

  return (
    <div className={styles.TicketSummary_rating}>
      <Rating rating={ratingName} className={ratingIconClass} />
    </div>
  )
})

TicketSummary.Subject = observer(({ model }) => {
  return (
    <strong>
      {model.has_attachment ? <Icon id='action_attach_s' className={styles.TicketSummary_attachment} /> : null}
      {model.subject}
    </strong>
  )
})

TicketSummary.Content = observer(({ model, extended, size }) => {
  return (
    <div
      className={classNames(styles.TicketSummary_content, {
        [styles.TicketSummary_content__extended]: extended,
      })}
    >
      <span>
        {(extended && size.named.lg) || !extended ? <TicketSummary.Subject model={model} /> : null}
        {model.summaryIsNote ? <Icon id='ticket_note_s' className={styles.TicketSummary_note} /> : null}
        {model.summary}
      </span>
    </div>
  )
})

TicketSummary.ViewFlag = observer(({ viewFlag }) => {
  if (viewFlag) {
    return (
      <div className={styles.TicketSummary_viewFlag}>
        <Svg
          data={busyIndicator}
          className={classNames(styles.TicketSummary_viewFlagIcon, styles[`TicketSummary_viewFlagIcon__${viewFlag}`])}
        />
      </div>
    )
  }

  return null
})

TicketSummary.State = observer(({ state, snoozedUntil, extended }) => {
  if (state && !['spam', 'trash'].includes(state)) {
    return (
      <div
        className={classNames(styles.TicketSummary_state, {
          [styles.TicketSummary_state__extended]: extended,
        })}
      >
        <Icon id={`state_${state}_s`} className={styles.TicketSummary_stateIcon} />
        <span className={styles.TicketSummary_stateText}>
          <TimeFormat time={snoozedUntil} mode={extended ? 'snooze' : 'snoozeMini'} />
        </span>
      </div>
    )
  }

  return null
})

TicketSummary.User = observer(({ model, extended }) => {
  return (
    <div
      className={classNames(styles.TicketSummary_user, {
        [styles.TicketSummary_user__extended]: extended,
      })}
    >
      <Avatar model={model} size='xsmall' />
    </div>
  )
})

TicketSummary.Inbox = observer(({ inboxId, extended }) => {
  const inbox = app.inboxes.find(x => x.id === inboxId)

  if (!inbox) {
    return null
  }

  return (
    <div
      className={classNames(styles.TicketSummary_inbox, {
        [styles.TicketSummary_inbox__extended]: extended,
      })}
    >
      <Icon id='ticket_inboxThin_s' className={styles.TicketSummary_inboxIcon} />{' '}
      <span>{inbox.short_name || inbox.name}</span>
    </div>
  )
})

TicketSummary.Number = observer(({ model, extended, size }) => {
  const containerWidth = size.named.mdOnly || (extended && !size.named.sm) ? 152 : app.account.maxTicketDigits * 8 + 12
  return (
    <div
      style={{ minWidth: `${containerWidth}px` }}
      className={classNames(styles.TicketSummary_number, {
        [styles.TicketSummary_number__extended]: extended,
      })}
    >
      <span># {model}</span>
    </div>
  )
})

TicketSummary.Replies = observer(({ replyCount, type }) => {
  return (
    <div className={styles.TicketSummary_replies}>
      <Icon id={`ticketType_${type}_s`} className={styles.TicketSummary_repliesIcon} /> <span>{replyCount}</span>
    </div>
  )
})

TicketSummary.ExtraActions = observer(({ model, extended, size }) => {
  const buttonSize = size.named.sm ? 'mobile' : 'medium'

  return (
    <div
      className={classNames(styles.TicketSummary_extraActions, {
        [styles.TicketSummary_extraActions__extended]: extended,
      })}
    >
      <div className={styles.TicketSummary_extraActionsItem}>
        <Dropdown
          position='bottomRight'
          trigger={isActive => (
            <ButtonWithIcon iconId='action_state_m' width={38} height={38} isActive={isActive} size={buttonSize} />
          )}
        >
          <StateDropdown onClick={state => model.setState(state)} />
        </Dropdown>
      </div>
      <div className={styles.TicketSummary_extraActionsItem}>
        <Dropdown
          position='bottomRight'
          trigger={isActive => (
            <ButtonWithIcon iconId='action_snooze_m' width={38} height={38} isActive={isActive} size={buttonSize} />
          )}
        >
          <SnoozeDropdown onClick={snoozeUntil => model.setState('snoozed', snoozeUntil)} />
        </Dropdown>
      </div>
      <div className={styles.TicketSummary_extraActionsItem}>
        <Dropdown
          position='bottomRight'
          trigger={isActive => (
            <ButtonWithIcon iconId='action_assign_m' width={38} height={38} isActive={isActive} size={buttonSize} />
          )}
        >
          <UserDropdown onClick={userId => model.assignUser(userId)} inboxId={model.inbox_id} />
        </Dropdown>
      </div>
    </div>
  )
})
