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


## Methods

#### Apps (marathon.app.methodName)
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
- `update(id, body)`
- `destroy(id)`

#### Tasks (marathon.tasks.methodName)
- `getList()`
- `kill(body, scale, wipe)`

#### Deployments (marathon.deployments.methodName)
- `getList()`
- `destroy(id)`

#### Event Stream (marathon.events.methodName)
- `attach()`

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
