import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Input } from 'components/Forms/Input'

export const formatToAMPM = (hh, mm) => {
  let periodHours, period, periodMinutes
  if (hh >= 12) {
    periodHours = hh > 12 ? hh - 12 : 12
    period = 'PM'
  } else {
    periodHours = hh
    period = 'AM'
  }
  if (mm >= 10) {
    periodMinutes = mm
  } else {
    periodMinutes = `0${mm}`
  }
  return `${periodHours}:${periodMinutes} ${period}`
}

export const TimeInput = observer(({ onSelect, value }) => {
  const [time, setTime] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const newValue = value ? value.human : ''
    if (!focused) {
      setTime(newValue)
    }
  }, [value, focused])

  const formatStringToTimeObject = string => {
    const array = string.split(':')
    if (array.length === 3) {
      const hours = array[2] === 'PM' && array[0] < 12 ? +array[0] + 12 : +array[0]
      return {
        hours,
        minutes: +array[1],
        human: formatToAMPM(hours, +array[1]),
      }
    }
    let hours = +array[0]
    if (hours < 7 && hours > 0) {
      hours += 12
    }
    let minutes = array[1]
    if (minutes.length !== 2 && +minutes !== 0) {
      minutes = +minutes * 10
    } else {
      minutes = +minutes
    }

    return {
      hours,
      minutes,
      human: formatToAMPM(hours, minutes),
    }
  }

  const normalizeInput = input => {
    // if it's just a number - format and return
    if (!Number.isNaN(+input)) {
      return `${input}:00`
    }

    if (/AM?/i.test(input)) {
      const position = input.indexOf('A')
      const firstPart = input.slice(0, position)
      return /:/.test(firstPart) ? `${firstPart}:AM` : `${firstPart}:00:AM`
    }
    if (/PM?/i.test(input)) {
      const position = input.indexOf('P')
      const firstPart = input.slice(0, position)
      return /:/.test(firstPart) ? `${firstPart}:PM` : `${firstPart}:00:PM`
    }

    return input
  }

  const validateAndFormatInput = input => {
    /*
    FORMATS:
    X(am|pm)
    AA:BB (am|pm)
    */
    const formatted = input.replace(/ /g, '').toUpperCase()
    if (/^(\d|[0-2]\d)(:[0-5]?|:([0-5]\d?))?(AM?|PM?)?$/.test(formatted)) {
      // continue to work with input, otherwise do nothing or show validation message
      return formatStringToTimeObject(normalizeInput(formatted))
    }
    return null
  }

  const onEnterTime = e => {
    setTime(e.target.value)
    const output = validateAndFormatInput(e.target.value)

    if (onSelect) {
      onSelect(output)
    }
  }

  return <Input onBlur={() => setFocused(false)} onFocus={() => setFocused(true)} value={time} onChange={onEnterTime} />
})
