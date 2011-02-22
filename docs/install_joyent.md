
# Installation on the free Joyent Node SmartMachine Service

Joyent provides cloud hosting for Node.js applications on [https://no.de/](https://no.de/).

First, create an account if you don't have one, sign in to request a coupon code, and then provision your Node SmartMachine.

## MongoDB

Login to your SmartMachine :

    $ ssh node@yourinstancename.no.de

Download and unpack mongoDB :

    $ curl -O http://downloads.mongodb.org/sunos5/mongodb-sunos5-x86_64-latest.tgz
    $ gtar -xvzf mongodb-sunos5-x86_64-latest.tgz
    $ mv mongodb-sunos5-x86_64-2011-01-05/ mongo

Download and install mongoDB :

    $ cd mongo
    $ curl -O http://downloads.mongodb.org.s3.amazonaws.com/sunos5/mongo-extra-64.tgz
    $ gtar -xvzf mongo-extra-64.tgz
    $ export LD_LIBRARY_PATH=mongo-extra-64 # you might want to put 

Create the data directory, and start the server as a deamon :
    
    $ cd 
    $ mkdir data
    $ cd mongo
    $ ./bin/mongod --dbpath /home/node/data --fork --logpath /var/log/mongodb.log --logappend

Here is how to stop the deamon :

    $ ./mongo
    > db.shutdownServer()


## NPM and dependencies

npm is pre-installed on your node machine, update it with :

    $ npm update npm

Install WebHookIt dependencies :

    $ npm install express xml2js-expat ejs mongodb cron
    
## Deploy with Git
    
First, edit config files to set port to 80 & IP)

    $ git init
    $ git add server.js
    $ git commit -m "initial commit"

Deploy

    $ git remote add joyent ssh://node@yourname.no.de/home/node/repo
    $ git push joyent master
    
    
## Start / Watch log


    $ node-service-restart
    $ node-service-log


<script type="text/javascript">var disqus_shortname = 'install-joyent';</script>
