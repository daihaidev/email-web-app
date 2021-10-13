import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Input } from 'components/Forms/Input'
import { app } from 'app'

export const DateInput = observer(({ onSelect, value }) => {
  const today = app.getCurrentTime().startOf('day')
  const currentMonth = app.getCurrentTime().startOf('month')

  const [date, setDate] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const newValue = value ? value.format('MMMM D') : ''
    if (!focused) {
      setDate(newValue)
    }
  }, [value, focused])

  const validateAndFormatInput = input => {
    /*
    \d+ (assume date in current month)
    tom.*
    (mon.|tue.|wed.|thu.|fri.|sat.|sun.*) (next available)
    \d+ week.*
    \d+ days.*
    \d+ month.*
    (jan.|feb.|mar.|apr.|may.|jun.|jul.|aug.|sep.|oct.|nov.|dec.) (\d+)?

    * */
    const formatted = input.replace(/ /g, '')
    // date number
    if (/^(\d|([1-3]\d))$/.test(formatted)) {
      // Check if date is not on the past
      let output
      const assumed = currentMonth.clone().subtract(1, 'day').add(formatted, 'days')
      if (assumed.isBetween(today, currentMonth.endOf('month'), undefined, '[)')) {
        output = assumed
      } else {
        output = assumed.clone().add(1, 'month')
      }
      return output
    }

    // tom.*
    if (/^tom([orw]{0,5})$/i.test(formatted)) {
      return app.getCurrentTime().startOf('day').add(1, 'day')
    }

    // (mon.|tue.|wed.|thu.|fri.|sat.|sun.*) (next available)
    if (
      /^mon([day]{0,3})|tue([sday]{0,4})|wed([nesday]{0,6})|thu([rsday]{0,5})|fri([day]{0,3})|sat([urday]{0,5})|sun([day]{0,3})$/i.test(
        formatted
      )
    ) {
      const day = input.slice(0, 3)
      const output = moment(day, 'ddd')
      return app.getCurrentTime().diff(output) < 0 ? output : output.clone().add(1, 'week')
    }

    // \d+ week.*
    // Limit to 1-52 according to year limit, validation is not required as there is a validation in DateTimeModal
    if (/^([1-9]|[1-4]\d|5[0-2])w([eks]{0,4})$/i.test(formatted)) {
      return app.getCurrentTime().startOf('day').add(parseInt(formatted), 'week')
    }

    // \d+ days.*
    if (/^(\d\d?\d?)d([ays]{0,3})$/i.test(formatted)) {
      return app.getCurrentTime().startOf('day').add(parseInt(formatted), 'day')
    }

    // \d+ month.*
    if (/^(\d|(1[0-2]))m([onths]{0,5})$/i.test(formatted)) {
      return app.getCurrentTime().startOf('day').add(parseInt(formatted), 'month')
    }

    // (jan.|feb.|mar.|apr.|may.|jun.|jul.|aug.|sep.|oct.|nov.|dec.) (\d+)?
    if (
      /^(jan(.{0,4})|feb(.{0,5})|mar(.{0,2})|apr(.{0,2})|may|june?|july?|aug(.{0,3})|sep(.{0,6})|oct(.{0,4})|nov(.{0,5})|dec(.{0,5}))(0?[1-9]|[12]\d|3[01])?$/i.test(
        formatted
      )
    ) {
      const month = input.slice(0, 3)
      let output = moment(month, 'MMM')
      const indexOfDate = formatted.search(/\d/g)
      if (indexOfDate !== -1) {
        const parsedDate = +input.slice(indexOfDate)
        output = output.clone().subtract(1, 'day').add(parsedDate, 'day')
      } else if (app.getCurrentTime().diff(output, 'month') === 0) {
        output = app.getCurrentTime().startOf('day')
      }
      return app.getCurrentTime().startOf('day').diff(output, 'day') <= 0 ? output : output.clone().add(1, 'year')
    }

    // \d+/\d+ (6/20 for june 20)
    // day number: 0?\d|[1-2]\d|3[0-1]
    // month number: 0?\d|[1-2]\d|3[0-1]
    if (/^0?([1-9]|(1[1-2]))\/(0?[1-9]|[12]\d|3[01])$/i.test(formatted)) {
      // Use object to avoid moment.js parsing warnings
      const arr = formatted.split('/')
      const parsed = moment({ month: arr[0] - 1, date: arr[1] })
      // add one year if date is in the past
      return app.getCurrentTime().diff(parsed) < 0 ? parsed : parsed.clone().add(1, 'year')
    }
    return null
  }

  const onEnterDate = e => {
    setDate(e.target.value)
    const output = validateAndFormatInput(e.target.value)
    if (onSelect) {
      onSelect(output)
    }
  }

  return <Input onBlur={() => setFocused(false)} onFocus={() => setFocused(true)} value={date} onChange={onEnterDate} />
})
