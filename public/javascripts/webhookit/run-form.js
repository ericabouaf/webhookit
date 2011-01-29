/*fields.push({
	type: "radio", 
	"name":"_render", value:"html", label: "outputFormat", choices: ["html","json","jsonp","xml"],
	interactions: [
       { valueTrigger: "jsonp", actions: [ { name: 'callback', action: 'show'}] },
		// TODO: We can do much better than this using inputEx interactions
		{ valueTrigger: "html", actions: [{name: 'callback',action: 'hide'}] },
		{ valueTrigger: "json", actions: [{name: 'callback',action: 'hide'}] },
		{ valueTrigger: "xml", actions: [{name: 'callback',action: 'hide'}]}
	]
});

fields.push({type: "string", "name":"callback", value:"myFunc", label: "JSONP callback"});*/

var url = null;
var form = null;

var getUrl = function(value) {
	var p = [];
	for(var key in value) { 
		if(value.hasOwnProperty(key) && key != "_render" && key != "callback")	{
			p.push(key+'='+encodeURIComponent(value[key]) ); 
		}
	}
	var url = baseUrl+"/run"+(p.length > 0 ? "?" : "")+p.join('&');
	return url;
};

var onUpdate = function(e,params) { 
	var value = params[0]; 
	url = getUrl(value);
	console.log("url", url);
	//YAHOO.lang.JSON.stringify(value); 
	YAHOO.util.Dom.get('urlContainer').innerHTML = url; 
};

YAHOO.util.Event.addListener(window,'load', function() {
   form = new inputEx.Group({parentEl: 'formParams', fields: fields });
   form.setValue(defaultValue);
   form.updatedEvt.subscribe(onUpdate);
});

YAHOO.util.Event.addListener('toggleUrlContainer','click', function(e) {
	YAHOO.util.Event.stopEvent(e);
	
	var runUrl = YAHOO.util.Dom.get('runUrl');
	var link = YAHOO.util.Dom.get('toggleUrlContainer');
	if(runUrl.style.display == '') {
		runUrl.style.display = 'none';
		link.innerHTML = "Show the url";
	}
	else {
		runUrl.style.display = '';
		link.innerHTML = "Hide the url";
	}
});


YAHOO.util.Event.addListener('runButton','click', function(e) {
	var value = form.getValue(), url = getUrl(value);
	window.location = url;
	/*YAHOO.util.Dom.get('jsonTreeContainer').innerHTML = "<img src='/javascripts/inputex/images/spinner.gif' /> Running...";
	YAHOO.util.Connect.asyncRequest('GET', url, { 
	   success: function(o) { 
			try {
				var obj = YAHOO.lang.JSON.parse(o.responseText);
				YAHOO.util.Dom.get('jsonTreeContainer').innerHTML = "";
				new YAHOO.inputEx.widget.JsonTreeInspector('jsonTreeContainer', obj);
			}
			catch(ex) {	
				console.log(ex);
			}
	   } 
	});*/
});