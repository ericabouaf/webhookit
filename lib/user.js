exports.init = function(db) {

   var ObjectID = require('mongodb').ObjectID;

	User = function(values) {
		if(values) {
			for(var k in User.fields) {
				this[k] = values[k];
			}
		}
	};
	
	User.fields = {
		_id: {},
		name: {},
		email: {},
		password: {},
		created_at: {},
		debug_runs: {},
		public_runs: {},
		
		// attribute accessors
		password_confirmation: {}
	};
	
	
	/**
	 * Use this in your logout action
	 */
	User.clear_session = function(req) {
		req.session.user_id = null;
	};
	
	
	/**
	 * Default error callback, add a flash and redirect to login page
	 */
	User.failed = function(req, res, message) {
		req.flash('error', message);
		res.redirect('/sessions/signin');
	};

	User.create = function(values, cb, errb) {
		var errors = []; // might return [, , ]
		var reg_email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		var reg_name = /^[^ \/\\]{1,20}$/;
		
		if(values.password.length < 5) { errors.push("password too short"); }
		if(values.password_confirmation != values.password) { errors.push("passwords are not equal"); }
		delete values["password_confirmation"];
		if(!reg_name.test(values.name)) { errors.push("username not valid"); }
		if(!reg_email.test(values.email)) { errors.push("email not valid"); }
		
		db.collection('users', function(err, collection) {
			collection.findOne({name: values.name}, function(err, user) {
				if(err) {errb(err); return; }
				if(user) { errors.push("username already taken"); }
				collection.findOne({email: values.email}, function(err, user) {
					if(err) {errb(err); return; }
					if(user) { errors.push("email already registered"); }
					if(errors.length > 0) { cb(errors, null); return; }
					collection.insert(values, function(err, docs) {
						if(err) {errb(err); return; }
						cb(errors, docs[0]);
					});
				});
			});
	  });
	};
	
	


	/** 
	 * For use in your login action
	 */
	User.authenticateWith = function(username, password, req, res, cb, errb) {
		User.login(username, password, function(user) {
			req.session.user_id = user.getId();
			cb(user);
		}, function(err) {
			errb(err);
		});
	};

	/**
	 * Authenticate a request against this authentication instance.
	 * @return
	 */
	User.authenticate = function(req, res, cb, errorCallback) {
		
		var errb = function(err) {
			if(errorCallback) {
				errorCallback(err);
			}
			else {
				self.failed(req, res, "Not logged in !");
			}
		};
		
		var self = this;
		var user_id = req.session.user_id;
		if(user_id) {
			User.findById(user_id, function(user) {
				req.session.user_id = user.getId();
				cb(user);
			}, function(err) {
				req.session.user_id = null;
				if(errb) { 
					errb(err); 
				}
				else {
					self.failed(req, res, err.message);
				}
			});
			return;
		}
		
		
		// From Basic Auth
	   if (req.headers['authorization']) {
			var auth = this._decodeBase64(req.headers['authorization']);
			if(auth) {
	      	User.login(auth.username, auth.password, function(user) {
					cb(user);
				}, function(err) {
					if(errb) { 
						errb(err); 
					}
					else {
						self.failed(req, res, err.message);
					}
				});
				return;
			}
	  	}

		errb({message: "Not logged in !"});
	};


	/**
	 * Internal method for extracting username and password out of a Basic
	 * Authentication header field.
	 * 
	 * @param headerValue
	 * @return
	 */
	User._decodeBase64 = function(headerValue) {
	    var value;
	    if (value = headerValue.match("^Basic\\s([A-Za-z0-9+/=]+)$")) {
	        var auth = (new Buffer(value[1] || "", "base64")).toString("ascii");
	        return {
	            username : auth.slice(0, auth.indexOf(':')),
	            password : auth.slice(auth.indexOf(':') + 1, auth.length)
	        };
	    }
	    return null;
	};

	User.findByName = function(name, cb, errb) {
		db.collection('users', function(error, user_collection) {
			user_collection.findOne({name: name}, function(error, user) {
				cb(new User(user));
			});
		});
	};

	User.findById = function(user_id, cb, errb) {
		var self = this;
		db.collection('users', function(err, collection) {
			if(err) {errb(err); return; }
			collection.find({_id: new ObjectID(user_id) } , function(err, cursor) {
				if(err) {errb(err); return; }
			   cursor.toArray(function(err, results) {
					if(err) {errb(err); return; }
					if(results.length === 0) {errb({message: "username or email not found"}); return; }
					var user = results[0];
					cb( new User(user) );
				});
			});
		});
	};

	User.login = function(username, password, cb, errb) {
		var self = this;
		db.collection('users', function(err, collection) {
			if(err) {errb(err); return; }
			collection.find({ $or : [ { name : username } , { email : username } ] } , function(err, cursor) {
				if(err) {errb(err); return; }
			   cursor.toArray(function(err, results) {
					if(err) {errb(err); return; }
					if(results.length === 0) {errb({message: "username or email not found"}); return; }
					var user = results[0];
					if(password != user.password) {
						errb({message: "wrong password"});
						return; 
					}
					cb( new User(user) );
				});
			});
		});
	};

	User.prototype = {
	
		getId: function() {
			return this._id;
		}
	
	};


	return User;

};
