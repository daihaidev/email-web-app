import React from 'react'
import { observer } from 'mobx-react'
import { cache, Icon } from 'components/icons/Icon'
// import classNames from 'classnames'
// import { app } from 'app'

import { Page } from 'components/Layout/Page'
import styles from './IconsPage.scss'

const renderIcons = icons => {
  return (
    <div className={styles.IconsPage_container}>
      {icons.map(key => {
        return (
          <span title={key} key={key}>
            <Icon id={key} className={styles.IconsPage_icon} />
            <br />
            <div className={styles.IconsPage_iconText}>{key}</div>
          </span>
        )
      })}
    </div>
  )
}

export const IconsPage = observer(() => {
  const icons = Object.keys(cache).sort()
  const legacy = icons.filter(icon => (icon.match(/_/g) || []).length !== 2)
  const categorized = icons.filter(icon => !legacy.includes(icon))

  const categories = {}

  categorized.forEach(icon => {
    const [cat, , size] = icon.split('_')
    const catsize = `${cat}_${size}`
    if (!(catsize in categories)) {
      categories[catsize] = []
    }

    categories[catsize].push(icon)
  })

  return (
    <Page>
      {Object.keys(categories)
        .sort()
        .map(key => {
          const icos = categories[key]
          return (
            <div key={key}>
              <h2>{key}</h2>
              {renderIcons(icos)}
            </div>
          )
        })}

      <div key='OLD ICONS'>
        <h2>---OLD ICONS---</h2>
        {renderIcons(legacy)}
      </div>
    </Page>
  )
})
