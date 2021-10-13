export function generateId() {
  return `_${Math.random().toString(36).substr(2, 9)}`
}

export function outerHeight(el) {
  let height = el.offsetHeight
  const style = window.getComputedStyle(el)

  height += parseInt(style.marginBottom) + parseInt(style.marginTop)
  return height
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
