'use strict';

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);
const assert = require('assert');
const localize = require('../src/localize');
const log = require('../src/logger');

let multStringInfos = [
    {
        'stringName': 'INTL40'
    },
    {
        'stringName': 'paymentExceedsAvailable',
        'variables': {
            'tag2': 'TAG 2',
            'whatever': 'whatever'
        }
    },
    {
        'stringName': 'badcode'
    }
];

let axiosMultGetReply = {
    'applications': [
        'common',
        'shop'
    ],
    'id': 'INTL40,paymentExceedsAvailable,badcode-common,shop-es_ES,en_US',
    'locales': [
        'es_ES',
        'en_US'
    ],
    'messages': [],
    'localizations': [
        {
            'stringName': 'INTL40',
            'rawString': 'No podemos actualizar su información relacionada con el perfil.  Por favor, intentar más tarde.\r\n',
            'localizedString': 'No podemos actualizar su información relacionada con el perfil.  Por favor, intentar más tarde.\r\n'
        },
        {
            'stringName': 'paymentExceedsAvailable',
            'rawString': 'Payment amount <%tag1%> exceeds available amount <%tag2%>.',
            'localizedString': 'Payment amount <%tag1%> exceeds available amount <%tag2%>.'
        },
        {
            'stringName': 'badcode',
            'localizedString': '?badcode?'
        }
    ],
    'status': 200
};

describe('localize', function() {
    before(() => {
        log.setLevel('none');
    });
    after(() => {
        log.setLevel('info');
    });

    describe('successful results', () => {
        it('get multiple translations, replace vars by name (passed in)', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                let localizations = await localize(multStringInfos, ['shop', 'common'], ['en_US', 'es_ES'], 'name');
                assert.equal(localizations.length, 3);
                assert.equal(localizations[1].localizedString, 'Payment amount <%tag1%> exceeds available amount TAG 2.');
            } catch (err) {
                assert.fail(err);
            }
        });

        it('get multiple translations, replace vars by name (not passed in)', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                let localizations = await localize(multStringInfos, ['shop', 'common'], ['en_US', 'es_ES']);
                assert.equal(localizations.length, 3);
                assert.equal(localizations[1].localizedString, 'Payment amount <%tag1%> exceeds available amount TAG 2.');
            } catch (err) {
                assert.fail(err);
            }
        });

        it('get multiple translations, replace vars by order', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                let localizations = await localize(multStringInfos, ['shop', 'common'], ['en_US', 'es_ES'], 'order');
                assert.equal(localizations.length, 3);
                assert.equal(localizations[1].localizedString, 'Payment amount TAG 2 exceeds available amount whatever.');
            } catch (err) {
                assert.fail(err);
            }
        });

        it('get translations without locale', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                let localizations = await localize(multStringInfos, ['shop', 'common'], null, 'name');
                assert.equal(localizations.length, 3);
                assert.equal(localizations[1].localizedString, 'Payment amount <%tag1%> exceeds available amount TAG 2.');
            } catch (err) {
                assert.fail(err);
            }
        });
    });

    describe('error results', () => {
        it('get error if call to localization service fails', async () => {
            axiosMock.onGet(/.*/).reply(400, axiosMultGetReply);

            try {
                await localize(multStringInfos, ['shop', 'common'], null, 'name');
                assert.fail('Should have got an error');
            } catch (err) {
                assert.ok(true);
            }
        });

        it('get error passing non array stringInfo', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                await localize({}, ['shop', 'common'], null, 'name');
                assert.fail('Should have got an error');
            } catch (err) {
                assert.ok(true);
            }
        });
        it('get error passing non array apps', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                await localize(multStringInfos, 'shop', null, 'name');
                assert.fail('Should have got an error');
            } catch (err) {
                assert.ok(true);
            }
        });

        it('get error passing non array locales', async () => {
            axiosMock.onGet(/.*/).reply(200, axiosMultGetReply);

            try {
                await localize(multStringInfos, ['shop', 'common'], 'locale', 'name');
                assert.fail('Should have got an error');
            } catch (err) {
                assert.ok(true);
            }
        });
    });
});
