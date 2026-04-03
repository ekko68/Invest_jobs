const ReactEvent = {
  events: [],
  eventNames: {
    MAIN_LOADING_COMPLETE: 'mainLoadingComplete'
  },
  addEventListener: (eventName, eventListener) => {
    const item = {
      eventName: eventName,
      eventListener: eventListener
    }
    ReactEvent.events.push(item)
  },
  dispatchEvent: (eventName, ...params) => {
    const events = ReactEvent.events
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const eventItem = events[i]
        if (eventItem.eventName === eventName) {
          const eventListener = eventItem.eventListener
          eventListener(...params)
          break
        }
      }
    }
  },
  removeEventListener: (eventName) => {
    const list = []
    const events = ReactEvent.events
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const eventItem = events[i]
        if (eventItem.eventName !== eventName) {
          list.push(eventItem)
        }
      }
    }
    ReactEvent.events = list
  }
}
export default ReactEvent
