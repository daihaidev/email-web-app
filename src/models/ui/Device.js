import { makeAutoObservable } from 'mobx'

import { ResizeObserver } from './ResizeObserver/ResizeObserver'

const inputModes = {
  mouse: 'mouse',
  touch: 'touch',
}

export class Device {
  inputMode

  constructor() {
    makeAutoObservable(this)

    this.inputMode = inputModes.mouse
    this.lastTouchAt = 0

    this.resizeObserver = new ResizeObserver()

    this.startEventHandlers()
  }

  get inputModeCapitalized() {
    return this.inputMode.charAt(0).toUpperCase() + this.inputMode.slice(1)
  }

  get isTouchInputMode() {
    return this.inputMode === inputModes.touch
  }

  setTouchMode() {
    this.inputMode = inputModes.touch
    this.lastTouchAt = Date.now()
  }

  setMouseMode() {
    // we ignore mouse events that come immediately after touch events
    if (Date.now() - this.lastTouchAt > 500) {
      this.inputMode = inputModes.mouse
    }
  }

  startEventHandlers() {
    // if we detect a touch, we switch to touch mode
    // pointerdown for modern devices, touchstart for legacy
    window.addEventListener(
      'pointerdown',
      e => {
        if (e.pointerType === inputModes.touch) {
          this.setTouchMode()
        }
      },
      { passive: true }
    )
    window.addEventListener(
      'touchstart',
      () => {
        this.setTouchMode()
      },
      { passive: true }
    )

    // if we detect a mouse, we switch to mouse mode
    // pointermove for modern devices, mousemove for legacy
    window.addEventListener(
      'pointermove',
      e => {
        if (e.pointerType === inputModes.mouse) {
          this.setMouseMode()
        }
      },
      { passive: true }
    )
    window.addEventListener(
      'mousemove',
      () => {
        this.setMouseMode()
      },
      { passive: true }
    )
  }
}
