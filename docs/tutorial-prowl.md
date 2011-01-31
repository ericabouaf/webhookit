
# Tutorial Creating a prowl module
	

Prowl is the Growl client for iOS. Notifications from your Mac or Windows computer are sent to your iPhone, iPod touch, or iPad using push. Prowl has an extensive [API](http://prowlapp.com/api.php), which allows your scripts to integrate beautifully.


## Building a re-usable Prowl module


The API tells us to send a POST request to this URL

    POST https://prowlapp.com/publicapi/add

We will obviously need an HTTP request module

Since we want to re-use this module in other wirings, we will define the 5 parameters of the API as input modules :

 * apikey
 * priority
 * application
 * event
 * description

Finally, we connect the output of the HTTP module to a new output module
	
## Video

<object width="480" height="385"><param name="movie" value="http://www.youtube.com/v/R94-d36g-EI?fs=1&amp;hl=fr_FR"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/R94-d36g-EI?fs=1&amp;hl=fr_FR" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="480" height="385"></embed></object>




<script type="text/javascript">var disqus_shortname = 'tutorial-prowl';</script>

