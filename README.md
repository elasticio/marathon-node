# marathon-node
Node.js client library for Mesos Marathon's REST API powered by Bluebird promises.

```javascript
var marathon = require('marathon-node')(MARATHON_URL, options);
marathon.apps
  .getList()
  .then(console.log)
  .catch(console.error);
```

## options
An optional set of options

- timeout: passed to request-promise
- doNotUrlResolve: *true* uses MARATHON_URL as is and appends the app path to it; *false* use the node URL module to resolve the MARATHON_URL then append the app path
- logTime: log time at various stages


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

#### Tasks (marathon.tasks.methodName)

#### Deployments (marathon.deployments.methodName)

#### Subscriptions (marathon.subscriptions.methodName)
- `getList()`
- `create(callbackUrl)`

#### Queue (marathon.queue.methodName)

### Info (marathon.info.methodName)

### Miscellaneous (marathon.misc.methodName)
