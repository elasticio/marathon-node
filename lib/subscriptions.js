module.exports = function createMethods(makeRequest) {
    return {
        // /v2/eventSubscriptions
        getList: makeRequest('GET', '/eventSubscriptions'),
        create: function create(callbackUrl) {
            return makeRequest('POST', '/eventSubscriptions')({qs: "callbackUrl=" + callbackUrl});
        },
        delete: function deleteSubscription(callbackUrl) {
            return makeRequest('DELETE', '/eventSubscriptions')({qs: "callbackUrl=" + callbackUrl});
        }
    };
};
