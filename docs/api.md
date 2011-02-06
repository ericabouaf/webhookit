
# HTTP API
	
## URL pattern

The general URL pattern to run a wiring is the following :

    /wirings/:id/run[.(html|json|xml)]?param1=value1&param2=value2


## Run Form

If you point your browser to the following URL, you'll get an HTML form to invoke the wiring : 

    GET /wirings/:id
    
The form is automatically built from the "input" modules of the wiring.
        
You can pre-set different parameters in this form : 

    GET /wirings/:id?param1=value1&param2=value2
    

## Template Rendering

If you are using an EJS template

<script type="text/javascript">var disqus_shortname = 'api';</script>