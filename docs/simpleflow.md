# Simpleflow

Simpleflow is engine which runs the wirings.

## Principle

The principle is straightforward :

 * Execute all modules which have all input wires evaluated

## Usage



    var simpleflow = require('./simpleflow');
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
  		console.log("Results: "+ JSON.stringify(results) );
  	}
    );

## Debug mode

If true, the third parameter enables debug mode. The returned results will be different, it will contain the executed values of each submodule.

## Limitations / TODO

 * conditional execution is not implemented yet

 * loops not implemented yet
  


<script type="text/javascript">var disqus_shortname = 'simpleflow';</script>
