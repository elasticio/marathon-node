'use strict'

class MarathonApiAppEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/apps`
    this.client = ctx.http.create()
    this.client.interceptors = ctx.http.interceptors
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async getList (query = {}) {
    const params = new URLSearchParams(Object.entries(query))
    console.log({ clientDefaults: this.client.defaults })
    return this.client.get('', { params })
  }

  async create (data) {
    return this.client.post('', data)
  }

  async getOne (appId, query = {}) {
    const params = new URLSearchParams(Object.entries(query))
    const path = encodeURIComponent(appId)
    return this.client.get(path, { params })
  }

  async update (appId, data, force) {
    const params = new URLSearchParams([['force', !!force]])
    const path = encodeURIComponent(appId)
    return this.client.put(path, data, { params })
  }

  async destroy (appId, force) {
    const params = new URLSearchParams([['force', !!force]])
    const path = encodeURIComponent(appId)
    return this.client.delete(path, undefined, { params })
  }

  async restart (appId, force) {
    const params = new URLSearchParams([['force', !!force]])
    const path = `${encodeURIComponent(appId)}/restart`
    return this.client.post(path, undefined, { params })
  }

  async getTasks (appId) {
    const path = `${encodeURIComponent(appId)}/tasks`
    return this.client.get(`${path}/tasks`)
  }

  async killTasks (appId, query = {}) {
    const params = new URLSearchParams(Object.entries(query))
    const path = `${encodeURIComponent(appId)}/tasks`
    return this.client.delete(path, undefined, { params })
  }

  async killTask (appId, taskId, scale) {
    const params = new URLSearchParams([['scale', !!scale]])
    const path = `${encodeURIComponent(appId)}/tasks/${taskId}`
    return this.client.delete(path, undefined, { params })
  }

  async getVersions (appId) {
    const path = `${encodeURIComponent(appId)}/versions`
    return this.client.get(path)
  }

  async getVersion (appId, versionId) {
    const path = `${encodeURIComponent(appId)}/versions/${versionId}`
    return this.client.get(path)
  }
}

module.exports = MarathonApiAppEndpoints
