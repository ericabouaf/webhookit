/*
YUI 3.5.0pr1 (build 4342)
Copyright 2011 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('pjax-plugin', function(Y) {

/**
Node plugin that provides seamless, gracefully degrading pjax functionality.

@module pjax-plugin
**/

Y.Plugin.Pjax = Y.Base.create('pjaxPlugin', Y.Pjax, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        this.set('container', config.host);
    }
}, {
    NS: 'pjax'
});


}, '3.5.0pr1' ,{requires:['node-pluginhost', 'pjax', 'plugin']});
