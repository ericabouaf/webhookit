var fs = require('fs');

/**
 * Core modules
 *
 * Module functions takes two arguments, the params object, and the callback.
 * They MUST return an object !
 *
 */
var CoreModules = {

	input: function(p, cb) {
	  var key = p["input"]["name"],
			val = p.hasOwnProperty(key) ? p[key] : p["input"]["value"];
	  cb({"out": val });
	},
	
	output: function(params, cb) {
		cb({"out": params["in"] });
	}
	
};

var definitions = [];

// Dynamically load modules from the lib/modules directory
fs.readdirSync(__dirname+'/modules').forEach(function(file) {
	// test if JS file
	if(file.substr(-3) == ".js") {
		var moduleName = file.substr(0, file.length-3);
		var module = require(__dirname+'/modules/'+file);
		definitions.push(module.definition);
		CoreModules[moduleName] = module.run;
	}
});

// Load NPM webhookit-* packages
var npm = require('npm');
npm.load({}, function (err) {
   if (err) throw err;

	console.log("NPM list of WebHookIt modules: ");
	npm.commands.ls([], true, function (err, packages) {
		if (err) throw err;
		var package_names = Object.keys(packages.dependencies);
		for(var k in package_names) {
			var pkg = package_names[k];
			var name = pkg.split("-");
			if(name.length < 2 || name[0] !== "webhookit") continue;
			
			console.log("Loading module: "+pkg);
			var m = require(pkg);
			if( typeof m.run == "function" && typeof m.definition == "object") {
				definitions.push(m.definition);
				CoreModules[name[1]] = m.run;
			}
			else {
				console.log("Unable to find WebHookIt module definition in 	package: "+pkg);
			}
		}

	});
});

exports.definitions = definitions;

var execModule = function(name, p, cb, find_method) {
   // Execute Ruby base modules
   if( CoreModules[name] ) {
  		CoreModules[name](p, cb);
	}
   else {
      // Try to execute composed module
		if(find_method) {
			find_method(name, function(w) {
				
				if(!w) {
					throw new Error("Module "+name+" not found !");
				}
				else {
					run(w, p, false, find_method, cb);
				}
				
			});
		}
		else {
			throw new Error("Module "+name+" not found ! (You may want to specify a find_method !)");
		}
	}
};


/**
 * Run method
 */
var run = function(config, params, debug, find_method, cb) {
	
    var wires = config.wires,
		  modules = config.modules;

	 // Store the output results of each sub-module
    var execValues = {};
	 var pendingModules = [];
	
	 var step = function() {
		
        // List modules that must be executed
		  var moduleIdsToExecute = []; 
		  for( var mId = 0 ; mId < modules.length ; mId++) {
          if( !execValues[mId] && pendingModules.indexOf(mId) == -1 ) { // don't re-execute modules
     			// If none incoming wires contains a value
            if( !wires.some(function(w) { return (w["tgt"]["moduleId"] == mId) && !execValues[ w["src"]["moduleId"] ]; }) ) {
            	moduleIdsToExecute.push(mId);
				}
          }
        }
	
		  if(moduleIdsToExecute.length === 0) {
		
		  		// we must wait until all modules are finished
				if( pendingModules.length !== 0 ) {
					return;
				}
		
				// Return internal execution values if debug mode
			 	if(debug) {
		    		cb(execValues);
					return;
			 	}

			 	var outputValues = {};

				for(var k = 0 ; k < modules.length ; k++) {
					var m = modules[k];
					if(m.name == "output") {
						wires.forEach(function(w) { 
							if(w["tgt"]["moduleId"] == k && execValues[w["src"]["moduleId"]]) {
					          outputValues[m["value"]["name"]] = execValues[w["src"]["moduleId"]][ w["src"]["terminal"] ];
				           }
						});
					}
				}

				cb(outputValues);
			
				return;
		  }
			
			console.log("moduleIdsToExecute : "+JSON.stringify(moduleIdsToExecute));
			console.log("pendingModules : "+JSON.stringify(pendingModules));
			
			// start all modules that can be executed 
			moduleIdsToExecute.forEach(function(moduleId) {
				
	         var m = modules[moduleId], p = {}, key;
	
	         // params passed to the run method
				for(key in params) { p[key] = params[key]; }
	         // default form values
				for(key in m["value"]) { p[key] = m["value"][key]; }

				// console.log("Wires: "+JSON.stringify(wires) );

	         // incoming wire params
				wires.filter(function(w) { return w["tgt"]["moduleId"] == moduleId; }).forEach( function(w) {
					
							console.log("Incoming wire: "+JSON.stringify(w) );

							var key =  w["tgt"]["terminal"];
							var val = execValues[ w["src"]["moduleId"] ][ w["src"]["terminal"] ];

							//console.log("Incoming wire: "+key+" , value: "+JSON.stringify(val) );

							// We simply want to do p[key] = val,
							// except that key might look like   "myvar[1][firstname]"
							// which mean we have to store this val in p["myvar"][1]["firstname"] instead
							var push_to = p;
							
							var matches = key.match(/\[([^\]]+)*\]/g);
							var pathItems = [];
							if(matches) {
								pathItems = key.match(/\[([^\]]+)*\]/g).map(function(i){ var s = i.substr(1,i.length-2); return (s.match(/\d+/)) ? parseInt(s,10) : s; });
							}
							if(pathItems.length > 0) {
								push_to = push_to[key.match(/^([^\[]*)/)[0]];
							}
							if(pathItems.length > 1) {
								for(var i = 0 ; i < pathItems.length-1 ; i++) {
									push_to = push_to[  pathItems[i]  ];
								}
							}
							if(pathItems.length > 0) {
								key = pathItems[pathItems.length-1];
							}
	               	push_to[key] = val;
					
						} );
				

				 pendingModules.push(moduleId);

				  var close = function(name, p, moduleId) {
						return function() {							
							console.log("\n->Starting "+name+" MODULE with : "+JSON.stringify(p) );
							execModule(name, p, function(results) {
									console.log( "\n<-Finished "+name+" MODULE with : "+ JSON.stringify(results) );
									
									pendingModules.splice( pendingModules.indexOf(moduleId) ,1);
									
									// Store the results of this module
									execValues[moduleId] = results;

									step();
							  }, find_method);
						};
					};

				  // Make sure we call the execModule function outside this stack
				  setTimeout(close(m["name"], p, moduleId), 0);

			});
		
	 };
	

	step();

};

exports.run = run;
