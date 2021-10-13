import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import moment from 'moment'
import classNames from 'classnames'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'

import styles from './Datepicker.scss'

export const Datepicker = observer(({ startDate, endDate, onSelect, selectedDate }) => {
  const calendar = []
  const [month, setMonth] = useState(0)

  const goToPrevMonth = () => {
    if (month > 0) {
      setMonth(month - 1)
    }
  }
  const goToCurrentMonth = () => {
    setMonth(0)
  }
  const goToNextMonth = () => {
    if (month <= 12) {
      setMonth(month + 1)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      const selectedMonth = selectedDate.clone().startOf('month')
      const currentMonth = app.getCurrentTime().startOf('month')
      const diff = selectedMonth.diff(currentMonth, 'month')
      if (diff <= 12) {
        setMonth(diff)
      } else {
        goToCurrentMonth()
      }
    } else {
      goToCurrentMonth()
    }
  }, [selectedDate])

  const startDay = app.getCurrentTime().add(month, 'M').startOf('month').startOf('isoWeek')
  const endDay = app.getCurrentTime().add(month, 'M').endOf('month').endOf('isoWeek')
  const date = startDay.clone().subtract(1, 'day')

  // If there are less than 6 rows - add needed amount of rows of the next month
  const startEndDaysDiff = endDay.diff(startDay, 'week')
  if (startEndDaysDiff < 5) {
    endDay.add(5 - startEndDaysDiff, 'week')
  }

  while (date.isBefore(endDay, 'day')) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => date.add(1, 'day').clone())
    )
  }

  const selectDate = day => {
    if (onSelect) onSelect(day)
  }

  const showPrevButton = () => {
    if (month === 0) return null
    const navPrevIconCSS = classNames(styles.Datepicker_navigationIcon, styles.Datepicker_navigationPrev)
    return (
      <ButtonWithIcon
        size='small'
        iconId='ui_uncollapseThick_xs'
        iconCustomClass={navPrevIconCSS}
        onClick={goToPrevMonth}
      />
    )
  }
  const showCurrentButton = () => {
    if (month === 0) return null
    return (
      <ButtonWithIcon
        size='small'
        iconId='ui_square_xs'
        iconCustomClass={styles.Datepicker_navigationIcon}
        onClick={goToCurrentMonth}
      />
    )
  }
  const showNextButton = () => {
    const navNextIconCSS = classNames(styles.Datepicker_navigationIcon, styles.Datepicker_navigationNext)
    const buttonCSS = classNames({
      [styles.Datepicker_navigationButton__hidden]: month > 11,
    })
    return (
      <ButtonWithIcon
        size='small'
        customWrapperClass={buttonCSS}
        iconId='ui_uncollapseThick_xs'
        iconCustomClass={navNextIconCSS}
        onClick={goToNextMonth}
      />
    )
  }

  const renderCalendar = () =>
    calendar.map(row =>
      row.map(day => {
        const isDisabled = day.isBefore(startDate, 'day') || day.isAfter(endDate, 'day')
        const otherMonth = app.getCurrentTime().add(month, 'M').month() !== day.month()
        const today = !app.getCurrentTime().isBefore(day, 'day') && !app.getCurrentTime().isAfter(day, 'day')
        const selected = selectedDate && moment(day).isSame(selectedDate)

        const dayCSS = classNames(styles.Datepicker_day, {
          [styles.Datepicker_day__otherMonth]: otherMonth,
          [styles.Datepicker_day__today]: today,
          [styles.Datepicker_day__selected]: selected,
          [styles.Datepicker_day__disabled]: isDisabled,
        })

        return (
          <div className={styles.Datepicker_dayCell} key={day.format('DD-MM-YYYY')}>
            <div className={dayCSS} onClick={() => !isDisabled && selectDate(day)}>
              {day.format('D')}
            </div>
          </div>
        )
      })
    )

  const humanVisibleMonth = app.getCurrentTime().add(month, 'M').format('MMMM YYYY')

  return (
    <div className={styles.Datepicker}>
      <div className={styles.Datepicker_header}>
        <div className={styles.Datepicker_currentMonth}>{humanVisibleMonth}</div>
        <div className={styles.Datepicker_navigation}>
          {showPrevButton()}
          {showCurrentButton()}
          {showNextButton()}
        </div>
      </div>
      <div className={styles.Datepicker_body}>
        <div className={styles.Datepicker_dayNames}>
          <div className={styles.Datepicker_dayName}>Mon</div>
          <div className={styles.Datepicker_dayName}>Tue</div>
          <div className={styles.Datepicker_dayName}>Wed</div>
          <div className={styles.Datepicker_dayName}>Thu</div>
          <div className={styles.Datepicker_dayName}>Fri</div>
          <div className={styles.Datepicker_dayName}>Sat</div>
          <div className={styles.Datepicker_dayName}>Sun</div>
        </div>
        <div className={styles.Datepicker_days}>{renderCalendar()}</div>
      </div>
    </div>
  )
})
