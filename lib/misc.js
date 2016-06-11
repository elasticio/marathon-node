module.exports = function createMethods(makeRequest) {
    return {
        ping: function ping(addOptions) {
            return makeRequest('GET', '/ping', addOptions)();
        }
        // /metrics todo
    };
};
