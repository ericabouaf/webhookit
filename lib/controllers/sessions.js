exports.expressRoutes = function(app) {
	
	// Sign In page
	app.get('/sessions/signin', function(req, res){
		res.render('sessions/signin', {
      	locals: { title: 'Sign In' }
   	});
	});

	// Login action
	app.post('/sessions/signin', function(req, res){
		User.authenticateWith( req.param("username"), req.param("pass"), req, res, function(user) {
			res.redirect('/dashboard');
		}, function(err) {
			req.flash('error', err.message);
			res.redirect('/sessions/signin');
		});
	});

	app.get('/sessions/signup', function(req, res) {
		res.render('sessions/signup', {
      	locals: { title: 'Signup', action: 'signup' }
   	});
	});

	// Signup
	app.post('/sessions/signup', function(req, res) {
	
		User.create({
			name: req.param("username"),
			email: req.param("email"),
			password: req.param("pass"),
			password_confirmation: req.param("pass2"),
			created_at: new Date()
		}, function(errors, user) {
			if(errors.length > 0) {
				req.flash('error', errors);
				res.redirect('/sessions/signup');
			}
			else {
		 		// log me in !
				req.session.user_id = user._id;
				res.redirect('/dashboard');
			}
		}, function(err) {
			req.flash('error', err.message);
			res.redirect('/sessions/signin');
		});
	
	});

	// logout
	app.get('/sessions/logout', function(req, res){
		req.flash('info', 'See you later...');
		User.clear_session(req);
		res.redirect('/sessions/signin');
	});

};