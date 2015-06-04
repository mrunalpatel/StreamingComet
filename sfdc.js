var request = require('request'); 
var config = require('./config.js');

var process = function (contactData){
	
	if(contactData.event["type"] == 'created'){
		CreateContact(contactData.sobject);
	}
	
	if(contactData.event["type"] == 'updated'){
		UpdateContact(contactData.sobject);
	}
	
	if(contactData.event["type"] == 'deleted'){
		DeleteContact(contactData.sobject);
	}
	
	
};

var CreateContact = function (contact){
		var authenticationHeader = "Basic " + new Buffer(config.ELOQUA_USERNAME + ":" + config.ELOQUA_PASSWORD).toString("base64"); 
		console.log(JSON.stringify(contact));
		request.post(
			{
				url:'https://devsecure.eloquacorp.com/api/rest/2.0/data/contact', 
				headers : { 
				            "Authorization" : authenticationHeader,
							"Content-type": "application/json"
				          },
				body: JSON.stringify(contact) 
			}
		).on('response',function(response)
				{
					console.log("response: " + response.statusCode);
					//console.log(response.body);
				}
		).on('error',function(error)
				{
					console.log("error");
					//console.log(error);
				}
			)
	};

var UpdateContact = function (contact){
	console.log(contact);
};

var DeleteContact = function (contact){
	console.log(contact);
};
	
exports.process = process;

