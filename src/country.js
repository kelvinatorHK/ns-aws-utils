'use strict';

const countries = {
    'AR': {
        'tmzOffset': -3,
        'currency': 'ARS',
        'ageLocMeMasterSku': '23010000'
    },
    'AT': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'AU': {
        'tmzOffset': 10,
        'currency': 'AUD',
        'ageLocMeMasterSku': '07010000'
    },
    'BE': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'BN': {
        'tmzOffset': 8,
        'currency': 'BND',
        'ageLocMeMasterSku': '36010000'
    },
    'BR': {
        'tmzOffset': -3,
        'currency': 'BRL',
        'ageLocMeMasterSku': ''
    },
    'CA': {
        'tmzOffset': -7,
        'currency': 'CAD',
        'ageLocMeMasterSku': '02010000'
    },
    'CH': {
        'tmzOffset': 1,
        'currency': 'CHF',
        'ageLocMeMasterSku': '97010000'
    },
    'CL': {
        'tmzOffset': -3,
        'currency': 'CLP',
        'ageLocMeMasterSku': '25010000'
    },
    'CN': {
        'tmzOffset': 8,
        'currency': 'CNY',
        'ageLocMeMasterSku': ''
    },
    'CO': {
        'tmzOffset': -5,
        'currency': 'COP',
        'ageLocMeMasterSku': '50010000'
    },
    'CR': {
        'tmzOffset': -6,
        'currency': 'CRC',
        'ageLocMeMasterSku': ''
    },
    'CZ': {
        'tmzOffset': 1,
        'currency': 'CZK',
        'ageLocMeMasterSku': '97010000'
    },
    'DE': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'DK': {
        'tmzOffset': 1,
        'currency': 'DKK',
        'ageLocMeMasterSku': '97010000'
    },
    'ES': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'ET': {
        'tmzOffset': 3,
        'currency': 'ETB',
        'ageLocMeMasterSku': ''
    },
    'EU': {
        'tmzOffset': 1
    },
    'FI': {
        'tmzOffset': 2,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'FJ': {
        'tmzOffset': 12,
        'currency': 'FJD',
        'ageLocMeMasterSku': ''
    },
    'FR': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'GB': {
        'tmzOffset': 0,
        'currency': 'GBP',
        'ageLocMeMasterSku': '97010000'
    },
    'GI': {
        'tmzOffset': 1,
        'currency': 'GIP',
        'ageLocMeMasterSku': ''
    },
    'GT': {
        'tmzOffset': -6,
        'currency': 'GTQ',
        'ageLocMeMasterSku': ''
    },
    'GU': {
        'tmzOffset': 10,
        'currency': 'USD',
        'ageLocMeMasterSku': ''
    },
    'HK': {
        'tmzOffset': 8,
        'currency': 'HKD',
        'ageLocMeMasterSku': '04010000'
    },
    'HN': {
        'tmzOffset': -6,
        'currency': 'HNL',
        'ageLocMeMasterSku': ''
    },
    'HU': {
        'tmzOffset': 1,
        'currency': 'HUF',
        'ageLocMeMasterSku': '97010000'
    },
    'ID': {
        'tmzOffset': 7,
        'currency': 'IDR',
        'ageLocMeMasterSku': '41010000'
    },
    'IE': {
        'tmzOffset': 0,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'IL': {
        'tmzOffset': 2,
        'currency': 'ILS',
        'ageLocMeMasterSku': ''
    },
    'IS': {
        'tmzOffset': 0,
        'currency': 'ISK',
        'ageLocMeMasterSku': '97010000'
    },
    'IT': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'JP': {
        'tmzOffset': 9,
        'currency': 'JPY',
        'ageLocMeMasterSku': '03010000'
    },
    'KR': {
        'tmzOffset': 9,
        'currency': 'KRW',
        'ageLocMeMasterSku': '18010000'
    },
    'LU': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'MO': {
        'tmzOffset': 8,
        'currency': 'MOP',
        'ageLocMeMasterSku': ''
    },
    'MX': {
        'tmzOffset': -6,
        'currency': 'MXN',
        'ageLocMeMasterSku': '08010000'
    },
    'MY': {
        'tmzOffset': 8,
        'currency': 'MYR',
        'ageLocMeMasterSku': '37010000'
    },
    'NC': {
        'tmzOffset': 11,
        'currency': 'NZD',
        'ageLocMeMasterSku': '16010000'
    },
    'NL': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'NO': {
        'tmzOffset': 1,
        'currency': 'NOK',
        'ageLocMeMasterSku': '97010000'
    },
    'NZ': {
        'tmzOffset': 12,
        'currency': 'NZD',
        'ageLocMeMasterSku': '16010000'
    },
    'PE': {
        'tmzOffset': -5,
        'currency': 'PEN',
        'ageLocMeMasterSku': ''
    },
    'PF': {
        'tmzOffset': 5,
        'currency': 'NZD',
        'ageLocMeMasterSku': '16010000'
    },
    'PH': {
        'tmzOffset': 8,
        'currency': 'PHP',
        'ageLocMeMasterSku': '24010000'
    },
    'PL': {
        'tmzOffset': 1,
        'currency': 'PLN',
        'ageLocMeMasterSku': '97010000'
    },
    'PR': {
        'tmzOffset': -4,
        'currency': 'USD',
        'ageLocMeMasterSku': ''
    },
    'PT': {
        'tmzOffset': 0,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'RO': {
        'tmzOffset': 2,
        'currency': 'RON',
        'ageLocMeMasterSku': '97010000'
    },
    'RU': {
        'tmzOffset': 3,
        'currency': 'RUB',
        'ageLocMeMasterSku': '40010000'
    },
    'SE': {
        'tmzOffset': 1,
        'currency': 'SEK',
        'ageLocMeMasterSku': '97010000'
    },
    'SG': {
        'tmzOffset': 8,
        'currency': 'SGD',
        'ageLocMeMasterSku': '36010000'
    },
    'SK': {
        'tmzOffset': 1,
        'currency': 'EUR',
        'ageLocMeMasterSku': '97010000'
    },
    'SV': {
        'tmzOffset': -6,
        'currency': 'SVC',
        'ageLocMeMasterSku': ''
    },
    'TH': {
        'tmzOffset': 7,
        'currency': 'THB',
        'ageLocMeMasterSku': '19010000'
    },
    'TR': {
        'tmzOffset': 2,
        'currency': 'TRY',
        'ageLocMeMasterSku': '40010000'
    },
    'TW': {
        'tmzOffset': 8,
        'currency': 'TWD',
        'ageLocMeMasterSku': ''
    },
    'UA': {
        'tmzOffset': 2,
        'currency': 'UAH',
        'ageLocMeMasterSku': '40010000'
    },
    'US': {
        'tmzOffset': -7,
        'currency': 'USD',
        'ageLocMeMasterSku': '01010000'
    },
    'VE': {
        'tmzOffset': -4,
        'currency': 'VEF',
        'ageLocMeMasterSku': ''
    },
    'VN': {
        'tmzOffset': 7,
        'currency': 'VND',
        'ageLocMeMasterSku': '53010000'
    },
    'WO': {
        'tmzOffset': -7
    },
    'WS': {
        'tmzOffset': -7
    },
    'ZA': {
        'tmzOffset': 2,
        'currency': 'ZAR',
        'ageLocMeMasterSku': '97010000'
    }
};


/**
 * Return information for all countries
 * @return {Object} map of countries
 * */
function getCountries() {
    return countries;
}


/**
 * return information for country
 * @param {string} country country code
 * @return {*}
 */
function getCountry(country) {
    if (country in countries) {
        return countries[country];
    } else {
        throw Error(`invalid country ${country}`);
    }
}


module.exports = {
    getCountries: getCountries,
    getCountry: getCountry
};
