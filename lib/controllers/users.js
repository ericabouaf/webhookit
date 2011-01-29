exports.expressRoutes = function(app) {

	// List users
	app.get('/users', app.require_login, function(req, res){
		app.db.collection('users', function(error, user_collection) {
			if(error) { throw error; }
			user_collection.find({}, function(error, cursor) {	
				if(error) { throw error; }
      		cursor.toArray(function(error, results) {
					if(error) { throw error; }
					res.render('website/users', {
			        	locals: {
							title: "Users",
							action: "users",
			            users: results
			        	}
	          	});
				});
			});
		});
	});

};