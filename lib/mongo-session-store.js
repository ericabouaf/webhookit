var Session = require('connect').session,
	 Store = Session.Store,
	 ObjectID = require('mongodb/bson/bson').ObjectID;

/**
 * Initialize MongoSessionStore with the given options.
 * @param {Object} options
 * @api public
 */
var MongoSessionStore = module.exports = function MongoSessionStore(options) {
	this.db = options.db;
   Store.call(this, options);
};

MongoSessionStore.prototype.__proto__ = Store.prototype;

/**
 * Attempt to fetch session by the given `sid`.
 *
 * @param {String} sid
 * @param {Function} fn
 * @api public
 */
MongoSessionStore.prototype.get = function(sid, fn){
	var self = this;
   this.db.collection('sessions', function(error, collection) {
     if(error)	fn(error);
     else {
       collection.findOne({"sid":sid}, function(error, session) {
         if(error)  fn(error);
         else {
           if( session ) {
					fn( null, session );
	  		  } 
           else fn();
         }; 
       });     
     }
   });
};

/**
 * Commit the given `sess` object associated with the given `sid`.
 *
 * @param {String} sid
 * @param {Session} sess
 * @param {Function} fn
 * @api public
 */
MongoSessionStore.prototype.set = function(sid, sess, fn){
   	
	var self= this;
	
	this.db.collection('sessions', function(error, collection) {
      if(error) {
			fn(error);
		}
      else {
	
			var doc = {};
		   for(var prop in sess) {
		     if( prop != 'id' && prop != 'init' && prop != 'touch' && prop != 'constructor') {
		       doc[prop]= sess[prop];
		     }
		   }  
			doc.sid = sid;
	
         collection.save( doc, function(error, doc) {
            if( error ) {
					fn && fn(error);
				}
	         else { 
					fn && fn( null, sess )
	         }
	      });
	    }
	 });

};

/**
 * Destroy the session associated with the given `sid`.
 *
 * @param {String} sid
 * @api public
 */
MongoSessionStore.prototype.destroy = function(sid, fn){
	this.db.collection('sessions',function(error, collection) {
   	collection.remove({"sid":sid});
	});
};

// Clear all sessions.
MongoSessionStore.prototype.clear = function(fn){
	this.db.collection('sessions',function(error, collection) {
      collection.remove({});
   });
};

// Fetch number of sessions.
MongoSessionStore.prototype.length = function(callback){
	this.db.collection('sessions',function(error, collection) {
		if(error) callback(error);
		else {
			collection.count( function(error, count){ 
				if(error) callback(error)
				else callback(null, count)
			});
		}
	}); 
};
