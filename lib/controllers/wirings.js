exports.expressRoutes = function(app) {

	var ObjectID = require('mongodb').ObjectID,
		 simpleflow = require(app.root + '/lib/simpleflow'),
		 ejs = require('ejs'),
		 cron = require('cron');
	
	// store the wiring collection into req.wiring_collection
	function get_wiring_collection(req, res, next) {
		app.db.collection('wirings', function(error, wiring_collection) {
			if(error) { throw error; }
			else {
				req.wiring_collection = wiring_collection;
				next();
			}
		});
	}
	
	// store the wiring document into req.wiring
	function get_wiring( req, res, next) {
		req.wiring_collection.findOne({
					user_id: req.current_user._id, 
					_id: ObjectID.createFromHexString(req.param('id')) 
			}, function(error, wiring) {
				if(error) { throw error; }
				req.wiring = wiring;
				next();
			});
	}
	

// Display and search wirings
app.get('/wirings', app.require_login, get_wiring_collection, function(req, res){
		
	// TODO: pagination
	
	// Search
	var query = {user_id: req.current_user._id };
	if( req.param("q") ) {
		query.name = new RegExp( req.param("q") , "i");
	}
	
	req.wiring_collection.find({ 
		$query: query, 
		$orderby: {updated_at: -1} }, {}, 0, 20, function(error, cursor) {
			 if(error) { throw error; }
          cursor.toArray(function(error, wirings) {
				if(error) { throw error; }
            res.render('website/wirings', {
		        	locals: {
						title: "Wirings",
						action: "wirings",
						wirings: wirings,
						search: req.param("q")
		        	}
		    	});
          });
	});
		
});	


// list wirings for user in JSON
app.get('/wirings.json', app.require_login, get_wiring_collection, function(req, res){		
	req.wiring_collection.find( {user_id: req.current_user._id }, function(error, cursor) {
		if(error) { throw error; }
      cursor.toArray(function(error, wirings) {
			if(error) { throw error; }
			res.send( JSON.stringify(wirings) , { 'Content-Type': 'application/json' });
      });
	});
});


// Show wiring page: run form
app.get('/wirings/:id', app.require_login, get_wiring_collection, get_wiring, function(req, res){	
	res.render('wirings/show', {
   	locals: {
			title: "Wiring "+req.wiring.name,
			action: "wirings",
			wiring: req.wiring,
			params: {} // TODO: be able to pass default parameters to fill the form ?
		}
	});		
});

// Edit the template
app.get('/wirings/:id/edit-template',app.require_login,get_wiring_collection,get_wiring, function(req, res){
	res.render('wirings/edit-template', {
   	locals: {
			title: "Wiring "+req.wiring.name,
			action: "wirings",
			wiring: req.wiring
	   }
	});
});


// Edit the cron
app.get('/wirings/:id/edit-cron', app.require_login,get_wiring_collection,get_wiring, function(req, res){
	res.render('wirings/edit-cron', {
        locals: {
				title: "Wiring "+req.wiring.name,
				action: "wirings",
				wiring: req.wiring
        }
    });
});


// Modify a wiring (other parameters, from a html form)
// Use POST instead of PUT so we can use HTML forms
app.post('/wirings/:id', app.require_login, get_wiring_collection, get_wiring, function(req, res){
	
	if( req.param("template_content_type") ) {
		req.wiring.template_content_type = req.param("template_content_type");
	}
	if( req.param("template") ) {
		req.wiring.template = req.param("template");
	}
	if( req.param("publicname") ) {
		req.wiring.publicname = req.param("publicname");
	}
	
	var hasNewCron = false;
	// TODO: add cron params !
	if( req.param('cron') && req.param('cron') != req.wiring.cron ) {
		if(req.param('cron') !== "") {
			try {
				new cron.CronTime(req.param('cron'));
			}
			catch(ex) {
				req.flash('error', "invalid cron pattern");
				res.redirect('/wirings/'+req.wiring._id.toHexString()+'/edit-cron' );
				return;
			}
		}
		hasNewCron = true;
		req.wiring.cron = req.param('cron');
	}
	
	req.wiring.updated_at = new Date();
			
			console.log("REQ.WIRING._ID" , req.wiring._id);
			
	req.wiring_collection.update({_id: req.wiring._id}, req.wiring, function(error, docs){
		if(error) { throw error; }
		
		if(hasNewCron) {
			if(app.config.cron.enabled) {
				wiringCron(req.wiring);
			}
		}
		
		req.flash('notice', "saved !");
		res.redirect('/wirings/'+req.wiring._id.toHexString() );
		
	});
});


// Add a wiring 
app.post('/wirings', app.require_login, get_wiring_collection, function(req, res){
		
	var wiring = req.body.wiring;
	
	wiring.user_id = req.current_user._id;
	
	var d = new Date();
	wiring.created_at = d;
	wiring.updated_at = d;
	
	wiring.author = {
		name: req.current_user.name, 
		email: req.current_user.email
	};
	
	req.wiring_collection.insert(wiring, function(error, docs) {
		if(error) { throw error; }	
		res.send( JSON.stringify(docs[0]) , { 'Content-Type': 'application/json' }, 201);
	});
	 
});

// Modify a wiring (json)
app.put('/wirings/:id.json', app.require_login, get_wiring_collection,get_wiring, function(req, res){
	
	var wiring = req.body.wiring;
	
	for(var k in wiring) {
		req.wiring[k] = wiring[k];
	}
	req.wiring.updated_at = new Date();
	
	req.wiring_collection.update({_id: new ObjectID(req.wiring._id)}, req.wiring, function(error, docs){
		if(error) { throw error; }
		res.send( JSON.stringify(docs) , { 'Content-Type': 'application/json' });
	});
	
});


// Delete a wiring
app.del('/wirings/:id.json',app.require_login, get_wiring_collection,get_wiring, function(req, res){
	req.wiring_collection.remove({_id: new ObjectID(req.wiring._id)}, function(error){
		if(error) { throw error; }
		res.send(200);
	});
});




/*************************************
 * EXECUTION
 *************************************/



/**
 * Wrap the find_method 
 */
var mySimpleflowRun = function(conf, params, debug, wiring_collection, cb) {
	simpleflow.run(conf, params, debug, function(name, cb) {
		wiring_collection.findOne({
			//_id: ObjectID.createFromHexString(req.param('id')) 
			name: name
		}, function(error, wiring) {
			if(error) { throw error; }
			
			if(!wiring) {
				throw "Wiring '"+name+"' was not found !";
			}
			/*console.log("error");
			console.log(error);
			console.log("wiring");
			console.log(wiring);*/
			
			cb(wiring.config);
		});
	}, cb);
};

var mySimpleflowRunWithActivity = function(wiring, user_id, format, from, params, debug, wiring_collection, cb) {
	var started_at = new Date();
		
	mySimpleflowRun(wiring.config, params, debug, wiring_collection, function(results) {
		
		var finished_at = new Date();
		var activity = {
			user_id: user_id,
			wiring: {
				_id: wiring._id,
				name: wiring.name
			},
			from: from,
			params: params,
			results: results,
			created_at: started_at,
			duration: (finished_at-started_at),
			format: format
		};
		
		app.db.collection('activities', function(error, activity_collection) {
			if(error) { throw error; }
			
			activity_collection.insert(activity, function(error, docs) {
				if(error) { throw error; }
					
				cb(results);
			});
		});
	});
};


// Editor debug
app.post('/editor/debug', app.require_login, get_wiring_collection, function(req, res){
	mySimpleflowRun(
		eval(req.body).working, // TODO: JSON does not work instead of eval ???
		{},  // Parameters
		true, // Debug
		req.wiring_collection,
		function(results) {
			res.send(JSON.stringify(results), { 'Content-Type': 'application/json' });
		}
	);
});


// Run the wiring !
function run_wiring(wiring, req, res, format) {
	
	 var filteredParams = req.query;
	// TODO
    /*filteredParams = params.dup
    filteredParams.delete("id")
    filteredParams.delete("action")
    filteredParams.delete("controller")
    filteredParams.delete("callback")
    filteredParams.delete("format")*/
	
	
	mySimpleflowRunWithActivity(wiring, req.current_user._id, format, "web", 
			filteredParams, false, req.wiring_collection, function(results) {
		
				if(format == "html") {
					// Reder the template
					if( !!wiring.template && !req.param("notemplate") ) {
						res.header('Content-Type', wiring.template_content_type);
						var output;
						try {
							output = ejs.render(wiring.template, {
								locals: {
									results: results,
									params: filteredParams
								}
							});
						} catch(ex) {
							output = "Error in your template: "+ex.message;
						}
						res.send(output);

					} 
					// Render the result of the "outputField" variable as a html document
					else if( req.param('outputField') ) {
						res.header('Content-Type', "text/html");
						if(results.hasOwnProperty(req.param('outputField'))) {
							res.send( results[req.param('outputField')] );
						}
						else {
							res.send( "No field called "+req.param('outputField') );
						}
			       }
				    else {
						// render run.ejs
						res.render('wirings/run', {
					        locals: {
									title: "Wiring "+wiring.name,
									action: "wirings",
									wiring: wiring,
									params: filteredParams,
									results: results
					        }
					    });
					}
				}
				/*else if(format == "xml") {
				}*/
				else if(format == "json") {
					
					if(req.param("callback")) {
						res.header('Content-Type', 'text/javascript');
						
						res.send("if(typeof "+req.param("callback")+" == 'function') {"+
									req.param("callback")+"("+JSON.stringify(results)+");} else {\n"+
									"if (typeof console!== 'undefined' && typeof console.log !== 'undefined'){\n"+
									"console.log('Error: Callback method not defined');}	}");
					}
					else {
						res.header('Content-Type', 'application/json');
						res.send(JSON.stringify(results));
					}
				}
				/*else if(format == "txt") {
					if results.keys.size == 1
						if results.values[0].is_a?(String)
							render :text => results.values[0]
							return
						end
					else
						# TODO: check if param outputField
					end

					render :text => "blabla"
				}*/		
				
	});
		
}
app.get('/wirings/:id/run', app.require_login, get_wiring_collection, get_wiring, function(req, res){
	run_wiring(req.wiring, req,res,"html");
});
app.get('/wirings/:id/run.:format', app.require_login, get_wiring_collection, get_wiring, function(req, res){
	run_wiring(req.wiring, req,res, req.param("format") );
});
app.post('/wirings/:id/run', app.require_login, get_wiring_collection, get_wiring, function(req, res){
	run_wiring(req.wiring, req,res,"html");
});



app.get('/wirings/public/:publicname', get_wiring_collection, function(req, res) {

	req.wiring_collection.findOne({
		publicname: req.param('publicname')
	}, function(error, wiring) {
		if(error) { throw error; }
		if(wiring) {
			run_wiring(wiring, req, res,"html");
		}
		else 
			res.render('404', { status: 404, locals: {	title: 'NotFound', action: 'error' }});
	});
	
});




/*************************************
 * CRON + load cron jobs at startup
 *************************************/
var jobs = {};

function wiringCron(wiring) {

	var id = wiring._id.toHexString();

	if(jobs[id]) {
		console.log("Previous timer ?")
		console.log(jobs[id].timer);
		clearInterval(jobs[id].timer);
		jobs[id] = null;
	}

	if(!wiring.cron || wiring.cron == "") { return; }
	
	var newJob = new cron.CronJob(wiring.cron, function() {
		
		app.db.collection('wirings', function(error, wiring_collection) {
			if(error) { throw error; }
			mySimpleflowRunWithActivity(wiring, wiring.user_id, "json", "cron", 
					{}, false, wiring_collection, function(results) {
			});
		});
		
	});

	jobs[id] = newJob;
};


if(app.config.cron.enabled) {
	// Load cron from wirings
	app.db.collection('wirings', function(err, collection) {	
		collection.find({ cron: {$nin: [null, "", undefined, "undefined"]} }, function (err, docs) {
  			docs.toArray(function(err, wirings) {
				console.log("Loading "+wirings.length+" wirings with cron :");
				for(var i = 0 ; i < wirings.length ; i++) {
					var wiring = wirings[i];
					console.log(wiring.name+" : "+JSON.stringify(wiring.cron));
					wiringCron(wiring);
				}
			});
  		});
	});
}


};