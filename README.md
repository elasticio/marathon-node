# marathon-node [![CircleCI](https://circleci.com/gh/elasticio/marathon-node.svg?style=svg)](https://circleci.com/gh/elasticio/marathon-node)
Node.js client library for Mesos Marathon's REST API powered by Bluebird promises.

```javascript
const opts = {};
const marathon = require('marathon-node')(MARATHON_URL, opts);
marathon.app
  .getList()
  .then(console.log)
  .catch(console.error);
```

## Options
Options passed to [request](https://github.com/request/request) lib. Overview of all the options is [here](https://github.com/request/request#requestoptions-callback).

***HTTP Authentication example:***
```javascript
const opts = {
    auth: {
        user: 'foo',
        pass: 'baz'
    }
};
```

***Other options:***
- `logTime` - if `true`, logs requests time to console

## Marathon Event Bus

To manage event stream [EventSource](https://github.com/EventSource/eventsource) client is used.

***Example:***

```javascript
const marathon = require('marathon-node')(MARATHON_URL, opts);

const eventSourceOpts = {
    eventType: ['status_update_event'], // (string|array) Marathon will stream only this kind of events (optional)
    proxy: 'http://your.proxy.com' // (string) Proxy host (optional)
};
const es = marathon.events.createEventSource(eventSourceOpts);
es.addEventListener('status_update_event', event => console.log('status_update_event'));
es.on('open', () => console.log('opened'));
es.on('error', err => console.error(err));
```

You can find more info in the official documentation [Marathon Event Bus docs](https://mesosphere.github.io/marathon/docs/event-bus.html).

## Methods

#### Apps (marathon.apps.methodName)
- `getList(parameters)`
- `getOne(id)`
- `getVersions(id)`
- `getVersion(id, version)`
- `getTasks(id)`
- `create(body)`
- `update(id, body, force)`
- `restart(id, force)`
- `destroy(id)`
- `killTasks(id, parameters)`
- `killTask(id, task, scale)`

#### Groups (marathon.groups.methodName)
- `getList()`
- `create(body)`
- `getOne(id)`
- `update(id, body, force)`
- `destroy(id, force)`

#### Tasks (marathon.tasks.methodName)
- `getList()`
- `kill(body, scale, wipe)`

#### Deployments (marathon.deployments.methodName)
- `getList()`
- `destroy(id)`

#### Event Stream (marathon.events.methodName)
- `attach()` (deprecated)
- `createEventSource(opts)`

#### Event Subscriptions (marathon.subscriptions.methodName)
- `getList()`
- `create(callbackUrl)`

#### Queue (marathon.queue.methodName)
- `get()`
- `resetDelay(appId)`

#### Server Info (marathon.info.methodName)
- `get()`

#### Leader (marathon.leader.methodName)
- `get()`
- `abdicate()`

#### Miscellaneous (marathon.misc.methodName)
- `ping()`
