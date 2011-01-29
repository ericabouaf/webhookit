
var http = require('http'),
	 querystring = require('querystring'),
    URL = require('url'),
	 xml2js = require('xml2js');


exports.definition = {
   "name": "HTTP",
	"category": "Sources",
   "container": {
		"icon": "/images/icons/arrow_right.png",
      "xtype": "WireIt.FormContainer",
 		"title": "HTTP",
 		"fields": [
 			{"type": "string", "name": "url", "wirable": true, label: "Url" },
		{"type": "select", "name": "method", "wirable": false, label: "Method", choices: ["GET", "POST", "PUT", "DELETE", "HEAD"] } ,
		{"type": "select", label: "encoding", "name": "encoding", choices: ["application/json", "application/xml", "application/x-www-form-urlencoded"] },
		{"type": "list", "name": "urlparams", listLabel: 'Parameters', elementType: {type: 'combine', fields: [ { typeInvite: 'field' }, { typeInvite: 'value', wirable: true } ], separators: [false,":",false] } }
 		],
 		"terminals": [
	   {"name": "out", "direction": [0,1], "offsetPosition": {"left": 86, "bottom": -15}, "ddConfig": {
              "type": "output",
              "allowedTypes": ["input"]
           }
          }
   ]
    }
 };

exports.run = function(params, cb) {
	
	var url = URL.parse(params["url"]);

	var urlparams = {};
	params["urlparams"].forEach(function(p) {
		urlparams[p[0]] = p[1];
	});
	
	var port = url.port;
	if(!port) { port = 80; }
	
	var ssl = false;
	if( params["url"].substr(0,5) == "https" ) {
		ssl = true;
		port = 443;
	}
	
	var client = http.createClient(port, url.hostname, ssl);
	var path = url.pathname || '/';
	
	//if(params.method == "GET" || params.method == "DELETE") {
		path += '?'+querystring.stringify(urlparams);
	//}
	
	console.log(path);
	
	var request = client.request(params.method, path, {'host': url.hostname, "content-type": /*"application/x-www-form-urlencoded"*/ "multipart/form-data"});
	request.end();
	request.on('response', function (response) {
	  console.log('STATUS: ' + response.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(response.headers) );
	  response.setEncoding('utf8');
	  var complete = "";
	  response.on('data', function (chunk) {
		 	complete += chunk;
	  });
	  response.on('end', function () {
		
			r = complete;
			
			if(response.headers["content-type"]) {
				
				if( response.headers["content-type"] == "application/json" ||
					 response.headers["content-type"] == "text/javascript" ||
					 response.headers["content-type"] == "application/javascript") {
					r = JSON.parse(complete);
				}
			
				if(response.headers["content-type"] == "text/xml") {
					
					var parser = new xml2js.Parser();
					parser.addListener('end', function(result) {
					    cb({out: result });
					});
			    	parser.parseString(complete);
					return;
					
				}
			}
		
			cb( {out: r} );
	  });
	
	});
	
};