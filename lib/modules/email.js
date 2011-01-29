var Email = require('email').Email;

exports.run = function(params, cb) {
	
	 var myMsg = new Email({
	      from: 'noreply@webhookit.com',
	      to:   params["to"],
	      subject: params["subject"],
	      body: params["body"]
	    });

	// if callback is provided, errors will be passed into it
	// else errors will be thrown
	myMsg.send(function(err){
		if(err) {
			cb({"out": {error: err.message} });
		}
		else {
			cb({"out": "Success" });
		}
	});
	
};

exports.definition = {
   "name": "email",
	"category": "Sources",
   "container": {
		"icon": "/images/icons/arrow_right.png",
      "xtype": "WireIt.FormContainer",
		"title": "Email",
		"fields": [
			{"type": "email", "name": "to", "wirable": true, label: "To" },
			{"type": "string", "name": "subject", "wirable": true, label: "Subject" },
			{"type": "string", "name": "body", "wirable": true, label: "Body" }
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
