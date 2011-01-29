exports.expressRoutes = function(app) {

	app.get('/', function(req, res){
		res.redirect(req.current_user ? '/dashboard' : '/sessions/signin');
	});

	// Editor
	app.get('/editor', app.require_login, function(req, res){		
   	res.render('website/editor', { 
			layout: false,
			locals: {
				definitions: require(app.root + '/lib/simpleflow').definitions,
				current_user: req.current_user
			}
		});
	});
	
	// Dashboard
	app.get('/dashboard', app.require_login, function(req, res){
		
		app.db.collection('wirings', function(error, wiring_collection) {
			if(error) { throw error; }
			wiring_collection.find({ 
				$query: {user_id: req.current_user._id }, 
				$orderby: {updated_at: -1} }, {}, 0, 5, function(error, cursor) {
				 if(error) { throw error; }
	          cursor.toArray(function(error, wirings) {
					if(error) { throw error; }
					app.db.collection('activities', function(error, activities_collection) {
						if(error) { throw error; }
						activities_collection.find({ 
							$query: {user_id: req.current_user._id }, 
							$orderby: {created_at: -1} }, {}, 0, 5 ,function(error, cursor) {
							 if(error) { throw error; }
				          cursor.toArray(function(error, activities) {
								if(error) { throw error; }
				            res.render('website/dashboard', {
								  	locals: {
										title: "Dashboard",
										action: "dashboard",
								      user: req.current_user,
										wirings: wirings,
										activities: activities
									}
								});
				         });
						});
					});	
	         });
			});
		});
	});
	
	// Tools
	app.get('/tools', app.require_login, function(req, res){
	   res.render('website/tools', {
	      locals: { title: 'Tools', action: 'tools' }
	   });
	});
	
	// Find the user & display his wirings
	app.get('/activities', app.require_login, function(req, res){
		app.db.collection('activities', function(error, activities_collection) {
			if(error) { throw error; }
			activities_collection.find({ 
				$query: {user_id: req.current_user._id }, 
				$orderby: {created_at: -1} }, {}, 0, 5 ,function(error, cursor) {
				if(error) { throw error; }
	          cursor.toArray(function(error, activities) {
					if(error) { throw error; }
					res.render('website/activities', {
			        	locals: {
							title: "Activities",
							action: "activities",
							activities: activities
			        	}
			    	});
				});
			});
		});
	});
	
	
	
	// List wirings with cron
	app.get('/cron', app.require_login, function(req, res){
		
		// Load cron from wirings
		app.db.collection('wirings', function(error, collection) {	
			if(error) { throw error; }
			collection.find({ cron: {$nin: [null, "", undefined, "undefined"]} }, function (error, docs) {
				if(error) { throw error; }
	  			docs.toArray(function(error, wirings) {
					if(error) { throw error; }
					res.render('website/cron', {
				      locals: { 
							title: 'Tools', 
							action: 'cron',
							jobs: wirings
						}
				   });
				});
	  		});
		});
	   
	});


};