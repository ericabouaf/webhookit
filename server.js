/**
 * server.js
 * 	- set up an Express.js server	
 * 	- load config file (depends on the environment)
 * 	- connect to mongoDB
 * 	- configure various middleware
 * 	- load controllers & helpers
 */
var express = require('express'),
	fs = require('fs'),
	Db = require('mongodb').Db,
	Server = require('mongodb').Server,
	connect = require('connect'),
	mongoStore = require('connect-mongodb');

// express server
var app = express.createServer();
app.root = __dirname;

// Load config file
app.config = require(app.root + '/config/' + app.set('env') + '.js');

// Database Connect to mongo
app.db = new Db(app.config.database.db, 
				new Server(app.config.database.host, app.config.database.port, app.config.database.options)
			);
console.log("Connecting to MongoDB...");

app.db.open(function(err) {
	
	// Don't start without MongoDB running
	if(err) {
		console.log(err);
		return;
	}
	
	// Middleware setup
	app.use(express.logger());				// Enable request logging	
	app.use(express.bodyParser());		// parses urlencoded request bodies which populates req.body
	app.use(express.methodOverride());	// sets a hidden input of _method to an arbitrary HTTP method 
	app.use(express.cookieParser());	// Required by session
	
	// Use connect-mongodb SessionStore
	app.use( connect.session({
		cookie: {maxAge: 60000 * 20}, // 20 minutes
		secret: app.config.sessions.secret,
		store: new mongoStore({db: app.db})
		})
	);
	
	// User model
	User = require(app.root + '/lib/user').init(app.db);
	
	// Authentication => populate req.current_user
	app.use(
		(function() {
			return function(req, res, next) {
				User.authenticate(req, res, function(current_user) {
					req.current_user = current_user;
					next();
				}, function() {
				    next();
				});
			};
		})()
	);
	
	app.dynamicHelpers({
		 // req.flash to html helper
		 messages: function(req, res){
		    return function(){
		        var buf = [],
		            messages = req.flash(),
		            types = Object.keys(messages),
		            len = types.length;
		        if (!len) {
		           return '';
	           }
		        buf.push('<div id="messages">');
		        for (var i = 0 ; i < len; ++i) {
		            var type = types[i],
		                msgs = messages[type], j;
		            buf.push('  <ul class="' + type + '">');
		            for (j = 0, len = msgs.length; j < len; ++j) {
		                var msg = msgs[j];
		                buf.push('    <li>' + msg + '</li>');
		            }
		            buf.push('  </ul>');
		        }
		        buf.push('</div>');
		        return buf.join('\n');
		    };
		},
		current_user: function(req, res){
			return req.current_user;
		}
	});
	
	app.use(app.router);
	app.use(express["static"](app.root + '/public'));
	
	app.set('views', app.root + '/lib/views');
	app.set('view engine', 'ejs');
	
	app.error(function(err, req, res, next){
		if (err.message == "Unauthorized") {
			res.render('401', { status: 401, locals: {	title: 'Unauthorized', action: 'error', error: err }});
		}
		else {
			res.render('500', { status: 500, locals: {	title: 'Error', action: 'error', error: err }});
		}
	});
	
	
	// Middleware for authentication checking
	app.require_login = function(req, res, next) {
		(!!req.current_user) ? next() : next(new Error('Unauthorized'));
	};
	
	// Require all helpers & controllers
	var loadDirs = ['helpers', 'controllers'];
	loadDirs.forEach(function(dir) {
		fs.readdirSync(app.root + '/lib/'+dir+'/').forEach(function(file) {
			// test if JS file
			if(file.substr(-3) == ".js") {
				require(app.root + '/lib/'+dir+'/'+file).expressRoutes(app);
			}
		});
	});
	
	// Catch all other routes
	app.use(function(req,res) { 
		res.render('404', { status: 404, locals: {	title: 'NotFound', action: 'error' }});
	} );

	// start the server
	app.listen(app.config.server.port, app.config.server.ip);
	
	console.log("App started in '"+app.set('env')+"' environment !\n" +
					"Listening on http://"+app.config.server.host+":"+app.config.server.port);

	// Intercept exceptions after init so that the server doesn't crash at each uncatched exception
	process.on('uncaughtException', function (err) {
		console.log('Caught exception: ' + err);
		console.log(err.stack);
	});
	
});