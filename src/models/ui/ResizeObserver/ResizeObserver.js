import ResizeObserverPolyfill from 'resize-observer-polyfill'
import { Size } from './Size'

export class ResizeObserver {
  constructor() {
    this.observing = new Map()

    if (ResizeObserver in window) {
      this.ro = new window.ResizeObserver(entries => {
        this.changes(entries)
      })
    } else {
      this.ro = new ResizeObserverPolyfill(entries => {
        this.changes(entries)
      })
    }
  }

  observe(element, namedSizes) {
    const size = new Size(namedSizes)
    size.width = element.clientWidth
    size.height = element.clientHeight

    this.observing.set(element, size)
    this.ro.observe(element)
    return size
  }

  unobserve(element) {
    this.ro.unobserve(element)
    this.observing.delete(element)
  }

  changes(entries) {
    entries.forEach(entry => {
      const size = this.observing.get(entry.target)
      size.width = entry.target.clientWidth
      size.height = entry.target.clientHeight
    })
  }
}
