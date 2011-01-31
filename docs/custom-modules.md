# Creating custom modules

## Introduction

WebHookIt is made to be extended to your own needs. There are two kinds of modules in WebHookIt :

 * Core Modules : simple asynchronous functions written in Node.js + module interface definitions
 * wirings module : created via the visual editor, they uses core modules and can be composed

This page only concerns Core Modules.

## NPM

WebHookIt core modules are distributed through the npm(http://npmjs.org/) package manager, which means you can contribute WebHookIt modules by publishing a package to the [npm registry](http://search.npmjs.org/) called "webhookit-<i>mymodule</i>".

Basic modules are available on this repository: [https://github.com/neyric/webhookit-packages](https://github.com/neyric/webhookit-packages)

The WebHookIt modules can be installed/updated/uninstalled from the /packages page. This page automatically lists all packages called "webhookit-mymodule" from the npm registry.


## Development 

When creating a custom module, it is simpler to create a file in *lib/modules/* called *mymodule.js*, since you won't need to publish the package at each change.

This can be used in "production" too but the advantage of using a NPM package is that you can define dependencies for your module. (for example, the webhookit-yql package depends on the yql package)


## Custom module file

Custom modules must export two objects :

 * definition: an object containing the UI definition of the module
 * run: a method which actually execute your module

Let's look at the YQL module. First, the definition of the module as it will appear in the editor :

    exports.definition = {
       "name": "yql",
    	 "category": "Sources",
       "container": {
    		  "icon": "/images/module_icons/yql.png",
          "xtype": "WireIt.TextareaContainer",
    		  "title": "yql",
    		  "fields": [
    			   {"type": "text", "name": "query", "wirable": true }
    		  ],
    		  "terminals": [
    		      {
    		        "name": "out", 
    		        "direction": [0,1], 
    		        "offsetPosition": {"left": 86, "bottom": -15}, 
    		        "ddConfig": { "type": "output", "allowedTypes": ["input"] }
             }
    	   ]
       }
    };


Then, the run method which will actually execute what you want. This method takes two parameters, the parameters hash, and the callback to call when you're done :

    var YQL = require('yql');

    exports.run = function(params, cb) {

    	new YQL.exec(params.query, function(response) {

    		cb({"out": response});

    	}, {}, {"https": true});

    };


## Creating a package

Create a directory structure like this one :

 * mymodule/
   * package.json
   * lib/
     * webhookit-mymodule/
       * index.js

The index.js file must contain

Then, configure the package.json file :

    {
        "name": "webhookit-yql",
        "version": "0.0.1",
        "description": "YQL module for WebHookIt",
        "author": "Eric Abouaf <eric.abouaf@gmail.com>",
        "bugs": { "web" : "http://github.com/neyric/webhookit-packages/issues" },
        "os": ["darwin", "linux"],
        "contributors": [
            "Eric Abouaf <eric.abouaf@gmail.com> (http://neyric.com)"
        ],
        "engines": {
            "node" : ">=0.2.5"
        },
        "directories": {
            "lib" : "./lib"
        },
        "main": "./lib/webhookit-yql",
        "dependencies": {
            "yql": ">=0.2.0"
        },
        "licenses":[  {"type" : "MIT"} ],
        "repository": {
            "type":"git",
            "url":"http://github.com/neyric/webhookit-packages.git"
        }
    }


Finally, publish your package on the npm registry :

    cd mymodule/
    npm publish .

Then go to the /packages page on your WebHookIt installation, and click the Install Package button !




<script type="text/javascript">var disqus_shortname = 'custom-modules';</script>
