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
		port: 8124,
		host: "localhost"
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