'use strict'

class MarathonApiMiscEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.client = ctx.http
    this.baseURL = new URL(this.client.defaults.baseURL)
    this.baseURL.pathname = '/' // these endpoints don't get the version prefix
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async ping (timeout = 300) {
    this.timeToken = '/ping'
    const { data } = await this.client.get('ping', { timeout })
    return data
  }

  async metrics () {
    this.timeToken = '/metrics'
    const { data } = await this.client.get('metrics')
    return data
  }
}

module.exports = MarathonApiMiscEndpoints
