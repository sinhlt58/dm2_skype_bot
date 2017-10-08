var builder = require('botbuilder')

var express = require('express')
// var fs = require('fs')
// var https = require('https')

// var privateKey  = fs.readFileSync('sslcert/server-key.pem', 'utf8');
// var certificate = fs.readFileSync('sslcert/server-cert.pem', 'utf8');
// var credentials = {
// 	key: privateKey,
// 	cert: certificate,
//     requestCert: false,
//     rejectUnauthorized: false	
// };

var app = express();

//var httpsServer = https.createServer(credentials, app); 

var server = app.listen(process.env.port || process.env.PORT || 3978, function(){
	var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

var connector = new builder.ChatConnector({
	appId: "0805a4e3-ec99-4153-ae84-409ffd4fbac7",
	appPassword: "J5cix0hUQWmVEyg6dFeFvki"
});

app.post('/api/messages', connector.listen())
var ads = {}
var bot = new builder.UniversalBot(connector, function(session){
	session.send("Hello world!");
	ads = session.message.address;
});

/*Send message*/
function sendProactiveMessage(address){
	var msg = new builder.Message().address(address);
	msg.text("The build process has finished!");
	bot.send(msg);
}

function notify(req, res, next){
	//res.send('The build process has finished!');
	sendProactiveMessage(ads);
}

app.get('/build_notify', notify)