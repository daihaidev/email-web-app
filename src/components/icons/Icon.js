import React from 'react'
import { observer } from 'mobx-react'

// import { generateId } from 'components/helpers'

const sizeMap = {
  xs: { width: 16, height: 16 },
  s: { width: 20, height: 20 },
  m: { width: 26, height: 26 },
  l: { width: 30, height: 30 },
}

// import all svg icons in current folder
const extractName = key => key.match(/([a-zA-Z0-9_]+)/)[1]
export const cache = {}
function importAll(r) {
  r.keys().forEach(key => {
    cache[extractName(key)] = r(key).default
  })
}
importAll(require.context('./', false, /.*\.svg$/))

export const Icon = observer(
  React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({}))

    const { id, aspectRatio, color, width, height, ...passthrough } = props
    const icon = cache[id]

    if (!icon) {
      throw new Error(`Icon not found: ${id}`)
    }

    let iconWidth = width
    let iconHeight = height

    if (!iconWidth && !iconHeight) {
      const size = id.split('_')[2]
      if (sizeMap[size]) {
        iconWidth = sizeMap[size].width
        iconHeight = sizeMap[size].height
      }
    }

    const fill = color || ''

    return (
      <>
        <svg
          fill={fill}
          viewBox={icon.viewBox}
          preserveAspectRatio={aspectRatio || 'xMidYMid meet'}
          width={iconWidth}
          height={iconHeight}
          {...passthrough}
        >
          <use xlinkHref={`#${icon.id}`} />
        </svg>
      </>
    )
  })
)
