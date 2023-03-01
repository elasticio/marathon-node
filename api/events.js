'use strict'

var EventSource = require('eventsource')

class MarathonEventSource {
  constructor (ctx) { // accepts a parent context
    this.basePath = ctx.basePath
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = this.path
    this.client = ctx.http
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  get path () { return `${this.basePath}/events` }

  // the constructor url should contain credentials and the api basepath '/v2'
  createEventSource (opts = {}) {
    this.baseURL.pathname = this.path // make sure we have a good path
    const { eventType } = opts
    if (eventType) {
      if (typeof eventType === 'string') {
        this.baseURL.searchParams.set('event_type', eventType)
      } else if (eventType instanceof Array) { // array
        for (const type of eventType) { this.baseURL.searchParams.append('event_type', type) }
      } else {
        throw new Error('"eventType" should be an array or string')
      }
    }
    this.es = new EventSource(`${this.baseURL}`)
    return this.es
  }
}

module.exports = MarathonEventSource
