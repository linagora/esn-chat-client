# esn-chat-client

Client library for linagora.esn.chat module.

## Install

```
npm install esn-chat-client
```

## Usage

```
const WebsocketClient = require('esn-chat-client').WebsocketClient;

const client = new WebsocketClient({token, url, userId}));

client.on('message', message => {
  console.log('Got a message on channel', message);
});

client.connect();
```

or if you do not have your token or userId

```
const factory = require('esn-chat-client').factory;

factory.get({url, username, password}).then(client => {
  client.on('message', message => {
    console.log('Got a message on channel', message);
  });

  client.connect();
});
```
