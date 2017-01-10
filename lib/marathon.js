var rp = require('request-promise');
var request = require('request');
var _ = require('lodash');

var API_VERSION = 'v2';
var PATHS_WITHOUT_PREFIX = ['/ping', '/metrics'];

var apps = require('./apps');
var deployments = require('./deployments');
var groups = require('./groups');
var tasks = require('./tasks');
var artifacts = require('./artifacts');
var events = require('./events');
var subscriptions = require('./subscriptions');
var info = require('./info');
var leader = require('./leader');
var queue = require('./queue');
var misc = require('./misc');

/**
 * https://mesosphere.github.io/marathon/docs/rest-api.html
 */

module.exports = Marathon;

function Marathon(url, opts) {
    opts = opts || {};

    var baseOptions = {
        url: url.replace(/\/$/, ''),
        json: true
    };

    _.assign(baseOptions, _.omit(opts, 'logTime'));

    function makeRequest(method, path, addOptions, requestStream) {
        return function closure(query, body) {
            var requestOptions = _.cloneDeep(baseOptions);

            if (PATHS_WITHOUT_PREFIX.indexOf(path) < 0) {
                path = '/' + API_VERSION + path;
            }

            requestOptions.method = method;
            requestOptions.qs = query;
            requestOptions.url = requestOptions.url + path;

            if (addOptions) {
                requestOptions = _.extend(requestOptions, addOptions);
            }

            requestOptions.body = body;

            var consoleTimeToken = 'Request to Marathon ' + path;

            if (opts.logTime) {
                console.time(consoleTimeToken);
            }

            function logTime() {
                if (opts.logTime) {
                    console.timeEnd(consoleTimeToken);
                }
            }

            if (requestStream) {
                return new Promise(function(resolve, reject) {
                        request[method.toLocaleLowerCase()](requestOptions)
                            .on('error', (err) => {
                                return reject(err);
                            })
                            .on('response', (readableStream) => {
                                readableStream.on('end', () => {
                                    logTime();
                                });
                                return resolve(readableStream);
                            });
                    });
            }

            return rp(requestOptions)
                .finally(logTime);
        };
    }

    var client = {
        app: apps(makeRequest),
        deployments: deployments(makeRequest),
        groups: groups(makeRequest),
        tasks: tasks(makeRequest),
        artifacts: artifacts(makeRequest),
        events: events(makeRequest),
        subscriptions: subscriptions(makeRequest),
        info: info(makeRequest),
        leader: leader(makeRequest),
        queue: queue(makeRequest),
        misc: misc(makeRequest)
    };

    client.apps = client.app;

    return client;
}
