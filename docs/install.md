# Installation

## Node.js

Follow the instructions on [https://github.com/ry/node/wiki/Installation](https://github.com/ry/node/wiki/Installation) to install [Node.js](http://nodejs.org/)

## NPM

[npm](npmjs.org) is a package manager for Node.js. It manages dependencies and does other cool stuff.

    curl http://npmjs.org/install.sh | sh


## mongoDB

[MongoDB](http://www.mongodb.org/) is a document-oriented database.

Got to [http://www.mongodb.org/downloads](http://www.mongodb.org/downloads), download the appropriate version for your OS, and unpack it.

## Starting the server

Launch the mongoDB database

    cd mongo/bin
    ./mongod

Launch the WebHookIt server

    cd webhookit
    node server.js

By default, it should be running on [http://localhost:8124](http://localhost:8124)


## Production

When running in production, set the Express.js environment to production

Launch the server in production mode :

    $ EXPRESS_ENV=production node server.js

You should use an event-loop based HTTP server. 
(ie: Apache-fork not Recommended, use WebHookIt as a standalone server or use something like NginX)



You can optionally configure the web server to serve static files from the /public/ directory.


<script type="text/javascript">var disqus_shortname = 'install';</script>

