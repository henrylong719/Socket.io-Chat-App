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

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);
});

// Listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = '';
  output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
});

socket.on('typing', (data) => {
  feedback.innerHTML = `<p><em>${data} is typing a message...</em><p>`;
});
