module.exports = function createMethods(makeRequest) {
    return {
        // /v2/leader
        get: function get() {
            return makeRequest('GET', '/leader')();
        },
        abdicate: function abdicate() {
            return makeRequest('DELETE', '/leader')();
        }
    };
};
