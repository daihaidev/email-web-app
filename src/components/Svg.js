import React from 'react'
import { observer } from 'mobx-react'

export const Svg = observer(props => {
  const { data, ...passthrough } = props

  return (
    <svg viewBox={props.data.viewBox} preserveAspectRatio='xMidYMid meet' {...passthrough}>
      <use xlinkHref={`#${props.data.id}`} />
    </svg>
  )
})
