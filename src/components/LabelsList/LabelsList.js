import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { LabelPill } from 'components/Pill/LabelPill'
import { Dropdown } from 'components/Dropdown/Dropdown'

import styles from './LabelsList.scss'

export const LabelsList = observer(
  ({ customClass, labelCustomClass, innerCustomClass, visibleItems, restItems, onClose, onClick, size }) => {
    const cssClass = classNames(styles.LabelsList, {
      [customClass]: customClass,
    })

    const innerCssClass = classNames(styles.LabelsList_inner, {
      [innerCustomClass]: innerCustomClass,
    })

    const renderPopup = () => {
      if (restItems.length > 0) {
        return (
          <Dropdown
            position='bottomLeft'
            horizontal
            trigger={<div className={styles.LabelsList_moreTrigger}>{`+${restItems.length}`}</div>}
          >
            <div className={styles.LabelsList_dropdown}>
              {restItems.map(label => (
                <div className={styles.LabelsList_dropdownItem} key={label.id}>
                  <LabelPill model={label} size='small' />
                </div>
              ))}
            </div>
          </Dropdown>
        )
      }
      return null
    }

    return (
      <div className={cssClass}>
        <div className={innerCssClass}>
          {visibleItems.map(label => (
            <div className={labelCustomClass} key={label.id}>
              <LabelPill model={label} onClose={onClose} onClick={onClick} size={size} />
            </div>
          ))}
          {renderPopup()}
        </div>
      </div>
    )
  }
)
