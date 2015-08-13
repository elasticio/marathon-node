describe('marathon', function() {

    var Marathon = require('../lib/marathon.js');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function(){
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('ping', function() {

        it('should make ping', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .reply(200, 'pong');

            marathon.misc.ping().then(onSuccess).done();

            function onSuccess(data) {
                expect(data).toEqual('pong');
                expect(scope.isDone()).toEqual(true);
                done();
            }
        });

        it('should make ping with timeout', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .delayConnection(1000)
                .reply(200, 'pong');

            marathon.misc.ping({timeout: 2000}).then(onSuccess).done();

            function onSuccess(data) {
                expect(data).toEqual('pong');
                expect(scope.isDone()).toEqual(true);
                done();
            }
        });

        it('should report about timeout', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .delayConnection(3000)
                .reply(200, 'pong');

            marathon.misc.ping({timeout: 2000}).catch(onError).done();

            function onError(err) {
                expect(err.message).toEqual('Marathon response was: Error: ETIMEDOUT');
                expect(scope.isDone()).toEqual(true);
                done();
            }
        });

        it('should make ping with timeout', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .reply(400, 'no-response');

            marathon.misc.ping({timeout: 2000}).catch(onError).done();

            function onError(err) {
                expect(scope.isDone()).toEqual(true);
                expect(err.name).toEqual('StatusCodeError');
                expect(err.message).toEqual('Marathon response was: 400 - no-response');
                expect(err.statusCode).toEqual(400);
                expect(err.options.url).toEqual('http://01.02.03.04:5678/ping');
                expect(err.options.timeout).toEqual(2000);
                done();
            }
        });

    });



});
