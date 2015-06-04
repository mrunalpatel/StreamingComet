var express = require('express');
var nforce = require('nforce');
var config = require('./config.js');

var app = express();
var org = nforce.createConnection({
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  redirectUri: config.CALLBACK_URL + '/oauth/_callback',
  apiVersion: 'v33.0',
  mode: 'single' 
});

app.get('/', function (req, res) {
  
  res.send('Hello World!');
  //Subscribe to Salesforce api
  org.authenticate({ username: config.SFDC_USERNAME, password: config.SFDC_PASSWORD, securityToken: config.SFDC_SECURITYTOKEN }, function(err, resp) {

  if(err) return console.log(err);

  oauth = resp;
 
 //Get Topic name from req object and return guid for subscription that php client can use to unsubscribe
  var accs = org.subscribe({ topic: 'PushTopicFromAPI'}); 

  accs.on('error', function(err) {
    console.log('subscription error');
    console.log(err);
    accs.client.disconnect();
  });

  accs.on('data', function(data) {
    console.log(data);
  });

  });     
});

app.post('/Subscribe',function(req,res){

        console.log('inside subscribe');
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
