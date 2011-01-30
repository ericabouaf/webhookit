/**
 * Webhookit
 */
var webhookit = {
   
   language: {
	   languageName: "webhookit",
			
		propertiesFields: [
			//{"type": "hidden", inputParams: {"name": "_id"} },
			{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter a title" } },
			{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30} }
		],
		
		layoutOptions: {
		 	units: ([{ position: 'bottom', height: 170, body: 'bottom', resize: true, header: '<button id="refreshDebug">Debug</button>', scroll: true, collapse: true, gutter: '5px'}]).concat(WireIt.BaseEditor.defaultOptions.layoutOptions.units)
		}
		
	},
	
   init: function() {
	try {
   	this.editor = new webhookit.WiringEditor(this.language);

		YAHOO.util.Dom.setStyle('app', 'display','');
		YAHOO.util.Dom.setStyle('appLoading', 'display','none');
		

		YAHOO.util.Event.addListener('refreshDebug', 'click', function() {
			this.refreshDebug(this.lastSelectedContainerIndex);
		}, this, true);
		
	}catch(ex){console.log(ex);}
   },


	editTemplateButton: function() {
		var value = this.editor.getValue();
		// TODO: save it first
		
		// Get the id
		var prev = this.editor.pipesByName[value.name];
		
		if(!prev || !prev.id) {
			this.editor.alert("Open a wiring first.");
			return;
		}
		
		window.location = "/wirings/"+prev.id+"/edit-template";
	},
   
   run: function() {
		var value = this.editor.getValue();
		// TODO: save it first
		
		// Get the id
		var prev = this.editor.pipesByName[value.name];
		
		if(!prev || !prev.id) {
			this.editor.alert("Open a wiring first.");
			return;
		}
		
		window.location = "/wirings/"+prev.id;
   },


	refreshDebug: function(index) {
		
		var value = this.editor.getValue();
			
		YAHOO.util.Dom.get('bottom').innerHTML = "<img src='/images/spinner.gif' />";
		
		YAHOO.util.Connect.asyncRequest('POST', '/editor/debug', {
			success: function(o) {
				var s = o.responseText,
					 r = YAHOO.lang.JSON.parse(s);
				this.lastDebugRun = r;
				YAHOO.util.Dom.get('bottom').innerHTML = "";
				new inputEx.widget.JsonTreeInspector('bottom', r[index]);
			},
			failure: function(o) {
				try {
				var s = o.responseText,
					 r = YAHOO.lang.JSON.parse(s);
				} catch(ex) {
					YAHOO.util.Dom.get('bottom').innerHTML = "Server error";
					return;
				}
				
				YAHOO.util.Dom.get('bottom').innerHTML = r.error;
			},
			scope: this
		}, YAHOO.lang.JSON.stringify(value) );
			
	},

	updateDebugPanel: function(index) {
		
		if(!this.lastDebugRun) {
			YAHOO.util.Dom.get('bottom').innerHTML = "Run it first...";
			return;
		}
		else {
			YAHOO.util.Dom.get('bottom').innerHTML = "";
			new inputEx.widget.JsonTreeInspector('bottom', this.lastDebugRun[index]);
		}
		
	}
   
};

YAHOO.util.Event.onDOMReady( webhookit.init, webhookit, true);

/**
 * For the debugger so he knows the last selected container to display debug infos
 */
WireIt.Container.prototype.setFocus = function() {
	if( !YAHOO.util.Dom.hasClass(this.el, "WireIt-Container-focused") ) {
		webhookit.lastSelectedContainerIndex = WireIt.indexOf( this, webhookit.editor.layer.containers);
		webhookit.updateDebugPanel(webhookit.lastSelectedContainerIndex);
	}
   YAHOO.util.Dom.addClass(this.el, "WireIt-Container-focused");
};


