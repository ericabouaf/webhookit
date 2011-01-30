exports.expressRoutes = function(app) {

	// store the user collection into req.user_collection
	function get_user_collection(req, res, next) {
		app.db.collection('users', function(error, user_collection) {
			if(error) { throw error; }
			else {
				req.user_collection = user_collection;
				next();
			}
		});
	}

	// List users
	app.get('/users', app.require_login, get_user_collection, function(req, res){
		req.user_collection.find({}, function(error, cursor) {	
			if(error) { throw error; }
     		cursor.toArray(function(error, results) {
				if(error) { throw error; }
				res.render('users/users', {
		        	locals: {
						title: "Users",
						action: "users",
		            users: results
		        	}
          	});
			});
		});
	});
	
	// Show User
	app.get('/users/:username', app.require_login, get_user_collection, function(req, res){
		req.user_collection.findOne({ name : req.param('username') }, function(error, user) {	
			if(error) { throw error; }
     		res.render('users/show', {
		       locals: {
					title: "Users",
					action: "users",
		         user: user
		    	 }
         });
		});
	});

};