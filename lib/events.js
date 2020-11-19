'use strict';

var util = require('util');
var EventSource = require('eventsource');
var nodeUrl = require('url');
var _ = require('lodash');

module.exports = function createMethods(makeRequest, url) {
    return {
        // /v2/events
        attach: util.deprecate(function attach() {
            return makeRequest('GET', '/events', {headers: {Accept: 'text/event-stream'}}, true)();
        }, '"events.attach()" is deprecated in favor of "events.createEventSource()"'),

        createEventSource: function createEventSource(opts) {
            opts = opts || {};
            // Set username/password in url for eventsource requests
            if ( "auth" in opts ) {
                url.auth = opts.auth.user + ":" + opts.auth.pass;
            }
            url.query = url.query || {};

            var eventType = opts.eventType;
            if (eventType) {
                if (!_.isString(eventType) && !_.isArray(eventType)) {
                    throw new Error('"eventType" should be a string or an array');
                }

                url.query.event_type = eventType;
            }
            return new EventSource(nodeUrl.format(url), opts);
        }
    };
};
