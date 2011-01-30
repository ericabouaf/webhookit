
var YQL = require('yql');

exports.run = function(params, cb) {
	
	new YQL.exec(params.query, function(response) {
	
		cb({"out": response});
		
	}, {}, {"https": true});
	
};


exports.definition = {
   "name": "YQL",
	"category": "Sources",
   "container": {
		"icon": "/images/module_icons/yql.png",
      "xtype": "WireIt.TextareaContainer",
		"title": "YQL",
		"fields": [
			{"type": "text", "name": "query", "wirable": true }
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

