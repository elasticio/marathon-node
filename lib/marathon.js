'use strict'

const { omit } = require('./nodash')
const axios = require('axios')

const MARATHON_API_VERSION = 'v2'
// http api endpoints
const MarathonApiAppEndpoints = require('./apps')
const MarathonApiDeploymentEndpoints = require('./deployments')
const MarathonApiGroupEndpoints = require('./groups')
const MarathonApiTaskEndpoints = require('./tasks')
const MarathonApiInfoEndpoints = require('./info')
const MarathonApiQueueEndpoints = require('./queue')
const MarathonApiMiscEndpoints = require('./misc')
const MarathonApiLeaderEndpoints = require('./leader')

// EventSource
const MarathonEventSource = require('./events')

// not yet implemented so no need to require here
// var artifacts = require('./artifacts')

const _timeToken = Symbol('timetoken')
const contentType = 'application/json'

axios.defaults.headers.post['Content-Type'] = contentType
axios.defaults.headers.put['Content-Type'] = contentType
axios.defaults.headers.delete['Content-Type'] = contentType
/**
 * https://mesosphere.github.io/marathon/docs/rest-api.html
 */
class MarathonApi {
  get basePath () { return `/${MARATHON_API_VERSION}` }

  constructor (baseURL, opts = {}) {
    this.baseURL = new URL(`${baseURL}`) // if it's already a url object create a new copy
    this.logTime = opts.logTime
    this.baseURL.pathname = this.basePath
    const baseOpts = omit(opts, 'logTime') // setup options without the logTime

    this.http = axios.create({
      ...baseOpts,
      baseURL: this.baseURL.toString() // axios needs a string
    })
    if (this.logTime) {
      this.http.interceptors.response.use(this.timeTracker)
      this.http.interceptors.request.use(this.timeTracker)
    }

    // initialize the api endpoints
    this.app = new MarathonApiAppEndpoints(this)
    this.deployments = new MarathonApiDeploymentEndpoints(this)
    this.events = new MarathonEventSource(this)
    this.groups = new MarathonApiGroupEndpoints(this)
    this.tasks = new MarathonApiTaskEndpoints(this)
    this.info = new MarathonApiInfoEndpoints(this)
    this.queue = new MarathonApiQueueEndpoints(this)
    this.misc = new MarathonApiMiscEndpoints(this)
    this.leader = new MarathonApiLeaderEndpoints(this)
  }

  set timeToken (newtoken) { this[_timeToken] = newtoken }
  get timeToken () { return this[_timeToken] }

  async timeTracker (c) {
    if (this.logTime && c?.url) {
      this.timeToken = `Marathon Request: ${c.url}`
      // assume it's on the request side
      console.time(this.timeToken)
    } else if (this.logTime && c?.status) {
      console.timeEnd(this.timeToken)
    }
    return c
  }
}

module.exports = MarathonApi
