import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Button } from './Button'
import styles from './TextButton.scss'

export const TextButton = observer(({ onClick, size, children, customClass, isActive, type, block, isDisabled }) => {
  const buttonClass = classNames(styles.TextButton, size ? styles[`TextButton__${size}`] : '', {
    [customClass]: customClass,
    [styles.TextButton__isDisabled]: isDisabled,
  })

  return (
    <Button
      onClick={onClick}
      size={size}
      isActive={isActive}
      type={type}
      customClass={buttonClass}
      block={block}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  )
})
