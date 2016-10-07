# marathon-node [![CircleCI](https://circleci.com/gh/elasticio/marathon-node.svg?style=svg)](https://circleci.com/gh/elasticio/marathon-node)
Node.js client library for Mesos Marathon's REST API powered by Bluebird promises.

```javascript
var marathon = require('marathon-node')(MARATHON_URL);
marathon.app
  .getList()
  .then(console.log)
  .catch(console.error);
```

## Methods

`marathon(url: string, options: object)`

#### Options
- `options.username`
- `options.password`

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

#### Tasks (marathon.tasks.methodName)

#### Deployments (marathon.deployments.methodName)

#### Subscriptions (marathon.subscriptions.methodName)
- `getList()`
- `create(callbackUrl)`

#### Queue (marathon.queue.methodName)

### Info (marathon.info.methodName)

### Miscellaneous (marathon.misc.methodName)
