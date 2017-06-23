'use strict';

var util = require('util');

module.exports = function createMethods(makeRequest) {
    return {
        // /v2/events
        attach: util.deprecate(function attach() {
            return makeRequest('GET', '/events', {headers: {Accept: 'text/event-stream'}}, true)();
        }, '"events.attach()" is deprecated in favor of "events.createEventSource()"')
    };
};
