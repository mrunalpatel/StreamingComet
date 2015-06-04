var request = require('request'); 
var config = require('./config.js');
var fieldmapping = require('./fieldmapping.js');


var SaveFieldMapping = function(fields){
	fieldmapping.fields = fields;
}

var process = function (contactData){
	
	var authenticationHeader = "Basic " + new Buffer(config.ELOQUA_USERNAME + ":" + config.ELOQUA_PASSWORD).toString("base64"); 
	request(
		{
			url: config.ELOQUA_URL + '/api/rest/2.0/data/contacts?search=' + contactData.sobject.Email + '&count=1&page=1',
			headers: {"Authorization" : authenticationHeader }
		},
	  function(error,response,body){
		var b = JSON.parse(body);
		if(b.total == 0){
			CreateContact(CreateRestApiContactPayload(contactData.sobject));
		}
		else 
		{
			UpdateContact(CreateRestApiContactPayload(contactData.sobject),b.elements[0].id);
		}
	});
	
	//if(contactData.event["type"] == 'deleted'){
	//	DeleteContact(contactData.sobject);
	//}
	
	
};

var contactExists = function int (contact){
	
};

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

var UpdateContact = function (contact, id){
	
	    console.log("id:"+id);
		console.log(config.ELOQUA_URL + '/api/rest/2.0/data/contact/' + id);
		contact.Id = id;
		console.log(JSON.stringify(contact));
		var authenticationHeader = "Basic " + new Buffer(config.ELOQUA_USERNAME + ":" + config.ELOQUA_PASSWORD).toString("base64"); 
		request.put(
			{
				url: config.ELOQUA_URL + '/api/rest/2.0/data/contact/' + id, 
				headers : { 
				            "Authorization" : authenticationHeader,
							"Content-type": "application/json"
				          },
				body: JSON.stringify(contact) 
			}
		).on('response',function(response)
				{
					if(response.statusCode == '200'){
						console.log("Contact updated in ELOQUA");
					}else{
						console.log(response.statusCode);
					}
				}
		).on('error',function(error)
				{
					console.log(error);
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

