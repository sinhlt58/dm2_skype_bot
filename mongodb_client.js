var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var currentDb = null;

MongoClient.connect(url, function(err, db){
	currentDb =  db.db("han"); 
});

exports.findUserBySkypeId = function(skypeId, callback){
	currentDb.collection("users").findOne({"skype-user-id": skypeId}, function(err, result){
		callback(err, result);
	});
};

exports.insertUser = function(userData, callback){
	currentDb.collection("users").insertOne(userData, function(err, result) {
	    callback(err, result);
	});
};

exports.updateUser = function(skypeId, callback){

};

exports.deleteUser = function(skypeId, callback){
	currentDb.collection("users").deleteOne({"skype-user-id": skypeId}, function(err, result){
		callback(err, result);
	});
}