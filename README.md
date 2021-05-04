# jquery_routing
Class for SPA routing in jquery for laravel

route - variable with an instance of the class

Methods:
* route.redirect(htmlfilename) - method for getting a file at a specific path and output to the page;
* route.attach_module(htmlfilename, divid) - method for getting a file at a specific and outputting it to a specific div;
* route.get(data, path) - method sending the specified json data by the GET method along the specified path;
* route.post(data, path) - method sending the specified json data by the POST method along the specified path;

specific path  - "public/spa/pages/" + htmlfilename + ".html"
