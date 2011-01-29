/**
 * StringBuilder
 */
exports.run = function(params, cb) {
	
	var obj = {};
	// TODO !
	/*params["items"].forEach( function(pair) {
		var key = pair[0];
		var val = pair[1];
		obj[key] = val;
	});*/
	cb( {out: obj} );
	
};

exports.definition = {
	"name": "StringBuilder",
	"category": "String",
	"container": {
		"icon": "/images/icons/add.png",
		"xtype": "WireIt.FormContainer",
		"title": "StringBuilder",
		"fields": [ 
			{
             "type": "list",
             "name": "liste",
             "listLabel": "Elements",
             "elementType": {"type": "string",	"wirable": true, "value": "" }
         }
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