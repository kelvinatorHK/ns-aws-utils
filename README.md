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