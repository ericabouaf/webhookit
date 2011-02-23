# Installation on an Amazon EC2 instance

We'll set it up on a Amazon EC2 instance, through the NginX webserver (as a simple HTTP Proxy).

## Installation

 * Have a AWS account up and running.
 * Install EC2 tools
 * Install brew

    curl -LsSf http://github.com/mxcl/homebrew/tarball/master | sudo tar xvz -C/usr/local --strip 1
		
 * Install EC2 Api tools

    sudo brew install ec2-api-tools

## Configure the keypair

 * Generate a key (*.pem file) from the AWS console

    mkdir ~/.ec2
    cp mykey.pem ~/.ec2
    chmod 400 ~/.ec2/mykey.pem

		# add this to your .ssh/config
		  Host *.amazonaws.com
		    IdentityFile ~/.ec2/ec2-keypair.pem
		    User ubuntu
		    UserKnownHostsFile /dev/null
		    StrictHostKeyChecking no

		# allow ssh and http
		ec2-authorize default -p 22 -p 80

## EC2 Launch script

If you have the ec2 tools installed (I'd recommend [brew](http://github.com/mxcl/homebrew)), and you have your credential environment variables in place, you can run this script to launch an ec2 instance. It's using a Base Debian Lenny AMI:


http://github.com/mikehale/ec2-autoscale/blob/master/ec2_commands    


## Install

Copy scripts/install.sh to your server

It installs NginX, Node.js, mongoDB, npm (and some node libs)


## TODO: Monit

http://howtonode.org/deploying-node-upstart-monit


<pre>
#!/bin/sh
#
# Install all dependencies on a Debian 
#

apt-get update
apt-get upgrade -y

apt-get install -y build-essential git-core nginx libssl-dev pkg-config

NODEVERSION=0.4.1

# Node.js
wget http://nodejs.org/dist/node-v$NODEVERSION.tar.gz
tar xvzf node-v$NODEVERSION.tar.gz
cd node-v$NODEVERSION
./configure
make
make install
cd ..
node-v$NODEVERSION.tar.gz

# NPM
curl http://npmjs.org/install.sh | sh

# MongoDB
wget http://fastdl.mongodb.org/linux/mongodb-linux-i686-1.6.3.tgz
tar xvzf mongodb-linux-i686-1.6.3.tgz
rm mongodb-linux-i686-1.6.3.tgz
mkdir -p /data/db
/root/mongodb-linux-i686-1.6.3/bin/mongod &

# Config
adduser --system --shell /bin/bash \
        --gecos 'User for running node.js projects' \
        --group --disabled-password --home /home/node nodejs

# Add ubuntu user to the nodejs group
# /usr/sbin/usermod -a -G nodejs ubuntu

# Setup basic nginx proxy.
unlink /etc/nginx/sites-available/default
cat > /etc/nginx/sites-available/node_proxy.conf <<EOF
server {
listen 80;
# proxy to node
location / {
proxy_pass http://127.0.0.1:8124/;
}
}
EOF
ln -s /etc/nginx/sites-available/node_proxy.conf /etc/nginx/sites-enabled/node_proxy.conf
/etc/init.d/nginx restart
</pre>



<pre>
#!/bin/sh

# debianzone-us-east-1/ami/lenny/base/20100312/32/lenny-base-20100312

ec2-run-instances -t c1.medium -n 1 -g default -k default --user-data-file install-ec2 ami-01d13e68
</pre>

<pre>

  #!/bin/sh

  tar -cvzf webhookit.tar.gz .

  scp -i ~/.ssh/laptopkey.pem webhookit.tar.gz root@ec2-174-129-182-193.compute-1.amazonaws.com:
  
  
</pre>


<script type="text/javascript">var disqus_shortname = 'aws_install';</script>
