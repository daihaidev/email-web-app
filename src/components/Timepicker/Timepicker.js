import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import styles from './Timepicker.scss'

export const Timepicker = observer(({ times, onSelect, time }) => {
  const selectTime = t => {
    if (onSelect) {
      onSelect(t)
    }
  }

  const renderSelectedTime = () => {
    if (!time) return null
    if (times.find(t => t.human === time.human)) return null
    const renderTime = time.human.split(' ')
    return (
      <div className={styles.Timepicker_selectedTime}>
        {renderTime[0]}
        <span> {renderTime[1]}</span>
      </div>
    )
  }

  return (
    <div className={styles.Timepicker}>
      <div className={styles.Timepicker_header}>{renderSelectedTime()}</div>
      <div className={styles.Timepicker_body}>
        {times.map(t => {
          const cssClass = classNames(styles.Timepicker_time, {
            [styles.Timepicker_time__isSelected]: time && t.human === time.human,
          })
          const timeArr = t.human.split(' ')
          const hours = timeArr[0].split(':')[0]
          return (
            <div key={t.hours} className={cssClass} onClick={() => selectTime(t)}>
              {hours} <span>{timeArr[1]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
