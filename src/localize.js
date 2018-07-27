
const log = require('./logger');
const axios = require('axios');
const config = require('config');

/**
 * localize is called to get localized strings. It calls the localization service
 *  where the strings are cached once retrieved from the home service.
 *
 * @param stringInfos - each stringInfo contains a stringName and a set
 *                      of replacement variables if needed.
 * @param apps - a list of applications to look for the strings within
 * @param locales - the locales to get the translations for
 * @param replaceVarsBy - default is 'name' which does a name replacement.
 *                        the other options is 'order' which ignores the
 *                        name and replaces them in order.
 * @return {Promise.<*>}
 */
async function localize(stringInfos, apps, locales, replaceVarsBy) {
    let retVal;

    log.info({localizationRequest: {strings: stringInfos, apps: apps, locales: locales, replaceVarsBy: replaceVarsBy ? replaceVarsBy : 'name'}});
    if (Array.isArray(stringInfos) && Array.isArray(apps) && (locales ? Array.isArray(locales) : true)) {
        let response = await getTranslations(buildQueryParams(stringInfos, apps, locales));

        retVal = applyVariables(response, getStringVariables(stringInfos), replaceVarsBy);
    } else {
        log.error({localizationInvalidRequest: {strings: stringInfos, apps: apps, locales: locales}});
        throw Error('invalid request');
    }
    log.info({localizationResponse: retVal});

    return retVal.localizations;
}

/**
 * Applys the variables to the retrieved strings.
 *
 * @param translations - the retrieved string structures
 * @param variables - the requested stringInfos
 * @param replaceBy - name or order
 */
function applyVariables(translations, variables, replaceBy) {
    translations.localizations.forEach((translation) => {
        if (variables[translation.stringName]) {
            let localizedString = translation.localizedString;

            for (let varName in variables[translation.stringName]) {
                let replace = replaceBy === 'order' ? new RegExp(/<%.*?%>/) : `<%${varName}%>`,
                    varInfo = variables[translation.stringName];

                localizedString = localizedString.replace(replace, varInfo[varName]);
            }
            translation.localizedString = localizedString;
        }
    });
    return translations;
}

/**
 * Calls the localization service (http) to retrieve the string translations.
 *
 * @param queryParams - based on the requested strings, apps, and locales
 * @return {Promise.<*>}
 */
async function getTranslations(queryParams) {
    let retVal = null;

    try {
        let params = {
                method: 'GET',
                url: `${config.properties.awsBase}/localization/v1${queryParams}`,
                headers: {
                    'Content-Type': 'application/json'/* , TODO: uncomment if needed
                    'client_id': config.properties.clientId,
                    'client_secret': config.properties.clientSecret*/
                }
            },
            response = await axios(params);

        log.debug({localizeRead: response.data});

        retVal = response.data;
    } catch (err) {
        log.error({localizationError: err});
        throw Error(err.messages.toString());
    }
    return retVal;
}

/**
 * Puts string variables into an object keyed by stringName
 *
 * @param strings
 * @return {{}}
 */
function getStringVariables(strings) {
    let retVal = {};

    strings.forEach((string) => {
        retVal[string.stringName] = string.variables;
    });

    return retVal;
}

/**
 * Builds the query parameters for the localization service
 *
 * @param stringInfos
 * @param apps
 * @param locales
 * @return {string}
 */
function buildQueryParams(stringInfos, apps, locales) {
    let queryParams = '?string=';

    stringInfos.forEach((stringInfo, i, arr) => {
        queryParams += stringInfo.stringName;
        if (i < arr.length - 1) {
            queryParams += ',';
        }
    });
    queryParams += '&app=' + apps.toString();
    if (locales && locales.length > 0) {
        queryParams += '&locale=' + locales.toString();
    }
    return queryParams;
}

module.exports = localize;
