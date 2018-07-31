'use strict';

const countries = {
    "AR": {
        "tmzOffset": -3
    },
    "AT": {
        "tmzOffset": 1
    },
    "AU": {
        "tmzOffset": 10
    },
    "BE": {
        "tmzOffset": 1
    },
    "BN": {
        "tmzOffset": 8
    },
    "BR": {
        "tmzOffset": -3
    },
    "CA": {
        "tmzOffset": -7
    },
    "CH": {
        "tmzOffset": 1
    },
    "CL": {
        "tmzOffset": -3
    },
    "CN": {
        "tmzOffset": 8
    },
    "CO": {
        "tmzOffset": -5
    },
    "CR": {
        "tmzOffset": -6
    },
    "CZ": {
        "tmzOffset": 1
    },
    "DE": {
        "tmzOffset": 1
    },
    "DK": {
        "tmzOffset": 1
    },
    "ES": {
        "tmzOffset": 1
    },
    "ET": {
        "tmzOffset": 3
    },
    "EU": {
        "tmzOffset": 1
    },
    "FI": {
        "tmzOffset": 2
    },
    "FJ": {
        "tmzOffset": 12
    },
    "FR": {
        "tmzOffset": 1
    },
    "GB": {
        "tmzOffset": 0
    },
    "GI": {
        "tmzOffset": 1
    },
    "GT": {
        "tmzOffset": -6
    },
    "GU": {
        "tmzOffset": 10
    },
    "HK": {
        "tmzOffset": 8
    },
    "HN": {
        "tmzOffset": -6
    },
    "HU": {
        "tmzOffset": 1
    },
    "ID": {
        "tmzOffset": 7
    },
    "IE": {
        "tmzOffset": 0
    },
    "IL": {
        "tmzOffset": 2
    },
    "IS": {
        "tmzOffset": 0
    },
    "IT": {
        "tmzOffset": 1
    },
    "JP": {
        "tmzOffset": 9
    },
    "KR": {
        "tmzOffset": 9
    },
    "LU": {
        "tmzOffset": 1
    },
    "MKTG": {
        "tmzOffset": -7
    },
    "MO": {
        "tmzOffset": 8
    },
    "MX": {
        "tmzOffset": -6
    },
    "MY": {
        "tmzOffset": 8
    },
    "NC": {
        "tmzOffset": 11
    },
    "NL": {
        "tmzOffset": 1
    },
    "NO": {
        "tmzOffset": 1
    },
    "NZ": {
        "tmzOffset": 12
    },
    "PF": {
        "tmzOffset": 5
    },
    "PH": {
        "tmzOffset": 8
    },
    "PL": {
        "tmzOffset": 1
    },
    "PR": {
        "tmzOffset": -4
    },
    "PT": {
        "tmzOffset": 0
    },
    "RO": {
        "tmzOffset": 2
    },
    "RU": {
        "tmzOffset": 3
    },
    "SE": {
        "tmzOffset": 1
    },
    "SG": {
        "tmzOffset": 8
    },
    "SK": {
        "tmzOffset": 1
    },
    "SV": {
        "tmzOffset": -6
    },
    "TH": {
        "tmzOffset": 7
    },
    "TR": {
        "tmzOffset": 2
    },
    "TW": {
        "tmzOffset": 8
    },
    "UA": {
        "tmzOffset": 2
    },
    "US": {
        "tmzOffset": -7
    },
    "VE": {
        "tmzOffset": -4
    },
    "VN": {
        "tmzOffset": 7
    },
    "WBR": {
        "tmzOffset": -7
    },
    "WO": {
        "tmzOffset": -7
    },
    "WS": {
        "tmzOffset": -7
    },
    "ZA": {
        "tmzOffset": 2
    }
};


/**
 * Return information for all countries
 * @return Map */
function getCountries() {
    return countries;
}


/**
 * return information for country
 * @param country
 * @return {*}
 */
function getCountry(country) {
    return countries[country];
}


module.exports = {
    getCountries: getCountries,
    getCountry: getCountry
};
