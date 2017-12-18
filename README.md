# esn-chat-client

Client library for linagora.esn.chat module.

## Install

```
npm install @linagora/esn-chat-client
```

## Usage

```
const WebsocketClient = require('@linagora/esn-chat-client').WebsocketClient;

const client = new WebsocketClient({token, url, userId}));

client.on('message', message => {
  console.log('Got a message on channel', message);
});

client.connect();
```

or if you do not have your token or userId

```
const factory = require('@linagora/esn-chat-client').factory;

factory.get({url, username, password}).then(client => {
  client.on('message', message => {
    console.log('Got a message on channel', message);
  });

  client.connect();
});
```
