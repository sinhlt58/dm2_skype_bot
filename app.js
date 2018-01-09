'use strict';

var builder = require('botbuilder')

var express = require('express')

var google_sheets = require('./google_sheets')
var schedule = require('node-schedule');
var address_manager = require('./address_manager');

google_sheets.init();
address_manager.load_address();

var fs = require('fs');
var app = express();

/* Google dialog api*/
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'google_credential.json'
const projectID   = 'helloworld-62977';
const sessionsID  = 'helloworld-session-id';
const dialogflow  = require('dialogflow');
const sessionClient   = new dialogflow.SessionsClient();
const sessionPath     = sessionClient.sessionPath(projectID, sessionsID);
const weather     = require('weather-js');
/* Google dialog api end*/

var server = app.listen(process.env.port || process.env.PORT || 3978, function(){
	var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

var io = require('socket.io')(server);

var connector = new builder.ChatConnector({
	appId: "0805a4e3-ec99-4153-ae84-409ffd4fbac7",
	appPassword: "J5cix0hUQWmVEyg6dFeFvki"
});

/* ------------- Replay Syke message here ------------- */
app.post('/api/messages', connector.listen())
var ads = {}
var bot = new builder.UniversalBot(connector, function(session){
	var msg = session.message.text;
	msg = msg.replace("@dm2b ", "");
	ads = session.message.address;
	console.log("Here!");
	/*if (msg == "init"){ //temperary comment
		ads = session.message.address;
		session.send("Save current address!");
	}else if (msg == "find revision"){
		io.emit('chat message', "find revision");
	}else{
		session.send("Echo: " + msg);
		io.emit('chat message', msg);
	}*/
	/* Google dialog api*/
	  const request = {
	    session: sessionPath,
	    queryInput: {
	      text: {
	        text: msg,
	        languageCode: 'en-US',
	      },
	    },
	  };

	  // send request and log result
	  sessionClient
	    .detectIntent(request)
	    .then(responses => {
	      const result = responses[0].queryResult;
	      var resultText = result.fulfillmentText;
	      //console.log(result);
	      //session.send("result.fulfillmentText: " + resultText);//send to Skype
	      session.send(JSON.stringify(result));
	    })
	    .catch(err => {
	      console.error('ERROR: ', err);
	    });
	/* Google dialog api end*/  
});

/* ------------- Socket IO get messeages from DM2 bot client -------- */
io.on('connection', function(socket){
	socket.on('chat message', function(cmsg){
		//io.emit('chat message', 'from server echo: ' + msg);
		var msg = new builder.Message().address(ads);
		tokens = cmsg.split(" ");
		if (tokens[0] == "dm2_notify_build"){
			msg.text(tokens[1] + " is ready!");
			bot.send(msg);
		}
	});
});

/*Send proactive messages*/
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

app.get('/create_dailytasks', function(req, res){
	createDailyTasks();
	res.sendStatus(200);
});

function createDailyTasks(){
	google_sheets.createDailyTasks();
}

schedule.scheduleJob('0 45 7 * * 1-5', function(){
  	createDailyTasks();
});

var j = schedule.scheduleJob('0 5 10 * * 1-5', function(){
  	var msg = new builder.Message().address(address_manager.dm2_group_address);
	msg.text("Remind daily tasks from DM2 BOT! \n" + 
			 "Link: https://docs.google.com/spreadsheets/d/1cNptK-AcRUHzEPsI122BwHLe9YwVz0Eaxp4VxtIUCgA/edit#gid=1753802151\n" +
			 " Template has been created!\n" +
			 " Have a nice day!\n");
	bot.send(msg);
});