var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var currentDb = null;

MongoClient.connect(url, function(err, db){
	currentDb =  db.db("han"); 
});

exports.findUserBySkypeId = function(skypeId, callback){
	var result = null;
	currentDb.collection("users").findOne({skypeUserId: skypeId}, function(err, result){
		if (err) throw err;
		callback(result);
	});
};

exports.insertUser = function(userData){
	currentDb.collection("users").insertOne(userData, function(err, res) {
	    if (err) throw err;
	});
};

exports.editUser = function(){

};