/*
*  Homework 1 - Hello World API
*
*/


// Dependancies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Instantiate the server
var server = http.createServer(function(req, res) {

	// Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);
	
	// Get the path of the URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
    var queryStringObject = parsedUrl.query;

	// Get the HTTP method
	var method = req.method.toLowerCase();

	// Get the headers as an object
	var headers = req.headers;

	// Get the payload if there is one
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data', function (data) {
		buffer += decoder.write(data);
	});
	req.on('end', function (data) {
		buffer += decoder.end();

		// Choose a handler for this request.
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct a data object to send to the handler
		var data  = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

		// Route the request to the chosen handler
		chosenHandler(data, function (statusCode, payload) {
			// Use the status code called back from the handler, or return 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			// use the payload called back by the handler, or return an empty object.
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload to a JSON string
			var payloadString = JSON.stringify(payload);

			// Return a response
			res.setHeader('Content-type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log some stuff to the console
			console.log('Recieved this request: ', data);
			console.log('Returned this response: ', statusCode, payloadString)
			console.log('\n');

		});
	});   
});

server.listen(3000, function () {
	console.log('The server is running at port 3000');
});


// Define handlers
var handlers = {};

// Hello handler
handlers.hello = function (data, callback) {
    // Call back an HTTP status code and a payload object
    callback(200, {
    	'hello' : 'world',
    	'foo' : 'bar',
    	'welcome' : 'friends'
    });
};
// not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};
// Define a request router
var router = {
	'hello' : handlers.hello
};