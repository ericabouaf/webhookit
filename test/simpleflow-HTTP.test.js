
var should = require('should');

module.exports = {
  testSimpleflow: function(beforeExit){

    //lib.version.should.match(/^\d+\.\d+\.\d+$/);
	var  n = 2;

		var simpleflow = require(__dirname+'/../lib/simpleflow');

		simpleflow.run(

			{
				modules: [

					{
						name: "input",
						value: {
							input: { value: 'show tables' , name: "query" }
						}
					},

					{
						name: "HTTP",
						value: {
							"method": "GET",
							url: "http://query.yahooapis.com/v1/public/yql",
							"urlparams": [ ["q", 'show tables'], ["diagnostics", true], ["format", "json"]]
						}
					}
				],
				wires: [
					{
						"src": { moduleId: 0, terminal: "out" },
						"tgt": { moduleId: 1, terminal: "query" }
					}
				]
			}, 

			{}, 

			true, 

			function() {
			},

			function(results) {
				//console.log("Results: "+ JSON.stringify(results) );
			}

		);

		beforeExit(function(){
		     //assert.equal(2, n, 'Ensure both timeouts are called');
		
			console.log("Before Exit");
		});

  }
};
