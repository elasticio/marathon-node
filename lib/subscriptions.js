module.exports = function createMethods(makeRequest) {
    return {
        getList: makeRequest('GET', '/eventSubscriptions'),
        create: function create(callbackUrl) {
            return makeRequest('POST', '/eventSubscriptions')({callbackUrl: callbackUrl});
        },
        delete: function deleteSubscription(callbackUrl) {
            return makeRequest('DELETE', '/eventSubscriptions')({callbackUrl: callbackUrl});
        }
    };
};
