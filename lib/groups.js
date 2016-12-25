module.exports = function createMethods(makeRequest) {
    return {
        // /v2/groups
        getList: function getList() {
            return makeRequest('GET', '/groups')();
        },
        create: function create(body) {
            return makeRequest('POST', '/groups')(null, body);
        },
        // /v2/groups/{group_id}
        getOne: function getOne(groupId) {
            return makeRequest('GET', '/groups/' + groupId)();
        },
        update: function update(groupId, body, force) {
            return makeRequest('PUT', '/groups/' + groupId)({force: force}, body);
        },
        destroy: function destroy(groupId, force) {
            return makeRequest('DELETE', '/groups/' + groupId)({force: force});
        }
    };
};
