module.exports = function createMethods(makeRequest) {
    return {
        // /v2/tasks
        getList: function getList() {
            return makeRequest('GET', '/tasks')();
        },
        // /v2/tasks/delete
        kill: function kill(body, scale, wipe) {
            return makeRequest('POST', '/tasks/delete')({scale: scale, wipe: wipe}, body);
        }
    };
};
