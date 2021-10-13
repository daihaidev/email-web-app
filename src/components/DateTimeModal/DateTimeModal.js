import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { app } from 'app'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Modal } from 'components/Modal/Modal'
import { Datepicker } from 'components/Datepicker/Datepicker'
import { Timepicker } from 'components/Timepicker/Timepicker'
import { TextButton } from 'components/Button/TextButton'
import { DateInput } from './DateInput'
import { TimeInput, formatToAMPM } from './TimeInput'

import styles from './DateTimeModal.scss'

const START_TIME = 6
const END_TIME = 23

let times = []

// eslint-disable-next-line no-plusplus
for (let i = START_TIME; i <= END_TIME; i++) {
  times.push(i)
}

times = times.map(hh => {
  // eslint-disable-next-line no-nested-ternary
  return {
    hours: hh,
    minutes: 0,
    human: formatToAMPM(hh, 0),
  }
})

const eightAM = times.find(t => t.hours === 8)

export const DateTimeModal = observer(() => {
  const startDate = app.getCurrentTime()
  const endDate = app.getCurrentTime().add(1, 'y')
  const tomorrow = app.getCurrentTime().add(1, 'd').startOf('day')
  const today = app.getCurrentTime().startOf('day')

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const onCancel = () => {
    setSelectedDate(null)
    setSelectedTime(null)
    app.ui.inboxTab.setCustomSnooze(null)
  }

  const joinDateAndTime = (date, time) => {
    const startOfTheDay = date.clone().startOf('day')
    if (time.minutes === 0) {
      return startOfTheDay.add(time.hours, 'hours')
    }
    return date.clone().startOf('day').add(time.hours, 'hours').add(time.minutes, 'minutes')
  }

  const onApply = () => {
    app.ui.inboxTab.customSnooze(joinDateAndTime(selectedDate, selectedTime).toISOString())
    onCancel()
  }

  const validateDateAndTime = () => {
    if (selectedTime && selectedDate) {
      const join = joinDateAndTime(selectedDate, selectedTime)
      return startDate.diff(join) <= 0 && endDate.diff(join) >= 0
    }
    return false
  }

  const onSelectDate = date => {
    setSelectedDate(date)
    if (!date) {
      setSelectedTime(null)
    } else if (!selectedTime && startDate.diff(joinDateAndTime(date, eightAM)) < 0) {
      setSelectedTime(eightAM)
    }
  }

  const onSelectTime = time => {
    setSelectedTime(time)
    if (!selectedDate && time) {
      const dateToSelect = app.getCurrentTime().diff(joinDateAndTime(app.getCurrentTime(), time)) > 0 ? tomorrow : today
      setSelectedDate(dateToSelect)
    }
  }

  const renderValidationMessage = () => {
    if (selectedDate && selectedTime && !validateDateAndTime()) {
      return <div className={styles.DateTimeModal_footerMessage}>Invalid date and time</div>
    }
    return null
  }

  return (
    <Modal isVisible={app.ui.inboxTab.customSnooze} onClose={onCancel}>
      <Modal.Header title='Snooze until'>
        <ButtonWithIcon
          iconId='action_close_m'
          onClick={onCancel}
          customWrapperClass={styles.DateTimeModal_closeButton}
        />
      </Modal.Header>
      <Modal.Body>
        <div className={styles.DateTimeModal_selectors}>
          <div className={styles.DateTimeModal_datepicker}>
            <div className={styles.DateTimeModal_inputField}>
              <div className={styles.DateTimeModal_inputLabel}>Day</div>
              <div className={styles.DateTimeModal_input}>
                <DateInput onSelect={onSelectDate} value={selectedDate} />
                <div className={styles.DateTimeModal_note}>tomorrow, monday, 6/20, 3 weeks</div>
              </div>
            </div>
            <div className={styles.DateTimeModal_datepickerWrapper}>
              <Datepicker startDate={startDate} endDate={endDate} onSelect={onSelectDate} selectedDate={selectedDate} />
            </div>
          </div>
          <div className={styles.DateTimeModal_timepicker}>
            <div className={styles.DateTimeModal_inputField}>
              <div className={styles.DateTimeModal_inputLabel}>Time</div>
              <div className={styles.DateTimeModal_input}>
                <TimeInput onSelect={onSelectTime} value={selectedTime} />
                <div className={styles.DateTimeModal_note}>3pm, 17:55, 5p</div>
              </div>
            </div>
            <div className={styles.DateTimeModal_timepickerWrapper}>
              <Timepicker times={times} onSelect={onSelectTime} time={selectedTime} />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.DateTimeModal_footer}>
          {renderValidationMessage()}
          <div className={styles.DateTimeModal_footerActions}>
            <TextButton onClick={onCancel} size='large' type='primaryText'>
              Cancel
            </TextButton>
            <TextButton onClick={onApply} size='large' type='primary' isDisabled={!validateDateAndTime()}>
              Snooze
            </TextButton>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
})
