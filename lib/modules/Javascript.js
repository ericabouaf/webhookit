
exports.run = function(params, cb) {
	
	console.log("Javascript module :");
	console.log(params);
	
	cb({out: ["ceci", 354, "une", "liste"]});
};


exports.definition = {
   "name": "Javascript",
	"category": "Sources",
   "container": {
		"icon": "/images/module_icons/yql.png",
      "xtype": "WireIt.TextareaContainer",
		"title": "Javascript",
		"fields": [
			{"type": "text", "name": "code", "wirable": true, value: "var list=[];\n	for(var i = 0 ;i < 10 ; i++) {\n	  list[i] = i*i;\n	}\n\n	response.object = {\n	  version: 3.14,\n	  square: list\n	};" }
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

