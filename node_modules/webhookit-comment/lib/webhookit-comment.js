
exports.run = function(params, cb) {
	cb({});
};


exports.definition = {
   "name": "comment",
	"category": "System",
   "container": {
		"icon": "/images/icons/note_edit.png",
      "xtype": "WireIt.TextareaContainer",
		"title": "Comment",
		"fields": [
         {"type": "text", "label": "", "name": "comment", "wirable": false }
      ]
   },
   "value": {
      "input": {
         "type":"url"
      }
   }
};
