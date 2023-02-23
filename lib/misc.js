'use strict'

class MarathonApiMiscEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.client = ctx.http
    this.baseURL = new URL(this.client.defaults.baseURL)
    this.baseURL.pathname = '/' // these endpoints don't get the version prefix
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async ping () {
    this.timeToken = '/ping'
    return this.client.get('ping')
  }

  async metrics () {
    this.timeToken = '/metrics'
    return this.client.get('metrics')
  }
}

module.exports = MarathonApiMiscEndpoints
