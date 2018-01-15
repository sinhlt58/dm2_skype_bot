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
var utils = require('./utils');

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
	      var params = structjson.structProtoToJson(result.parameters);
	      //all the logic for each intent
	      //greeting intent
	      if (intentName == "greeting.new"){
		      	//check if the user is in the database yet ?
		      	//mongodb here
		      	//if find a user then say hi
		      	mongodbClient.findUserBySkypeId(skypeUserId, function(error, result){	
			      	if (result){
			      		sendEvent("event_greeting_have_met", {user_name: result['skype-user-name']}, function(responses){
			      			skypeSession.send(responses[0].queryResult.fulfillmentText);
			      		});
			      	}
			      	else{
			      		skypeSession.send(fulfillmentText);
			      	}		
		      	});
	      }
	      else if(intentName == "greeting.new.info.create"){
	      		//if all params are not empty then insert to mongodb
	      		var isNeedToInsert = true;
	      		console.log(params['user-name']);
	      		if (!utils.isEmpty(params)){
		      		for (var key in params){
		      			if (params.hasOwnProperty(key)){
		      				if (params[key] == ""){
		      					isNeedToInsert = false;	
		      				}
		      			}else{
		      				isNeedToInsert = false;
		      			}
		      			if (!isNeedToInsert){
		      				break;
		      			}	
		      		}	
	      		}else{
	      			isNeedToInsert = false;
	      		}
	      		//if the user has entered all the info
	      		if (isNeedToInsert){
	      			//insert to mongodb
	      			var userData = params;
	      			userData['skype-user-id'] = skypeUserId;
	      			userData['skype-user-name'] = skypeUserName;
	      			console.log("Insert userdata: " + JSON.stringify(userData));
	      			mongodbClient.insertUser(userData, function(error, result){
	      				if (error) throw error;
	      				skypeSession.send(fulfillmentText);
	      			});
	      		}else{
	      			skypeSession.send(fulfillmentText);
	      		}
	      }
	      //view info
	      else if (intentName == "info.show"){
	      		mongodbClient.findUserBySkypeId(skypeUserId, function(error, result){
			      	if (error) throw error;
			      	if (result){
			      		var infoMesg = "Here is your info!<br/>";
			      		infoMesg += "User name: " 		+ result['user-name'] + '<br/>';
			      		infoMesg += "Birth day: " 		+ result['birth-day'] + '<br/>';
			      		infoMesg += "HAN email: " 		+ result['han-email'] + '<br/>';
			      		infoMesg += "HAN team: "  		+ result['han-team'] + '<br/>';
			      		infoMesg += "HAN department: "  + result['han-department'] + '<br/>';
			      		infoMesg += "HAN position: "    + result['han-position'] + '<br/>';
			      		infoMesg += "Skype name: "      + result['skype-user-name'] + '<br/>';
			      		infoMesg += "Skype id: "  	    + result['skype-user-id'] + '<br/>';
			      		skypeSession.send(infoMesg);
			      	}
			      	else{ //if haven't met yet!
			      		skypeSession.send(fulfillmentText);
			      	}		      			
		      	});
	      }
	      //update info
	      //delete info
	      else if (intentName == "info.delete"){
	      		mongodbClient.findUserBySkypeId(skypeUserId, function(error, result){
			      	if (error) throw error;
			      	if (result){
					    mongodbClient.deleteUser(skypeUserId, function(error, result){
					      	if (error) throw error;
					      	if (result){
					      		skypeSession.send(fulfillmentText);
					      	}
					      	else{ //if haven't met yet!
					      		skypeSession.send("There is an error!");
					      	}		      			
				      	});
			      	}
			      	else{ //if haven't met yet!
			      		skypeSession.send("We haven't met yet!");
			      	}		      			
		      	});
	      }
	      else{
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