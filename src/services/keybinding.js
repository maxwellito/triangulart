class Keybinding {
  /**
   * Init the object by listeneing to the key events
   */
  constructor() {
    this.listeners = {}
    this.isOptionPressed = false
    this.keyupListener = this.onKeyUp.bind(this)
    this.keydownListener = this.onKeyDown.bind(this)
    window.addEventListener('keyup',   this.keyupListener)
    window.addEventListener('keydown', this.keydownListener)
  }

  /**
   * Public method to listen keybind
   * @param string eventName Event to listen to
   * @param function listener Listener
   * @return function Executable to remove the listener
   */
  on(eventName, listener) {
    if (!EVENTS[eventName]) {
      throw new Error ('Ask to listen for a non existing keybinding')
    }
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(listener)
    return () => {
      let listenerIndex = this.listeners[eventName].indexOf(listener)
      if (~listenerIndex) {
        this.listeners[eventName].splice(listenerIndex, 1)
      }
    }
  }

  /**
   * Listener for key up
   * @param event event Event object from window
   */
  onKeyUp(event) {
    if (event.keyCode === OPTION_KEYCODE) {
      this.isOptionPressed = false
    }
  }

  /**
   * Listener for key down
   * @param event event Event object from window
   */
  onKeyDown(event) {    
    if (event.keyCode === OPTION_KEYCODE) {
      this.isOptionPressed = true
    }
    let eventSpecs, areSpecsPassing
    for (let eventName in EVENTS) {
      eventSpecs = EVENTS[eventName]
      areSpecsPassing = true
      for (let prop in eventSpecs) {
        if (event[prop] !== eventSpecs[prop] && !(prop === 'ctrlKey' && eventSpecs[prop] && this.isOptionPressed)) {
          areSpecsPassing = false
        }
      }
      if (areSpecsPassing) {
        for (let listenerIndex in this.listeners[eventName]) {
          this.listeners[eventName][listenerIndex]()
          event.preventDefault()
        }
      }
    }
  }

  /**
   * Public method to remove all events
   * to make the instance killable
   */
  destroy() {
    window.removeEventListener('keyup',   this.keyupListener)
    window.removeEventListener('keydown', this.keydownListener)
  }
}

const OPTION_KEYCODE = 91

const EVENTS = {
  undo: {
    keyCode: 90,
    ctrlKey: true
  },
  delete: {
    keyCode: 8
  },
  cut: {
    keyCode: 88,
    ctrlKey: true
  },
  copy: {
    keyCode: 67,
    ctrlKey: true
  },
  paste: {
    keyCode: 86,
    ctrlKey: true
  },
}

export default Keybinding