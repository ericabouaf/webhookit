# Custom modules packages


## NPM

WebHookIt core modules are distributed through the npm(http://npmjs.org/) package manager, which means you can contribute WebHookIt modules by publishing a package to the [npm registry](http://search.npmjs.org/) called "webhookit-<i>mymodule</i>".

The WebHookIt modules can be installed/updated/uninstalled from the /packages page. This page automatically lists all packages called "webhookit-mymodule" from the npm registry.



## Creating a package

Create a directory structure like this one :

 * mymodule/
   * package.json
   * lib/
     * webhookit-mymodule.js

The index.js file must contain

Then, configure the package.json file :

    {
        "name": "webhookit-yql",
        "version": "0.0.1",
        "description": "YQL module for WebHookIt",
        "author": "Eric Abouaf <eric.abouaf@gmail.com>",
        "bugs": { "url" : "http://github.com/neyric/webhookit/issues" },
        "os": ["darwin", "linux"],
        "contributors": [
            "Eric Abouaf <eric.abouaf@gmail.com> (http://neyric.com)"
        ],
        "engines": {
            "node" : ">=0.6.7"
        },
        "directories": {
            "lib" : "./lib"
        },
        "main": "./lib/webhookit-yql",
        "dependencies": {
            "yql": ">=0.2.0"
        },
        "licenses":[  {"type" : "MIT"} ],
        "repository": {
            "type":"git",
            "url":"http://github.com/neyric/webhookit.git"
        }
    }


Finally, publish your package on the npm registry :

    cd mymodule/
    npm publish .

Then go to the /packages page on your WebHookIt installation, and click the Install Package button !




<script type="text/javascript">var disqus_shortname = 'custom-modules-packages';</script>
