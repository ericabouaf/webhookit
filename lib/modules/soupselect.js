var select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    URL = require('url');

exports.run = function(params, cb) {
	
	var url = URL.parse(params["url"]);
	
	// fetch some HTML...
	var client = http.createClient(80, url.hostname);
	var request = client.request('GET', url.pathname || "/",{'host': url.hostname});

	request.on('response', function (response) {
	    response.setEncoding('utf8');

	    var body = "";
	    response.on('data', function (chunk) {
	        body = body + chunk;
	    });

	    response.on('end', function() {

	        // now we have the whole body, parse it and select the nodes we want...
	        var handler = new htmlparser.DefaultHandler(function(err, dom) {
	            if (err) {
						cb({"out": {error: err} });
	            } else {
                	var objs = select(dom, params.query);
						cb({"out": {items: objs} });
	            }
	        });

	        var parser = new htmlparser.Parser(handler);
	        parser.parseComplete(body);
	    });
	});
	request.end();
	
};


exports.definition = {
   "name": "soupselect",
	"category": "Sources",
   "container": {
		"icon": "/images/module_icons/yql.png",
      "xtype": "WireIt.FormContainer",
		"title": "soupselect",
		"fields": [
			{"type": "string", "name": "url", "wirable": true, label: "Url" },
			{"type": "string", "name": "query", "wirable": true, label: "Query" }
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




