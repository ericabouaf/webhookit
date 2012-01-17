var fs = require('fs');

exports.expressRoutes = function(app) {

/**
 * YUI combo-loader
 * TODO: cache generated files
 * TODO: add inputex modules
 * TODO: correct assets path /url\([\"\']?(.*)[\"\']?\)/
 */
app.get('/yui-combo', function(req, res){

	var querystring = req.url.split('?')[1];
	var modules = querystring.split('&');
	
	
	// Response Headers
	if(modules[0].indexOf(".css") != -1) {
		res.header("Content-Type", "text/css");
	}
	else if(modules[0].indexOf(".js") != -1) {
		res.header("Content-Type", "application/javascript");
	}
	res.header('Expires', new Date((new Date()).getTime() + (60 * 60 * 1000 * 24 * 365 * 10)) );
	res.header('Age', '300');
	res.header('Cache-Control', 'max-age=315360000');
	res.header('Date', new Date() );
	
	
	// Combine the files :
	var ret = "";
	var fileCount = 0;
	var wireit_modules = ["wire-base", "canvas-node", "canvas-wire", "bezier-wire", "wire", "wires-delegate", "terminal-base", "terminal-dragedit", "terminal-scissors", "terminal-ddgroups", "terminal", "container-base", "container", "image-container", "form-container", "inout-container", "layer", "container-type", "wiring-model", "wireit-app", "silk-sprites", "widget-icons"];
	modules.forEach(function(f) {
		
		var file = "./public/"+f;
		
		// Corret the path for external YUI modules
		var module = f.split('/')[2];
		console.log("MODULE", module);
		if(wireit_modules.indexOf(module) != -1) {
			if(f.indexOf(".css") != -1) {
				file = "./public/wireit/src/"+module+"/assets/skins/sam/"+module+".css";
			}
			else if(f.indexOf(".js") != -1) {
				file = "./public/wireit/src/"+module+"/"+module+".js";
			}
		}
		
		// Merge the files
		fs.readFile(file, encoding="utf8", function(err, data) {
			fileCount++;
			ret += data;
			if(err) {
				console.log(err);
				res.send(err);
			}
			else if(fileCount == modules.length) {
				res.send(ret);
			}
		});

	});    
});

};