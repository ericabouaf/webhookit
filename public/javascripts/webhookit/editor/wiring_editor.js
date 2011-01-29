/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 * @class webhookit.WiringEditor
 * @extends WireIt.ComposableWiringEditor
 */
webhookit.WiringEditor = function(options) {
   webhookit.WiringEditor.superclass.constructor.call(this, options);
};

	
YAHOO.lang.extend(webhookit.WiringEditor, WireIt.ComposableWiringEditor, {

	composedCategory: "My Wirings",

	/**
	  * save the current module
	  * @method saveModule
	  */
	 save: function() {
		
	    var value = this.getValue();
	    if(value.name === "") {
	       this.alert("Please choose a name");
	       return;
	    }

		this.tempSavedWiring = {name: value.name, working: value.working, language: this.options.languageName };

	    this.adapter.saveWiring(this.tempSavedWiring, {
	       success: this.saveModuleSuccess,
	       failure: this.saveModuleFailure,
	       scope: this
	    });
	
	 },
	
	/**
	  * @method getPipeByName
	  * @param {String} name Pipe's name
	  * @return {Object} return the evaled json pipe configuration
	  */
	 getPipeByName: function(name) {
	    var n = this.pipes.length,ret;
	    for(var i = 0 ; i < n ; i++) {
	       if(this.pipes[i].name == name) {
				return this.pipes[i].working;
	       }
	    }
	    return null;
	 },

   /**
    * Add Some buttons
    */
   renderButtons: function() {
      webhookit.WiringEditor.superclass.renderButtons.call(this);

      var toolbar = YAHOO.util.Dom.get('toolbar');

		
      var editTemplateButton = new YAHOO.widget.Button({ label:"Edit template", id:"WiringEditor-templateButton", container: toolbar });
      editTemplateButton.on("click", webhookit.editTemplateButton, webhookit, true);

		// "Run" button
      var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
      runButton.on("click", webhookit.run, webhookit, true);

   } 
   
});