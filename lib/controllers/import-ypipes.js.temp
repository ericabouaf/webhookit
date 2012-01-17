/**
 * Import Yahoo Pipes into wirings
 * ALPHA CODE => this is just the skeleton for the importation. None of the Yahoo! pipes modules are implemented yet
 */
exports.expressRoutes = function(app) {

app.get('/import-ypipes', app.require_login, function(req, res){
   res.render('website/import-ypipes', {
      locals: { title: 'Tools - Import Yahoo! Pipes', action: 'import-ypipes' }
   });
});

app.post('/import-ypipes', app.require_login, function(req, res){

  ypipes.getById( req.param("pipeId"), function(err, pipe) {

  	var wiring = ypipes.convertPipeToWiring(pipe);
	
	wiring.user_id = req.current_user._id;
	
	var d = new Date();
	wiring.created_at = d;
	wiring.updated_at = d;
	
	wiring.author = {
		name: req.current_user.name, 
		email: req.current_user.email
	};
	
	app.db.collection('wirings', function(error, wiring_collection) {
		wiring_collection.insert(wiring, function(error, docs) {
			if(error) { throw error; }	
		
			res.render('website/import-ypipes', {
	      	locals: { title: 'Tools - Import Yahoo! Pipes', action: 'index' }
	   	});
		});
	});
	

  });

});





var http = require('http'),
    URL = require('url');

var jsonGet = function(theurl, cb) {
	var url = URL.parse(theurl);
	var client = http.createClient(url.port || 80, url.hostname);	
	var request = client.request('GET', url.pathname + url.search,{'host': url.hostname});

	request.on('response', function (response) {
		
	    response.setEncoding('utf8');

	    var body = "";
	    response.on('data', function (chunk) { body = body + chunk; });

	    response.on('end', function() {
			  var results = JSON.parse(body);
				cb(null, results);
	    });
	});
	request.end();
	
};


var ypipes = {
	
	getById: function(id, cb) {
		jsonGet("http://pipes.yahoo.com/pipes/pipe.info?_out=json&_id="+id, function(err, results) {
			var pipe = results.PIPE;
			var working = JSON.parse(pipe.working);
			cb(err, {
				name: pipe.name,
				description: pipe.description,
				working: working
			});
		});
	},
	
	// WARNING: only gets PUBLISHED pipes !!
	getAllFromUserId: function(guid, cb) {
		var page = 0;
		var wirings = [];
		var nextPage = function() {
			page++;
			var url = "http://pipes.yahoo.com/pipes/person.info?display=pipes&guid="+guid+"&_out=json&page="+page;			
			jsonGet(url, function(err, results) {
				if(results.value.hits == 0) {
					cb(err, wirings);
				}
				else {
					//wirings = wirings.concat(results.value.items);
					var pipes = results.value.items;
					for(var i = 0 ; i < pipes.length ; i++) {
						var pipe = pipes[i];
						wirings.push({
							"id": pipe.id,
					    	"title": pipe.title,
					    	"description": pipe.description
						});
					}
					nextPage();
				}
			});
		};
		nextPage();
	},
	
	convertPipeToWiring: function(pipe) {
		
		var wiring = {
			name: pipe.name,
			config: {
				modules: [],
				wires: [],
				properties: {
					name: pipe.name,
					description: pipe.description
				}
			}
		};
		
		// Convert Modules
		var moduleConvertHash = {};	// yahoomoduleid -> index
		var moduleTypeHash = {};		// yahoomoduleid -> yahoo type
		var modules = pipe.working.modules;
		for(var i = 0 ; i < modules.length ; i++) {
			var module = modules[i];
			
			var id = wiring.config.modules.length;
			moduleConvertHash[module.id] = id;
			moduleTypeHash[module.id] = module.type;
			
			var type = module.type;
			var converter = convert[type];
			
			if(!converter) {
				throw new Error("No converter for type "+type);
			}
			
			// convert confs :
			var config = {};
			for(var k in converter.conf) {
				config[converter.conf[k]] = module.conf[k].value;
			}
			
			var m = {
				name: converter.target,
				value: config
			};
			
			if(m.name == "output") {
				m.value["name"] = "out";
			}
			
			wiring.config.modules.push(m);
		}
				
		// Positionning
		var layout = pipe.working.layout;
		for(var i = 0 ; i < layout.length ; i++) {
			var l = layout[i];
			var mId = moduleConvertHash[l.id];
			wiring.config.modules[mId].config = { position: l.xy };
		}
				
		
		// for the wires: 
		// 		- convert each moduleid (easy thanks to the hash table)
		// 		- convert the "id" field with the terminalName (each module conversion needs a hash to convert ids to terminal names)
		var wires = pipe.working.wires;
		for(var i = 0 ; i < wires.length ; i++) {
			var wire = wires[i];
			
			
			var w = {
         	//"xtype": "WireIt.BezierWire",
         	"src": { "moduleId": moduleConvertHash[wire.src.moduleid] },
         	"tgt": { "moduleId": moduleConvertHash[wire.tgt.moduleid] }
     		};

			// Convert terminals:
			var srcType = moduleTypeHash[wire.src.moduleid];
			var converterSrc = convert[srcType];
			var srcTerminals = converterSrc.terminals;
			var srcName = srcTerminals[wire.src.id];
			w.src.terminal = srcName;
			
			var tgtType = moduleTypeHash[wire.tgt.moduleid];
			var converterTgt = convert[tgtType];
			var tgtTerminals = converterTgt.terminals;
			var tgtName = tgtTerminals[wire.tgt.id];
			w.tgt.terminal = tgtName;
			

			wiring.config.wires.push(w);
		}
		
		return wiring;
		
	}
	
};


var convert = {

	
	fetch: {
		
		target: "fetch",
		
		conf: {
			"URL": "url"
		},
		
		terminals: {
			"_OUTPUT": "out"
		}
		
	},
	
	
	output: {
		
		target: "output",
		
		conf: {},
		terminals: {
			"_INPUT": "in"
		}
	}
	
	
};





};



/*
ypipes.getById("59738c010bb144a36d54a1697aab7d0d", function(err, pipe) {
	
	console.log( JSON.stringify(pipe) );
	
	var wiring = ypipes.convertPipeToWiring(pipe);
	
	console.log("\n\n\n");
	
	console.log( JSON.stringify(wiring) );
	
});
*/

/*ypipes.getAllFromUserId("DTL4OHS6FDFIN46MDKUJNEDFUU", function(err, pipes) {
	
	console.log(JSON.stringify(pipes));
	
	
	var pipeIndex = 0;
	
	var nextPipe = function() {
		
		if(pipeIndex == pipes.length) {
			console.log("done");
			return;
		}
		
		var p = pipes[pipeIndex];
		
		ypipes.getById(p.id, function(err, pipe) {
			console.log( JSON.stringify(pipe) );
			pipeIndex++;
			nextPipe();
		});
		
	};
	nextPipe();
	
});*/
