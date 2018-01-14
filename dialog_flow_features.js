/* Google dialog api*/
//process.env.GOOGLE_APPLICATION_CREDENTIALS = 'google_credential.json'
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'han-bot-e1f30058126a.json'
// const projectID   = 'helloworld-62977';
// const sessionsID  = 'helloworld-session-id';
const projectID   = 'han-bot';
const sessionsID  = 'han-bot-session-id';
const dialogflow  = require('dialogflow');
const sessionClient   = new dialogflow.SessionsClient();
const sessionPath     = sessionClient.sessionPath(projectID, sessionsID);
const weather     = require('weather-js');
const structjson = require('./structjson.js');
const languageCode = 'en-US';
/* Google dialog api end*/

var mongodbClient = require('./mongodb_client');

exports.processSkypeUserInput = function (skypeSession, msg) {
	//get skype user info
	var skypeAddress = skypeSession.message.address;
	var skypeUserId  = skypeAddress.user.id;
	var skypeUserName = skypeAddress.user.name;

	const request = {
	    session: sessionPath,
	    queryInput: {
	      text: {
	        text: msg,
	        languageCode: languageCode,
	      },
	    },
	};
	// detect intent from user input
	sessionClient.detectIntent(request).then(responses => {
	      const result = responses[0].queryResult;
	      var fulfillmentText = result.fulfillmentText;
	      var intentName = result.intent.displayName;

	      //all the logic for each intent
	      //greeting intent
	      if (intentName == "greeting.new"){
		      	//check if the user is in the database yet ?
		      	//mongodb here
		      	//if find a user then say hi
		      	//mongodbClient.insertUser({skypeUserId: skypeUserId, skypeUserName, skypeUserName});
		      	mongodbClient.findUserBySkypeId(skypeUserId, function(result){
			      	console.log(result);	
			      	if (result){
			      		sendEvent("event_greeting_have_met", {user_name: result.skypeUserName}, function(responses){
			      			skypeSession.send(responses[0].queryResult.fulfillmentText);
			      		});
			      	}else{
			      		skypeSession.send(fulfillmentText);
			      	}		
		      	});
		      	
	      }else{
	      		skypeSession.send(fulfillmentText);
	      }
	}).catch(err => {
	      console.error('ERROR: ', err);
	});
	/* Google dialog api end*/
}

function sendEvent(eventName, params, callback){
	const eventRequest = {
	  	session: sessionPath,
	  	queryInput: {
		  	event: {	  		
		  		name: eventName,
		  		parameters: structjson.jsonToStructProto(params),
		  		languageCode: languageCode
		  	}	  		
		}
	}
	sessionClient.detectIntent(eventRequest).then(responses => {
	     callback(responses); 
	}).catch(err => {
	      console.error('ERROR: ', err);
	});	
}