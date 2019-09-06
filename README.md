# ns-aws-utils (DEPRECATED!!! This project has been moved to gitlab at ns-aws-servces/ns-aws-utils)
ns-aws-utils is a utility library that helps the development of the
serverless application.  It contains a cors function to add the CORS
headers to the client HTTP response.  Meanwhile, it contains a custom
logging package. This logging package enables the developer to log
the message into a different log level.  Then, Kibana can filter
the log instance according to the log level and given fields.
When a developer tries to log a JSON object, the logging package will
try to 'scrub'/mask the sensitive information (e.g., password).  The
sensitive information is determined by the key field.  For example,
if the key of the field is called 'Card Number', it is considered as
a sensitive information.

## NPM and Github Repo
https://www.npmjs.com/package/ns-aws-utils
<br />
https://github.com/kelvinatorHK/ns-aws-utils

## Installation
```sh
npm install ns-aws-utils
```
For adding ns-aws-utils to the package.json:
```sh
npm install ns-aws-utils --save
```

## Usage

### For Country Information
Information for all supported countries which includes selected timezone offset.

```javascript
const cntry = require('ns-aws-utils').countries;

// return all countries
let countries = getCountries();
```
Information for a specific country.
```javascript
const cntry = require('ns-aws-utils').countries;

// for specific country
let country = getCountry(country);
```

### For CORS handler:
Just wrap the handler function with the cors function:
```javascript
const cors = require('ns-aws-utils').cors;

exports.handler = cors(function(event, context, callback) {

    // ... doing your work ...


    var res = { statusCode: 200, body: 'Hello' };
    callback(null, res);
});
```

You can supply your options instead of using a default one:
```javascript
const cors = require('ns-aws-utils').cors;

const options = {
    origins: ['http://www.google.com', 'http://www.amazon.com'],
    allowCredentials: false,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
    maxAge: null
};

exports.handler = cors(function(event, context, callback) {

     // ... doing your work ...

    var res = { statusCode: 200, body: 'Hello' };
    callback(null, res);
}, options);
```

### For Custom Logging:
```javascript
const nsAwsUtils = require('ns-aws-utils');
const log = nsAwsUtils.logger;

// if you do not set the log level, the default is 'info'
log.setLevel('debug');  // Change the log level to 'debug'
log.config.level = 'debug'; // Or you can change the log level this way

log.debug('Hello debug');
log.info('Hello info');
log.warn('Hello warn');
log.error('Hello error');
```

Then, you will see the following result:
```
{"level":"debug","msg":{"message":"hello debug"}}
{"level":"info","msg":{"message":"hello info"}}
{"level":"warn","msg":{"message":"hello warn"}}
{"level":"error","msg":{"message":"hello error"}}
````


**Note that it is recommended to log a JSON structure instead of string**
```javascript
log.info({myAttribute: 'it is cool'});
```

Then, the result will not have the default 'message' as the key
```
{"level":"info","msg":{"myAttribute":"it is cool"}}
```

**To turn off the logging programmatically:**
```javascript
// Note that if you set the level anything other than 'debug', 'info', 'warn', 'error',
// you basically turn off the logging
log.setLevel('off');
```

**To turn off scrubbing programmatically:**

Sensitive data scrubbing is turned on by default.  You can turn it off:
```javascript
log.setScrubbing(false);
```

**For setting a tag (perpetual):**

Note that the log message will only display the last tag you set before logging the message
```javascript
log.setTag('My new tag');  // set the tag with a string
// Note that the second setTag() overwrite the previous tag
log.setTag({requestId: 'some Id', resourceId: '12345'}); // set the tag with a JSON object
log.info({myMessage: 'message 1'});
log.info({myMessage: 'message 2'});
```

Then, the result will look like the following:
```
{"level":"info","tag":{"requestId":"some Id","resourceId":"12345"},"msg":{"myMessage":"message 1"}}
{"level":"info","tag":{"requestId":"some Id","resourceId":"12345"},"msg":{"myMessage":"message 2"}}
```

If you want to remove the tag, just pass nothing or set it to null/empty string:
```javascript
log.setTag();  // remove the tag (method #1)
log.setTag('');  // remove the tag (method #2)
log.setTag(null);  // remove the tag (method #3)
```

If you want to append more information to the current tag, you can use addTag:
```javascript
log.setTag({key1: 'abc'});
log.addTag({key2: 'xyz'});
log.info({myMessage: 'message 1'});
```

Then, the result will look like the following:
```
{"level":"info","tag":{"key1":"abc","key2":"xyz"},"msg":{"myMessage":"message 1"}}
```

### For Localization handler:

The localization handler retrieves localized strings from the string cache in 
the home system and stores them in a Dynamo table and then returns them to the 
requester in a lazy load pattern.  The strings are cached in AWS's API Gateway 
for an hour and stored indefinately in Dynmo.  The strings can be expired in 
Dynamo with a manual HTTP call.

**Note:** A property named awsBase needs to be set in the calling project set
to the AWS base URL to call the Localization service. ex. https://devapi.cloud.nuskin.com

**Parameters**

-   stringInfos: array of stringInfo structures.
-   apps: array of application names to look for the strings in.
-   locales: (optional) array of locales in order of return priority. If not specified will look for a locale in the Accept-language header. If not found there then will default to en_US.
-   replaceVarsBy: 'order' - (optionsl) replace variables in order, 'name' (default) replace variables by matching the name with the placeholder in the string.

**Usage example:**
```javascript
const nsAwsUtils = require('ns-aws-utils');
const localize = nsAwsUtils.localize;

let localizations = localize(
    [
        {
            stringName: 'string1'
        },
        {
            stringName: 'string2',
            variables: {
                varName1: 'replace value1',
                varName2: 'replace value2'
            }
        }
    ],
    ['shop', 'common'],
    ['es_ES', 'en_ES'],
    'order'
)
```
**Returns:**
```json
[
    {
        "stringName": "string1",
        "localizedString": "This is string one"
    },
    {
        "stringName": "string2",
        "localizedString": "This replace value1 string replace value2"
    }
]
```

### For Correlation
Correlation provides for extracting and retaining a correlation ID that can be used in log statements to 
correlate transactions between applications. The correlation is the first value found in the following sequence. 
The correlation ID should be logged as the 'nse.correlation_id'. The logging setTag or addTag functions can help with this.

1. X-Correlation-ID or X-Request_ID header coming from the client. This allows the client to correlate its requests
 with services processing.
2. The xray trace id  X_AMZN_TRACE_ID. This will allow us to also pull up the XRAY trace of the AWS resources.
3. The “awsRequestId”. This is provided early in the transaction so will be available from the beginning.
4. Generated UUID or one from ns-aws-utils (I think you mentioned it provides one).

**Usage example:**
```javascript
const nsAwsUtils = require('ns-aws-utils');
const correlate = nsAwsUtils.correlate;

// capture and save the correlation ID from the event or the context as per the rules
let correlationId = correlate.captureCorrelationId(event, context);

// retrieve a previously saved correlation ID
let correlationId = correlate.retrieveCorrelationId();

// add the correlation id as a tag that will be added to each log message
log.addTag( {'nse.correlation_id': correlationId} )
```
