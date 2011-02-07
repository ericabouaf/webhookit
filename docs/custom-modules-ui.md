# Custom modules User Interface

Most of the UI elements in the WebHookIt Editor are provided by the [WireIt](http://neyric.github.com/wireit) javascript library. In particular, WireIt "boxes" are called **Containers**.

When designing a WebHookIt module, you will have to define which Container to use, as well as some configuration about it. You can either :

 * leverage existing Containers (recommanded)
 * create a Custom container (advanced usage)

The easiest way to get started, is to use an existing Container. WireIt pre-defines some kind of containers :

 * **FormContainer**: displays a form inside the box
 * **InOutContainer**: named inputs/outputs
 * **ImageContainer**: simple image container
 * **TextareaContainer**: simple text zone
 
When generating a module from a previously created wiring, WebHookIt is using the _ComposedContainer_, which inherits the _FormContainer_. _ComposedContainer_ generates the form from the different _input_ modules present in your wiring.

Creating a custom WireIt Container can be hard, depending on what you want to do. You'll need good experience and knowledge in Javascript, the YUI Library, and the WireIt framework. The WireIt documentation has a section about [creating custom containers](http://localhost:8888/Projets/WireIt/guide.html#containers).


## exports.definition


### General form

The WireIt definition of the container representing the module is a JSON structure, which looks like so :

    exports.definition = {
       "name": "yql",
       "category": "Sources",
       "container": {
          "xtype": "WireIt.TextareaContainer",
          "icon": "/images/module_icons/yql.png",
          "title": "yql"
       }
    };


 * name : 
 * category
 * container
 * xtype
 * icon
 * title

**Important**: Depending of the container _xtype_, the _container_ object can take additional properties.


### Configuring Terminals

All WireIt Containers must inherit the base class _WireIt.Container_. 

This class specifies the _terminals_ properties, which is an array of Terminal configurations.


### YQL example

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




## Styling with CSS

WireIt assigns two CSS classes to containers :

 * the name of the container's xtype
 * the name of the container

The YQL module will have the following classes set: _WireIt-TextareaContainer_ and _WiringEditor-module-YQL_


<script type="text/javascript">var disqus_shortname = 'custom-modules-ui';</script>