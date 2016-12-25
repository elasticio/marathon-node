module.exports = function createMethods(makeRequest) {
    return {
        // /v2/queue
        get: function get() {
            return makeRequest('GET', '/queue')();
        },
        // /v2/queue/{app_id}/delay
        resetDelay: function resetDelay(appId) {
            return makeRequest('DELETE', '/queue/' + appId + '/delay')();
        }
    };
};
