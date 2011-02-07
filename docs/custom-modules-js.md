# Executing custom modules

Custom modules uses Node.js. You can do anything you want !

## General form 

You custom module MUST export a _run_ function. This method takes two parameters :

 * _params_ : an associated array (hash) containing the parameters.
 * _cb_ : the callback method, to call when your module is done.
 

    exports.run = function(params, cb) {
       cb({"out": response});
    };

**The callback methods must be called with a results object parameters. Each key of the object must be related to a terminal with the same name.**


## Understanding the params



## Example using YQL

The YQL module is a typical scenario, where a Node.js library already exists for the webservice. The run method becomes a really dumb wrapper around the library call :

    var YQL = require('yql');

    exports.run = function(params, cb) {

    	new YQL.exec(params.query, function(response) {

    		cb({"out": response});

    	}, {}, {"https": true});

    };




