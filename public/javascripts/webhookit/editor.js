
YUI.add('webhookit-editor', function(Y) {

   var alertMsg = function(className, content) {
      
      // TODO: add only one message
		var s = Y.Node.create('<div class="alert-message '+className+'" style="width: 300px; z-index: 10001;"><p>'+content+'</p></div>').appendTo(document.body);
		var anim = new Y.Anim({
		    node: s,
		    duration: 0.5,
		    easing: Y.Easing.easeOut,
			from: { xy: [400, -50] },
			to: { xy: [400, 2] }
		});
		anim.on('end', function() {
			Y.later(2000, this, function() {
				(new Y.Anim({
				    node: s,
				    duration: 0.5,
				    easing: Y.Easing.easeOut,
					to: { xy: [400, -50] }
				})).run();
			});
		});
		anim.run();
		
      
   };

// -- WiringModel ---------------------------------------------------------------------
Y.WiringModel = Y.Base.create('wiringModel', Y.Model, [], {
}, {
	ATTRS: {
		_id: {value: null},
		name       : {value: ''},
		containers   : {value: []},
		description: {value: ''},
		wires   : {value: []}
	}
});

// -- WiringModelList ---------------------------------------------------------------------

Y.WiringModelList = Y.Base.create('wiringModelList', Y.ModelList, [], {
    model    : Y.WiringModel
});

// -- ContainerType ---------------------------------------------------------------------
Y.ContainerType = Y.Base.create('containerModel', Y.Model, [], {
	// The `id` attribute for this Model will be an alias for `name`.
	idAttribute: 'name'
}, {
	ATTRS: {
		name       : {value: null},
		description: {value: null},
		config   : {value: null}
	}
});

// -- ContainerTypeList -----------------------------------------------------------------
Y.ContainerTypeList = Y.Base.create('containerTypeList', Y.ModelList, [], {
	model: Y.ContainerType
});

// -- Editor View ------------------------------------------------------------
Y.EditorView = Y.Base.create('editorView', Y.View, [], {
	
	template: Y.Handlebars.compile(Y.one('#t-editor').getContent()),
	
	events: {
		'#wiring-save-btn': {click: 'saveWiring'}
	},
	
	render: function () {
		
		var content = this.template({
			containerTypes: this.get('containerTypes').toJSON()
		});
		this.get('container').setContent(content);
		
		
		// Make items draggable to the layer
		var that = this;
		this.get('container').all('.containerType-name').each(function(node) {
			
			var drag = new Y.DD.Drag({ 
				node: node,
				groups: ['containerType']
			}).plug(Y.Plugin.DDProxy, {
				cloneNode: true,
				moveOnEnd: false
			});
			drag._containerTypeName = node._node.innerHTML;
			
			// On drom, add it to the layer
			drag.on('drag:drophit',  function(ev) {
				that._addContainerFromName(ev.drag._containerTypeName, {
					x: ev.drag.lastXY[0],
					y: ev.drag.lastXY[1]
				});
			});
			
			
		});
		
		this._renderLayer();
		
		return this;
	},
	
	_renderLayer: function() {
		
		this.layer = new Y.Layer({
			//width: 900,
			height: 500
		});
		
		// Create the Drop object
		var drop = new Y.DD.Drop({
			node: this.layer.get('contentBox'),
			groups: ['containerType']
		});
		//drop.layer = this.layer;
		
		var wiring = this.get('model');
		if(wiring) {
			this.setWiring( wiring );
		}
		
		this.layer.render( this.get('container').one('#layer-container') );
		
	},
	
	saveWiring: function(e) {
		var o = {
			name: Y.one('#wiring-name').get('value') || 'Unnamed'
		};
		
		// Children are containers
		o.containers = [];
		Y.Array.each(this.layer._items, function(item) {
			o.containers.push({
				containerType: item.containerTypeName,
				config: item.toJSON()
			});
		});
		
		// Wires:
		o.wires = [];
		var layer = this.layer;
		Y.Array.each(this.layer._wires, function(wire) {
			
			var src = wire.get('src');
			var tgt = wire.get('tgt');
			
			o.wires.push( {
				src: { container: layer._items.indexOf( src.get('parent') ), terminal: src.get('name') },
				tgt: { container: layer._items.indexOf( tgt.get('parent') ), terminal: tgt.get('name') },
				config: wire.toJSON()
			});
		});
		
		
		var url = '/wirings/', method = 'POST';
		
		if( this.get('model') ) {
			url = '/wirings/'+this.get('model').get("_id")+'.json';
			method = 'PUT';
		}
		
		Y.io(url,{
          method: method,
          data: Y.JSON.stringify({wiring: o}),
          headers: { 'Content-Type': 'application/json', },
          on: {
              success: function() {
                 alertMsg("warning", "Saved !");
              },
              failure: function() {
                 alertMsg("error", "An error occured");
              }
          },
          context: this
      });
      
	},
	
	setWiring: function(wiring) {
		
		var that = this;
		
		var layer = this.layer;
		
		Y.Array.each( wiring.get('containers'), function(container) {
			
			that._addContainerFromName(container.containerType,  container.config);
			
			Y.on('available', function(el) {
				Y.one('#wiring-name').set('value', wiring.get('name') );
			}, '#wiring-name');
			
		});
		
		Y.Array.each( wiring.get('wires'), function(wire) {
			
			// prevent bad configs...
			if(!wire.src || !wire.tgt) return;
			
			var srcContainer = layer.item(wire.src.container);
			var srcTerminal = srcContainer.getTerminal(wire.src.terminal);
			
			var tgtContainer = layer.item(wire.tgt.container);
			var tgtTerminal = tgtContainer.getTerminal(wire.tgt.terminal);
			
			// TODO: wire.config;
			
			var w = new Y.BezierWire({
				src: srcTerminal,
				tgt: tgtTerminal
			}).render( layer.get('contentBox') );
			
		});
		
		// TODO: this is awful ! But we need to wait for everything to render & position
		Y.later(1000, this, function() {
			layer.redrawAllWires();
		});
		
	},
	
	_addContainerFromName: function(containerTypeName, containerConfig) {
		var containerType = this.get('containerTypes').getById(containerTypeName);
		var containerConf = Y.mix({}, containerType.get('config'));
		containerConf = Y.mix(containerConf, containerConfig);
		this.layer.add(containerConf);
		var container =  this.layer.item(this.layer.size()-1);
		container.containerTypeName = containerTypeName;
	}
	
}, {
	ATTRS: {
		containerTypes: {
			value: null
		}
	}
});

// -- WireIt App ---------------------------------------------------------
Y.WireItApp = new Y.Base.create('contributorsApp', Y.App, [], {
	
	views: {
		editorPage: {
			type: Y.EditorView
		}
	},
	
	initializer: function () {
		
		// show indication that the app is busy loading data.
		this.on('navigate', this.indicateLoading);
		
		this.once('ready', function (e) {
			if (this.hasRoute(this.getPath())) {
				this.dispatch();
			} else {
				this.showEditorPage();
			}
		});
	},
	
	// -- Event Handlers -------------------------------------------------------
	
	indicateLoading: function (e) {
		this.get('activeView').get('container').addClass('loading');
	},
	
	// -- Route Handlers -------------------------------------------------------
	showEditorPage: function() {
		this.showView('editorPage', {
			containerTypes: this.get('containerTypes'),
			wirings: this.get('modelList'),
			model: this.get('wiring')
		});
	}

}, {
	ATTRS: {
		
		containerTypes: {
			value: new Y.ContainerTypeList()
		},
		
		modelList: {
			value: new Y.WiringModelList()
		},
		
		wiring: {
			value: null
		},
		
		routes: {
			value: [
				{path: '/', callback: 'showEditorPage'}
			]
		}
	}
});


}, '3.5.0pr1', {requires: ['app', 'handlebars', 'model', 'model-list', 'json', 'view', 'layer', 'bezier-wire', 'anim', 'image-container', 'form-container', 'io-base', 'textarea-container', 'inputex-string', 'inputex-list', 'inputex-combine', 'inputex-select','inputex-checkbox','inputex-type', 'inputex-url']});
