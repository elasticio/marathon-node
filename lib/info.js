module.exports = function createMethods(makeRequest) {
    return {
        // /v2/info
        get: function get() {
            return makeRequest('GET', '/info')();
        }
    };
};
