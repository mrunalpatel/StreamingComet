var express = require('express');
var bodyParser = require('body-parser');
var nforce = require('nforce');
var config = require('./config.js');
var sfdc = require('./sfdc.js');
var app = express();
app.use(bodyParser.json());
var org = nforce.createConnection({
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  redirectUri: config.CALLBACK_URL + '/oauth/_callback',
  apiVersion: 'v32.0',
  mode: 'single' 
});

var accs = null;

app.get('/', function (req, res) {
  
  res.send('Hello World!');
       
});

app.post('/Subscribe',function(req,res){

		if(accs!=null){
			accs.client.disconnect(); //disconnect existing connection
		}
		
		if(req.body.Name != '' && req.body.fields != null){
			console.log("Subscribing to push topic : "+ req.body.Name);

			sfdc.SaveFieldMapping(req.body.fields);
			
		    //Subscribe to Salesforce api
			org.authenticate({ username: config.SFDC_USERNAME, password: config.SFDC_PASSWORD, securityToken: config.SFDC_SECURITYTOKEN }, function(err, resp) {
			
			if(err) return console.log(err);
			
			oauth = resp;
			
			//Get Topic name from req object and return guid for subscription that php client can use to unsubscribe
			accs = org.subscribe({ topic: req.body.Name}); 
			
			accs.on('error', function(err) {
				console.log('subscription error');
				console.log(err);
				accs.client.disconnect();
			});
			
			accs.on('data', function(data) {
				console.log(data);
				sfdc.process(data);
			});
			
			});
			
			res.send('Subscribed to : ' + req.body.Name);
		}
	}
);

app.post('/test',function(req,res){

		sfdc.process(req.body);
		//Subscribe to Salesforce api
		
	}
);

 app.post('/Unsubscribe',function(req,res){

 		//Unsubscribe from Salesforce api
 }
 );

var server = app.listen(config.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
