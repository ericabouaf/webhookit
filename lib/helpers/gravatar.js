exports.expressRoutes = function(app) {

	var crypto = require('crypto');

	app.helpers({
   	gravatar: function(email, s) { 
			var emailMD5 = crypto.createHash('md5').update(email).digest("hex");
			if(!s) { s = 48; }
			return '<img src="http://www.gravatar.com/avatar/'+emailMD5+'?s='+s+'" class="gravatar"/>';
		}	
	});

};
