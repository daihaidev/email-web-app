import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import styles from './VerticalLine.scss'

export const VerticalLine = observer(({ modifier }) => {
  const className = classNames(styles.VerticalLine, modifier)

  return <div className={className} />
})
