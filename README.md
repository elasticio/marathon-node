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

When we attach to the [Marathon Event Bus](https://mesosphere.github.io/marathon/docs/event-bus.html) (from the Nodejs perspective) we receive a [Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams) object.

***Attaching to Event Bus example:***

```javascript
const marathon = require('marathon-node')(MARATHON_URL, opts);

marathon.events.attach()
	.then(function(stream) {
		// Forces the stream to receive a String instead of a Buffer object
		stream.setEncoding('utf-8');

		// Event that receives data from Marathon
		stream.on('data', function(chunk) {
			// Printing the event received from the stream
			console.log(chunk);
		});

		// Last event, it runs when the connection is closed
		stream.on('end', function() {
			// Here you do what you need when it ends...
		});

		// If for some reason we receive an error while connected, we can handle it here
		stream.on('errror', function(err) {
			// Error handling...
		})
	}).catch(function(err) {
		// Any problem while trying to connect to /v2/events
	});
```

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
