'use strict'

const axios = require('axios')

const MARATHON_API_VERSION = 'v2'
// http api endpoints
const MarathonApiAppEndpoints = require('./api/apps')
const MarathonApiDeploymentEndpoints = require('./api/deployments')
const MarathonApiGroupEndpoints = require('./api/groups')
const MarathonApiTaskEndpoints = require('./api/tasks')
const MarathonApiInfoEndpoints = require('./api/info')
const MarathonApiQueueEndpoints = require('./api/queue')
const MarathonApiMiscEndpoints = require('./api/misc')
const MarathonApiLeaderEndpoints = require('./api/leader')

// EventSource
const MarathonEventSource = require('./api/events')

// not yet implemented so no need to require here
// var artifacts = require('./artifacts')

// helper functions
const { omit } = require('./lib/nodash')

const _timeToken = Symbol('timetoken')
const contentType = 'application/json'

// configure axios defaults
axios.defaults.headers.common.Accept = contentType
axios.defaults.headers.post['Content-Type'] = contentType
axios.defaults.headers.put['Content-Type'] = contentType
axios.defaults.headers.delete['Content-Type'] = contentType
/**
 * https://mesosphere.github.io/marathon/docs/rest-api.html
 */
class MarathonApi {
  get basePath () { return `/${MARATHON_API_VERSION}` }

  get http () { // returns an http client
    const client = axios.create({
      ...this.defaults,
      baseURL: this.baseURL.toString()
    })
    if (this.logTime) {
      client.interceptors.request.use(async config => this.timeTracker(config))
      client.interceptors.response.use(async res => this.timeTracker(res))
    }
    return client
  }

  constructor (baseURL, opts = {}) {
    this.logTime = opts.logTime
    this.defaults = omit(opts, 'logTime') // setup options without the logTime

    this.baseURL = new URL(`${baseURL}`) // if it's already a url object create a new copy
    this.baseURL.pathname = this.basePath

    // initialize the api endpoints
    this.app = new MarathonApiAppEndpoints(this)
    this.apps = this.app // alias for app
    this.deployments = new MarathonApiDeploymentEndpoints(this)
    this.events = new MarathonEventSource(this)
    this.groups = new MarathonApiGroupEndpoints(this)
    this.tasks = new MarathonApiTaskEndpoints(this)
    this.info = new MarathonApiInfoEndpoints(this)
    this.queue = new MarathonApiQueueEndpoints(this)
    this.misc = new MarathonApiMiscEndpoints(this)
    this.leader = new MarathonApiLeaderEndpoints(this)
    this.timers = {} // key/object pairing of timer tokens
  }

  async timeTracker (c) {
    if (this.logTime && !c.status) {
      const { pathname } = new URL(c.baseURL)
      if (!(pathname in this.timers)) {
        this.timers[pathname] = `Marathon Request Timer: ${pathname}`
      }
      console.time(this.timers[pathname])
    } else if (this.logTime && c?.status) {
      const { request: { path } } = c
      console.timeEnd(this.timers[path])
    }
    return c
  }
}

module.exports = MarathonApi
