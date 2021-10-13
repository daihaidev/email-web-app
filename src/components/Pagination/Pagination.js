import React from 'react'
import { observer } from 'mobx-react'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import styles from './Pagination.scss'

export const Pagination = observer(({ onNext, onPrev, value, nextDisabled, prevDisabled }) => {
  return (
    <div className={styles.Pagination}>
      <ButtonWithIcon iconId='ui_previous_m' isDisabled={prevDisabled} onClick={onPrev} />
      <input type='text' value={value} readOnly className={styles.Pagination_input} />
      <ButtonWithIcon iconId='ui_next_m' isDisabled={nextDisabled} onClick={onNext} />
    </div>
  )
})
