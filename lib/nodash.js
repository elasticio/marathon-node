'use strict'

const omit = function (obj, ...keys) {
  const keysToRemove = new Set(keys.flat()) // flatten the props, and convert to a Set

  return Object.fromEntries( // convert the entries back to object
    Object.entries(obj) // convert the object to entries
      .filter(([k]) => !keysToRemove.has(k)) // remove entries with keys that exist in the Set
  )
}

// maps an object similarly to lodash.map function
const mapObject = function (obj, fun) {
  if (!fun) fun = (...opts) => opts
  return Object.entries(obj).map(v => fun(...v))
}

// determine whether or not an object is empty
const emptyObj = obj => Object.keys(obj).length === 0

const pick = (obj, ...keys) => {
  const result = {}
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}

const difference = (a, b) => a.filter(x => b.includes(x))

const union = (...arrays) => [...new Set([...arrays.flat()])]

const unionBy = (...input) => {
  const output = []
  const x = input.pop()
  for (const a of input) {
    for (const i of a) {
      if (i?.[x]) {
        const f = output.find(y => y?.[x] === i?.[x])
        if (!f) output.push(i)
      }
    }
  }
  return output
}

const debounce = function (fn, delay) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, arguments), delay)
  }
}

const throttle = function (fn, threshold, scope) {
  threshold || (threshold = 250)
  scope || (scope = this)
  let last
  let deferTimer
  let result
  return async function Throttled () {
    const now = +new Date()
    if (last && now < last + threshold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(async () => {
        last = now
        result = await fn.apply(scope, arguments)
      }, threshold)
    } else {
      last = now
      result = await fn.apply(scope, arguments)
    }
    return result
  }
}

const partition = function (col, fn) {
  return [...col].reduce((acc, value, key) => {
    acc[fn(value, key) ? 0 : 1].push(value)
    return acc
  }, [[], []])
}

// returns a function with some of it's arguments filled out
const partial = (fn, ...params) => (...more) => fn(...params, ...more)

module.exports = {
  emptyObj,
  debounce,
  difference,
  mapObject,
  omit,
  partial,
  partition,
  pick,
  throttle,
  union,
  unionBy
}
