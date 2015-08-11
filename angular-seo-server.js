var system = require('system');

if (system.args.length < 2) {
    console.log("Missing arguments.");
    phantom.exit();
}

var server = require('webserver').create();
var port = parseInt(system.args[1]);

var parse_qs = function(s) {
    var queryString = {};
    var a = document.createElement("a");
    a.href = s;
    a.search.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { queryString[$1] = $3; }
    );
    return queryString;
};

var renderHtml = function(url, cb) {
    var page = require('webpage').create();
    page.settings.loadImages = false;
    page.settings.localToRemoteUrlAccessEnabled = true;
    page.onCallback = function(data) {
        var status = data && data.status ? data.status : 200;
        cb(page.content, status);
        page.close();
    };
//    page.onConsoleMessage = function(msg, lineNum, sourceId) {
//        console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
//    };
    page.onInitialized = function() {
       page.evaluate(function() {
            setTimeout(function() {
                window.callPhantom();
            }, 10000);
        });
    };
    // make sure no cookies will be used
    phantom.clearCookies();
    page.open(url);
};

server.listen(port, function (request, response) {
    var url = 'https://' + request.headers.Host + request.url;
    var route = parse_qs(request.url)._escaped_fragment_;
    if(route){
         url = 'https://' + request.headers.Host + route;
    }
    renderHtml(url, function(html, statusCode) {
        response.statusCode = statusCode;
		response.setHeader('Content-Type', 'text/html');
        response.write(html);
        response.close();
    });
});

console.log('Listening on ' + port + '...');
console.log('Press Ctrl+C to stop.');
