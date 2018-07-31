'use strict';

const assert = require('assert');
const cntry = require('../src/country');

describe('countries', () => {
    it('get all countries', () => {
        try {
            let countries = cntry.getCountries();
            assert(Object.keys(countries).length > 50);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('get a country', () => {
        try {
            let country = cntry.getCountry('US');
            assert.equal(country.tmzOffset, -7);
        } catch (err) {
            assert.fail(err);
        }
    });
});
