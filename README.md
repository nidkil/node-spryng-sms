# Node.js client for the Spryng SMS Gateway API

> npm install --save spryng-sms

## Usage

This sample shows how to initiate the client and send a text message:

```js
// ES5
const SmsApiClient = require('spryng-sms').SmsApiClient;

// ES6
import { SmsApiClient } from 'spryng-sms';

const client = new SmsApiClient({
  username: 'my-account',
  password: 'my-password'
});

const request = {
  allowLong: true,
  destination: '32123456789',
  route: 'BUSINESS', // or ECONOMY
  body: 'Hi there, this is a message.',
  sender: '0032111111111',
  reference: '1234567890'
};

client.send(request)
  .then(() => {
    console.log('SMS message has been sent.');
  })
  .catch(err => {
    console.log('Error sending SMS:', err);
  });
```

### Sending to multiple destinations

You can also specify multiple destinations:

```js
const request = {
  allowLong: true,
  destination: [ '32123456789', '32987654321' ],
  route: 'BUSINESS', // or ECONOMY
  body: 'Hi there, this is a message.',
  sender: '0032111111111',
  reference: '1234567890'
};

client.send(request)
  .then(() => {
    console.log('SMS message has been sent.');
  })
  .catch(err => {
    console.log('Error sending SMS:', err);
  });
```

### Checking your credit

```js
client.getRemainingCredit()
  .then((credit) => {
    console.log('Remaining credit:', credit);
  })
  .catch(err => {
    console.log(err);
  });
```
