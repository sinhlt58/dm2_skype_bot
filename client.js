var io = require('socket.io-client');
var socket = io.connect('https://dm2bot.tk', {reconnect: true});

socket.emit('chat message', "Hi from client");

socket.on('chat message', function(msg){
	console.log("Connected!");
	console.log(msg);
});