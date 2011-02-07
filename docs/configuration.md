# Configuration

WebHookIt configuration happens in the config/ subfolder. This folder contains one file per environment. At startup, WebHookIt will load the file *config/(:EXPRESS_ENV).js* file according to the EXPRESS_ENV environment variable.

The default environment is **development**. To launch the server with the **production** environment :

    $ EXPRESS_ENV=production node server.js


**Important**: Any change in the config file will require to *restart the server* !

The configuration file includes :

 * mongoDB access parameters
 * server port & IP
 * sessions key & secret
 * Feature control (enabling/disabling features)
    * cron
    * users


Here is the default development.js content :

    module.exports = {
	
    	// mongoDB access
    	database: {
    		host: 'localhost',
    		port: 27017,
    		db: 'testmongo',
    		options: {
	    		auto_reconnect: true
    		}
    	},

    	// Bind port/IP
    	server: {
    		port: 8124
    	},
    	
    
    	sessions: {
    		key: 'some-key',
    		secret: 'some-We1rD sEEEEEcret!'
    	},
	
    	// Features
    	cron: {
    		enabled: true
    	},

    	users: {
    		creation: {
    			// Is the creation of new users public ?
    			"public": true
    		}
    	}
    	
    };
    
    