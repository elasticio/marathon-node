'use strict'

var EventSource = require('eventsource')

class MarathonEventSource {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/events`
    this.client = ctx.http
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  // the constructor url should contain credentials and the api basepath '/v2'
  createEventSource (opts = {}) {
    const { eventType } = opts
    if (eventType) {
      if (!((eventType instanceof String) || (eventType instanceof Array))) {
        throw new Error('"eventType" should be an array or string')
      }
      this.baseURL.searchParams.set('event_type', eventType)
    }
    this.es = new EventSource(`${this.baseURL}`)
    return this.es
  }
}

module.exports = MarathonEventSource
