var npm = require('npm');

exports.expressRoutes = function(app) {

	// Package list
	app.get('/packages', app.require_login, function(req, res){		
		
		npm.load({}, function (err) {

		   if (err) throw err;

			npm.commands.ls(['webhookit'], true, function (err, packages) {
				if (err) throw err;

				var installed = {};
				var available = {};
            
				packages = packages.dependencies;
				
				for(var k in packages) {
					pkg = packages[k];
					var name = pkg.name;
					var s = name.split('@');
					var version = s[1];
					var lib = (s[0].split('-'))[1];

					//if( pkg.words.indexOf('installed') != -1) {
						installed[lib] = pkg;
						if(available[lib]) {
							delete available[lib];
						}
					/*}
					else if(!installed[lib]) {
						available[lib] = pkg;
					}*/

				}

				res.render('packages/list', { 
					locals: {
						title: 'Packages',
						action: 'packages',
						packages: {
							installed: installed,
							available: available
						}
					}
				});
			});
		});
	});
	
	
	app.get('/packages/install/:lib', app.require_login, function(req, res){
		
		var name = "webhookit-"+req.param('lib');
		
		npm.load({}, function (er) {
		  if (er) throw er;
		
			var npmlog = [];
		
		  npm.commands.install([name], function (er, data) {
		    if (er) return commandFailed(er)

				res.render('packages/install', { 
					locals: {
						title: 'Package installed',
						action: 'packages',
						
							data: data,
							npmlog: npmlog
						
					}
				});
		  })
		  
			npm.on("log", function (message) { npmlog.push(message); });
		
		})
		
		
	});
	
	
	app.get('/packages/uninstall/:lib', app.require_login, function(req, res){
		
		var name = "webhookit-"+req.param('lib');
		
		npm.load({}, function (er) {
		  if (er) throw er;
		
			var npmlog = [];
		
		  npm.commands.rm([name], function (er, data) {
		    if (er) return commandFailed(er)

				res.render('packages/install', { 
					locals: {
						title: 'Package uninstalled',
						action: 'packages',
						
							data: data,
							npmlog: npmlog
						
					}
				});
		  })
		  
			npm.on("log", function (message) { npmlog.push(message); });
		
		})
		
		
	});
	
};
