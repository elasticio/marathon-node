'use strict';

describe('subscriptions', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#getList()', function() {
        it('should get list of event subscriptions', function() {
            var response = {
                callbackUrls: [
                    'http://server123:9090/callback',
                    'http://server234:9191/callback'
                ]
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/eventSubscriptions')
                .reply(200, response);

            return marathon.subscriptions.getList().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#create()', function() {
        it('should create new subscription', function() {
            var response = {
                callbackUrl: 'http://localhost:9292/callback',
                clientIp: '127.0.0.1',
                eventType: 'subscribe_event'
            };

            var callbackUrl = 'http://localhost:9292/callback';

            var scope = nock(MARATHON_HOST)
                .post('/v2/eventSubscriptions')
                .query({callbackUrl: callbackUrl})
                .reply(200, response);

            return marathon.subscriptions.create(callbackUrl).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#delete()', function() {
        it('should delete new subscription', function() {
            var response = {
                callbackUrl: 'http://localhost:9292/callback',
                clientIp: '127.0.0.1',
                eventType: 'unsubscribe_event'
            };

            var callbackUrl = 'http://localhost:9292/callback';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/eventSubscriptions')
                .query({callbackUrl: callbackUrl})
                .reply(200, response);

            return marathon.subscriptions.delete(callbackUrl).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
