YUI.add('yui3-global-yui2', function(Y) {
	window.YAHOO = Y.YUI2;	
}, '0.7.1', {
    requires: ['yui2-yahoo','yui2-dom','yui2-event']
});

YUI.add('inputex-yui3', function(Y) {
	Y.inputEx = window.inputEx;
	// fix the spacerUrl thx to the inputEx path
	Y.inputEx.spacerUrl = YUI_config.groups.inputex.base+"/images/space.gif";
}, '0.7.1', {
    requires: ['yui3-global-yui2']
});

YUI().use(function(Y) {

	/**
 	 * YUI 3 module metadata
	 */
	var CONFIG = {
		groups: {
			'inputex': {
				base: 'inputex/',
				combine: false,
				modules: {
					
					/**
					 * Setup
					 */
					'yui3-global-yui2': {
						path: 'js/yui3-loader.js',
						requires: ['yui2-yahoo','yui2-dom','yui2-event']
					},
					'inputex-yui3': {
						path: 'js/yui3-loader.js',
						requires: ['yui3-global-yui2']
					},
					
					/**
					 * Standard inputEx components
					 */
					'inputex-css': {
						type: 'css',
						path: 'css/inputEx.css',
						requires: ['yui2-reset', 'yui2-fonts']
					},
				   'inputex': {
				   	path: 'js/inputex.js',
				      requires: ['inputex-yui3', 'inputex-css']
				   },
				
					// inputEx base
					'inputex-field': {
						path: 'js/Field.js',
						requires: ['inputex']
					},
					'inputex-visus': {
					  	path: 'js/Visus.js',
						requires: ['inputex']
					},
					'inputex-jsonschema': {
						path: 'js/json-schema.js',
						requires: ['inputex']
					},
					// RPC
					'inputex-rpc': {
						path: 'js/rpc/inputex-rpc.js',
						requires: ['yui2-connection','inputex-jsonschema']
					},
					'inputex-smdtester': {
						path: 'js/rpc/smdTester.js',
						requires: ['inputex-rpc', 'inputex-jsontreeinspector']
					},
					'inputex-yql': {
						path: 'js/rpc/yql.js',
						requires: ['inputex']
					},
					// Mixins
					'inputex-choice': {
						path: 'js/mixins/choice.js',
						requires: ['inputex']
					},
					// Widgets
					'inputex-ddlist': {
						path: 'js/widgets/ddlist.js',
						requires: ['inputex', 'yui2-dragdrop']
					},
					'inputex-dialog': {
						path: 'js/widgets/Dialog.js',
						requires: ['inputex', 'inputex-group', 'yui2-dragdrop', 'yui2-container']
					},
					'inputex-datatable': {
						path: 'js/widgets/DataTable.js',
						requires: ['yui2-datatable', 'inputex', 'inputex-dialog']
					},
					'inputex-inplace-datatable': {
						path: 'js/widgets/dtInPlaceEdit.js',
						requires: ['inputex-datatable']
					},
					'inputex-jsontreeinspector': {
					  	path: 'js/widgets/json-tree-inspector.js',
					  	requires: ['inputex']
					},
					'inputex-button': {
					  	path: 'js/widgets/Button.js',
					   requires: ['inputex']
					},
					// MetaFields
					'inputex-group': {
						path: 'js/Group.js',
						requires: ['inputex-field']
					},
					'inputex-form': {
						path: 'js/Form.js',
						requires: ['inputex-group','inputex-button']
					},
					'inputex-list': {
						path: 'js/fields/ListField.js',
						requires: ['inputex-field']
					},
					'inputex-tree': {
						path: 'js/fields/TreeField.js',
						requires: ['inputex-listfield']
					},
					'inputex-combine': {
						path: 'js/fields/CombineField.js',
						requires: ['inputex-group']
					},
					'inputex-inplaceedit': {
						path: 'js/fields/InPlaceEdit.js',
						requires: ['inputex-field', 'inputex-button', 'yui2-animation'] // animation is optional, required if animColors option
					},
					'inputex-lens': {
						path: 'js/fields/Lens-beta.js',
						requires: ['inputex-group']
					},
					// Fields
					'inputex-string': {
						path: 'js/fields/StringField.js',
						requires: ['inputex-field']
					},
					'inputex-autocomplete': {
						path: 'js/fields/AutoComplete.js',
						requires: ['inputex-string', 'yui2-autocomplete']
					},
					'inputex-checkbox': {
						path: 'js/fields/CheckBox.js',
						requires: ['inputex-field']
					},
					'inputex-color': {
						path: 'js/fields/ColorField.js',
						requires: ['inputex-field']
					},
					'inputex-colorpicker': {
						path: 'js/fields/ColorPickerField.js',
						requires: ['inputex-field','yui2-colorpicker','yui2-container','yui2-menu']
					},
					'inputex-date': {
						path: 'js/fields/DateField.js',
						requires: ['inputex-string']
					},
					'inputex-datepicker': {
						path: 'js/fields/DatePickerField.js',
						requires: ['yui2-calendar', 'yui2-button', 'inputex-date', 'yui2-container']
					},
					'inputex-dateselectmonth': {
						path: 'js/fields/DateSelectMonthField.js',
						requires: ['inputex-combine']
					},
					'inputex-integer': {
						path: 'js/fields/IntegerField.js',
						requires: ['inputex-string']
					},
					'inputex-datesplit': {
						path: 'js/fields/DateSplitField.js',
						requires: ['inputex-combine', 'inputex-integer']
					},
					'inputex-select': {
						path: 'js/fields/SelectField.js',
						requires: ['inputex-field','inputex-choice']
					},
					'inputex-time': {
						path: 'js/fields/TimeField.js',
						requires: ['inputex-combine', 'inputex-select']
					},
					'inputex-datetime': {
						path: 'js/fields/DateTimeField.js',
						requires: ['inputex-datepicker', 'inputex-combine', 'inputex-time']
					},
					'inputex-timeinterval': {
						path: 'js/fields/TimeIntervalField.js',
						requires: ['inputex-combine', 'inputex-select']
					},
					'inputex-dsselect': {
						path: 'js/fields/DSSelectField.js',
						requires: ['inputex-select', 'yui2-datasource']
					},
					'inputex-email': {
						path: 'js/fields/EmailField.js',
						requires: ['inputex-string']
					},
					'inputex-hidden': {
						path: 'js/fields/HiddenField.js',
						requires: ['inputex-field']
					},
					'inputex-keyvalue': {
						path: 'js/fields/KeyValueField-beta.js',
						requires: ['inputex-combine']
					},
					'inputex-keyopvalue': {
						path: 'js/fields/KeyOpValueField-beta.js',
						requires: ['inputex-keyvalue']
					},
					'inputex-multiautocomplete': {
						path: 'js/fields/MultiAutoComplete.js',
						requires: ['inputex-autocomplete', 'inputex-ddlist']
					},
					'inputex-multiselect': {
						path: 'js/fields/MultiSelectField.js',
						requires: ['inputex-select', 'inputex-ddlist']
					},
					'inputex-number': {
						path: 'js/fields/NumberField.js',
						requires: ['inputex-string']
					},
					'inputex-password': {
						path: 'js/fields/PasswordField.js',
						requires: ['inputex-string']
					},
					'inputex-radio': {
						path: 'js/fields/RadioField.js',
						requires: ['selector','event-delegate','inputex-field','inputex-choice','inputex-string']
					},
					'inputex-rte': {
						path: 'js/fields/RTEField.js',
						requires: ['inputex-field', 'yui2-editor']
					},
					'inputex-slider': {
						path: 'js/fields/SliderField.js',
						requires: ['inputex-field', 'yui2-slider']
					},
					'inputex-textarea': {
						path: 'js/fields/Textarea.js',
						requires: ['inputex-field']
					},
					'inputex-type': {
						path: 'js/fields/TypeField.js',
						requires: ['inputex-field']
					},
					'inputex-uneditable': {
						path: 'js/fields/UneditableField.js',
						requires: ['inputex-field', 'inputex-visus']
					},
					'inputex-url': {
						path: 'js/fields/UrlField.js',
						requires: ['inputex-string']
					},
					'inputex-dateselectmonth': {
					  	path: 'js/fields/DateSelectMonthField.js',
						requires: ['inputex-combine', 'inputex-string', 'inputex-select']
					},
					'inputex-ipv4': {
					  	path: 'js/fields/IPv4Field.js',
						requires: ['inputex-string']
					},
					'inputex-vector': {
					  	path: 'js/fields/VectorField.js',
						requires: ['inputex-combine']
					},
					'inputex-map': {
					  	path: 'js/fields/MapField.js',
						requires: ['inputex-field']
					},
					'inputex-menu': {
					  	path: 'js/fields/MenuField.js',
					   requires: ['inputex','yui2-menu']
					},
					'inputex-file': {
					 	path: 'js/fields/FileField.js',
					   requires: ['inputex-field']
					},
					// Locals
					'inputex-lang-fr': {
					  	path: 'js/locals/fr.js',
						requires: ['inputex']
					},
					'inputex-lang-it': {
					  	path: 'js/locals/it.js',
					   requires: ['inputex']
					},
					'inputex-lang-nl': {
						path: 'js/locals/nl.js',
					   requires: ['inputex']
					},
					'inputex-lang-es': {
						path: 'js/locals/es.js',
					   requires: ['inputex']
					},
					'inputex-lang-de': {
						path: 'js/locals/de.js',
					   requires: ['inputex']
					}
					
				}
			}
		}
	};

	if(typeof YUI_config === 'undefined') { YUI_config = {groups: {}}; }
	Y.mix(YUI_config.groups, CONFIG.groups);

});
