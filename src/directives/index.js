// import { option } from 'runjs'

export const imageerror = {
  inserted(dom, options) {
    dom.src = dom.src || options.value
    dom.onerror = function() {
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
