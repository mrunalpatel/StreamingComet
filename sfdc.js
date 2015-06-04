var request = require('request'); 
var config = require('./config.js');
var fieldmapping = require('./fieldmapping.js');

var SaveFieldMapping = function(fields){
	fieldmapping.fields = fields;
}

var process = function (contactData){
	
	if(contactData.event["type"] == 'created'){
		CreateContact(CreateRestApiContactPayload(contactData.sobject));
	}
	
	if(contactData.event["type"] == 'updated'){
		UpdateContact(contactData.sobject);
	}
	
	if(contactData.event["type"] == 'deleted'){
		DeleteContact(contactData.sobject);
	}
	
	
};

/*var CheckIfContactExist = function(contact){
	
	var authenticationHeader = "Basic " + new Buffer(config.ELOQUA_USERNAME + ":" + config.ELOQUA_PASSWORD).toString("base64"); 
	request.get(
		{
			url: config.ELOQUA_URL + '/data/contacts?search=' + contact.emailAddress &count=1&page=1&depth=complete
		}
	);
	
};*/

var CreateContact = function (contact){
		var authenticationHeader = "Basic " + new Buffer(config.ELOQUA_USERNAME + ":" + config.ELOQUA_PASSWORD).toString("base64"); 
		console.log(JSON.stringify(contact));
		request.post(
			{
				url: config.ELOQUA_URL + '/api/rest/2.0/data/contact', 
				headers : { 
				            "Authorization" : authenticationHeader,
							"Content-type": "application/json"
				          },
				body: JSON.stringify(contact) 
			}
		).on('response',function(response)
				{
					if(response.statusCode == '201'){
						console.log("New contact created in ELOQUA");
					}
					
					//console.log(response.body);
				}
		).on('error',function(error)
				{
					console.log(error);
					//console.log(error);
				}
			)
	};

var UpdateContact = function (contact){
	
		var authenticationHeader = "Basic " + new Buffer(config.ELOQUA_USERNAME + ":" + config.ELOQUA_PASSWORD).toString("base64"); 
		request.put(
			{
				url: config.ELOQUA_URL + '/api/rest/2.0/data/contact/id', 
				headers : { 
				            "Authorization" : authenticationHeader,
							"Content-type": "application/json"
				          },
				body: JSON.stringify(contact) 
			}
		).on('response',function(response)
				{
					if(response.statusCode == '201'){
						console.log("New contact created in ELOQUA");
					}
					
					//console.log(response.body);
				}
		).on('error',function(error)
				{
					console.log("error");
					//console.log(error);
				}
			)
	
};

var DeleteContact = function (contact){
	console.log(contact);
};

var CreateRestApiContactPayload = function(contactSobj){
	
	var restPayload = {};
	
	for (var key in contactSobj) {
		if (contactSobj.hasOwnProperty(key)) {
			if(key in fieldmapping.fields && fieldmapping.fields[key] in fieldmapping.StdFieldInternalToRestFieldMap)
			{
				restPayload[fieldmapping.StdFieldInternalToRestFieldMap[fieldmapping.fields[key]]] = contactSobj[key] 
			}
		}
	}
	return restPayload;
}
	
exports.process = process;
exports.SaveFieldMapping = SaveFieldMapping;

