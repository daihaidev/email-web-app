import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import styles from './Button.scss'

export const Button = observer(
  ({
    onClick,
    size,
    children,
    customClass,
    customWrapperClass,
    isActive,
    type,
    block,
    touchWidth,
    touchHeight,
    width,
    height,
    isDisabled,
  }) => {
    const buttonClass = classNames(
      styles.Button,
      type ? styles[`Button__${type}`] : '',
      size ? styles[`Button__${size}`] : '',
      block ? styles.Button__block : '',
      {
        [styles.Button__isActive]: isActive,
        [styles.Button__isDisabled]: isDisabled,
        [customClass]: customClass,
      }
    )

    const wrapperClass = classNames(styles.Button__wrapper, {
      [customWrapperClass]: customWrapperClass,
    })

    const createStyle = (w, h) => {
      const style = {}
      if (w !== undefined) {
        style.width = `${w}px`
      }
      if (h !== undefined) {
        style.height = `${h}px`
      }
      return style
    }

    const createTouchStyle = () => (app.touchOptimized ? createStyle(touchWidth, touchHeight) : {})

    const onClickHandler = () => !isDisabled && onClick && onClick()

    const onTouch = () => app.device.isTouchInputMode && onClickHandler()

    return (
      <div className={wrapperClass}>
        <div style={createTouchStyle()} className={styles.Button__touchArea} onClick={onTouch} />
        <div role='button' className={buttonClass} style={createStyle(width, height)} onClick={onClickHandler}>
          {children}
        </div>
      </div>
    )
  }
)
