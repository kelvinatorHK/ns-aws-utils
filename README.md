# ns-aws-utils
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

log.setLevel('debug');  // Change the log level to 'debug' (default is 'info')
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

**To turn off the logging programmatically**
```javascript
// Note that if you set anything other than 'debug', 'info', 'warn', 'error',
// you basically turn off the logging
log.setLevel('off');
```
