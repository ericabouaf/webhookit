
var ejs = require('ejs');

/**
 * Template using EJS
 */
exports.run = function(params, cb) {
	var error, result;
	try {
		result = ejs.render(params["template"], { locals: params["in"] });
	} catch(ex) {
		error = ex;
	}
	if(error) {
		console.log(JSON.stringify(error));
		cb( {error: error.message} );
	}
	else {
		cb( {out: result} );
	}
	
};


exports.definition = {
   "name": "ejs",
	"category": "Templating",
   "container": {
		"icon": "/images/icons/script_edit.png",
      "xtype": "WireIt.TextareaContainer",
		"title": "ejs",
		"fields": [
			{"type": "text", "name": "template", "wirable": false }
		],
		"terminals": [
			{"name": "in", "direction": [0,-1], "offsetPosition": [82,-15], "ddConfig": {
             "type": "input",
             "allowedTypes": ["output"]
          },
          "nMaxWires": 1
         },
		   {"name": "out", "direction": [0,1], "offsetPosition": {"left": 86, "bottom": -15}, "ddConfig": {
             "type": "output",
             "allowedTypes": ["input"]
          }
         }
	   ]
   }
};

