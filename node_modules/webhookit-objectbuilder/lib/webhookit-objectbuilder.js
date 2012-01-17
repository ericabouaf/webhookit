/**
 * ObjectBuilder
 */
exports.run = function(params, cb) {
	
	var obj = {};
	params["items"].forEach( function(pair) {
		var key = pair[0];
		var val = pair[1];
		obj[key] = val;
	});
	cb( {out: obj} );
	
};


exports.definition = {
	"name": "objectbuilder",
	"category": "String",
	"container": {
		"icon": "/images/icons/add.png",
		"xtype": "WireIt.FormContainer",
		"title": "objectbuilder",
		"fields": [ 
			{
             "type": "list",
             "name": "items",
             "listLabel": "Elements",
             "elementType": {type: 'combine', fields: [ { typeInvite: 'key' }, { typeInvite: 'value', wirable: true } ], separators: [false,":",false] }
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
