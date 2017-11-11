var fs = require('fs');

exports.path_addresses = 'skype_addresses/addresses.json';
exports.dm2_group_id = 1509532962394;

exports.load_address = function(){
	var dm2_group_id = exports.dm2_group_id;
	var path_addresses = exports.path_addresses;
	var data_address = []

	fs.readFile(path_addresses, 'utf8', function readFileCallback(err, data){
	    if (err){
	        console.log(err);
	    } else {
	    	data_address = JSON.parse(data); //now it an object
	    	exports.data_address = data_address;
	    	//find dm2 group address
	    	for (var i=0; i<data_address.length; i++){
	    		if (data_address[i]["id"] == dm2_group_id){
	    			exports.dm2_group_address = data_address[i];
	    		}
	    	}
		}
	});
}

exports.add_address = function(address){
	var path_addresses = exports.path_addresses;
	exports.data_address.push(address);
	json = JSON.stringify(exports.data_address); //convert it back to json
	fs.writeFile(path_addresses, json, 'utf8', function(){}); // write it back 
}