import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { Icon } from 'components/icons/Icon'
import styles from './LabelPill.scss'

export const LabelPill = observer(({ model, size, onClick, onClose, selected, isSuggestion }) => {
  const renderCloseButton = () =>
    onClose ? (
      <div className={styles.LabelPill_closeButton} onClick={() => onClose(model.id)}>
        <Icon id='action_close_xs' className={styles.LabelPill_closeButtonIcon} />
      </div>
    ) : null

  const labelClass = classNames(styles.LabelPill, styles[`LabelPill__${model.color}`], styles[`LabelPill__${size}`], {
    [styles.LabelPill__isSelected]: selected,
    [styles.LabelPill__interactive]: onClick || onClose,
    [styles.LabelPill__clickable]: onClick,
  })

  const onClickHandler = () => onClick && onClick(model.id)
  const onTouchHandler = () => app.device.isTouchInputMode && onClickHandler()

  return (
    <div className={styles.LabelPill_wrapper}>
      {onClick ? <div className={styles.LabelPill_touchArea} onClick={onTouchHandler} /> : null}
      {isSuggestion && <Icon id='ui_magic_s' className={styles.LabelPill_suggestionIcon} />}
      <div className={labelClass} onClick={onClickHandler}>
        {model.name}
        {renderCloseButton()}
      </div>
    </div>
  )
})
