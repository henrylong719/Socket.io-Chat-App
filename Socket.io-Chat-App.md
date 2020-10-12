

## WebSocket



<img src="/Users/henrylong/Library/Application Support/typora-user-images/Screen Shot 2020-10-12 at 4.17.40 pm.png" alt="Screen Shot 2020-10-12 at 4.17.40 pm" style="zoom:50%;" />



### initialize



1. `npm init`

2. install express server `npm install express `

3. install nodemon `npm install nodemon --save-dev`

4. install socket.io `npm i socket.io`



**--save-dev** is used for modules used in development of the application,not require while running it in production envionment **--save** is used to add it in package.json and it is required for running of the application.



###  Set up Server 

Set up express server and serve static files

```javascript
index.js

const express = require('express');
var socket = require('socket.io');

// app setup
const app = express();
const port = 4000;

const server = app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// serve Static files
app.use(express.static('public'));

```





### Setup socket in the server side

```javascript
index.js

// socket setup
var io = socket(server);

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
```



### Setup socket in the client side



```javascript

chat.js

// make connection
var socket = io.connect('http://' + window.location.hostname + ':4000');

```



Now, whenever a client is connected we can get a distinctive id from each client, the terminal will show:

```bash
student-10-201-20-074:WebSockets Tutorial henrylong$ nodemon index.js 
app listening at http://localhost:4000
a user connected QIa3EXp6fCNydYhxAAAA
a user connected FHdB0OO6St_ze5T1AAAB
```



### Transfering data between client side and server side

1. get cdn from socket.io website and put it on the index.html

   

2. make connection in the chat.js 

* handle events in the **client side** chat.js and sent the message to the server using `Socket.emit(name of the message, data)` 

```javascript

chat.js

// make connection
var socket = io.connect('http://' + window.location.hostname + ':4000');
// Query Dom
let message = document.getElementById('message'),
  handle = document.getElementById('handle'),
  btn = document.getElementById('send'),
  output = document.getElementById('output'),
  feedback = document.getElementById('feedback');

// emit events
btn.addEventListener('click', () => {
  // socket.emit(name of the message, data)
  socket.emit('chat', {
    message: message.value,
    handle: handle.value,
  });
  message.value = '';
});

```



3. In the **server side**, receive the target chat and send the data to all connected sockets using `io.sockets.emit()`

```javascript
index.js

// socket setup
var io = socket(server);

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`);

  //  receive the target "chat" and send the data to all connected sockets
  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

```



3. in the **client side**, receive data from server and render the message on the index.html

```javascript
chat.js

// Listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = '';
  output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
});

```



### Add real time feedback 

1. in the **client side** listen keypress to event in message input area and emit the sender name to the server

```javascript

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
});

```



2. in the **server side**, receive the "typing" and sender's name and send it back to client side using `broadcast`

```javascript

 // receive the target "typing" and broadcast the sender's name to all OTHER sockets
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

```



3. In the **client side**, receive data from server and render the message on the index.html

```javascript

socket.on('typing', (data) => {
  feedback.innerHTML = `<p><em>${data} is typing a message...</em><p>`;
});

```







