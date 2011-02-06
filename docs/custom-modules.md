# Creating custom modules

WebHookIt is made to be extended to your own needs. 


There are two kinds of modules in WebHookIt :

 * Core Modules : simple asynchronous functions written in Node.js + module interface definitions
 * wirings module : created via the visual editor, they uses core modules and can be composed

This page only concerns Core Modules.


## Development 

When creating a custom module, it is simpler to create a file in *lib/modules/* called *mymodule.js*, since you won't need to publish the package at each change.

This can be used in "production" too but the advantage of using a NPM package is that you can define dependencies for your module. (for example, the webhookit-yql package depends on the yql package)


## Custom module file

Custom modules must export two objects :

 * definition: an object containing the UI definition of the module
 * run: a method which actually execute your module



<script type="text/javascript">var disqus_shortname = 'custom-modules';</script>
