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
    const { data } = await this.client.get('', { params })
    return data
  }

  async create (data) {
    const { data: result } = await this.client.post('', data)
    return result
  }

  async getOne (appId, query = {}) {
    const params = new URLSearchParams(Object.entries(query))
    const path = encodeURIComponent(appId)
    const { data } = await this.client.get(path, { params })
    return data
  }

  async update (appId, data, force) {
    const params = new URLSearchParams([['force', !!force]])
    const path = encodeURIComponent(appId)
    const { data: result } = await this.client.put(path, data, { params })
    return result
  }

  async destroy (appId, force) {
    const params = new URLSearchParams([['force', !!force]])
    const path = encodeURIComponent(appId)
    const { data } = await this.client.delete(path, undefined, { params })
    return data
  }

  async restart (appId, force) {
    const params = new URLSearchParams([['force', !!force]])
    const path = `${encodeURIComponent(appId)}/restart`
    const { data } = await this.client.post(path, undefined, { params })
    return data
  }

  async getTasks (appId) {
    const path = `${encodeURIComponent(appId)}/tasks`
    const { data } = await this.client.get(`${path}/tasks`)
    return data
  }

  async killTasks (appId, query = {}) {
    const params = new URLSearchParams(Object.entries(query))
    const path = `${encodeURIComponent(appId)}/tasks`
    const { data } = await this.client.delete(path, undefined, { params })
    return data
  }

  async killTask (appId, taskId, scale) {
    const params = new URLSearchParams([['scale', !!scale]])
    const path = `${encodeURIComponent(appId)}/tasks/${taskId}`
    const { data } = await this.client.delete(path, undefined, { params })
    return data
  }

  async getVersions (appId) {
    const path = `${encodeURIComponent(appId)}/versions`
    const { data } = await this.client.get(path)
    return data
  }

  async getVersion (appId, versionId) {
    const path = `${encodeURIComponent(appId)}/versions/${versionId}`
    const { data } = await this.client.get(path)
    return data
  }
}

module.exports = MarathonApiAppEndpoints
