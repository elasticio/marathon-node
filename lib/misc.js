module.exports = function createMethods(makeRequest) {
    return {
        // /ping
        ping: function ping(addOptions) {
            return makeRequest('GET', '/ping', addOptions)();
        }
    };
};
