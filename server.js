// Dependencies:
var createServer = require('http').createServer;
var staticServer = require('node-static').Server;
var webmake      = require('webmake');


// Project path:
var projectPath  = __dirname;
// Public folder path (statics)
var staticsPath  = projectPath + '/public';

// Server port:
var port = 8000;

staticServer = new staticServer(staticsPath);

var bundles = {
	'/js/exponential.js': __dirname + '/lib/exponential.js',
	'/js/bits.js': __dirname + '/lib/bits.js'
};

// Initialize http server
createServer(function (req, res) {
	// Start the flow (new Stream API demands that)
	req.resume();
	// Respond to request
	req.on('end', function () {
		if ( bundles[req.url] ) {
			// Generate bundle with Webmake
			var programPath = bundles[ req.url ];
			// Send headers
			res.writeHead(200, {
				'Content-Type': 'application/javascript; charset=utf-8',
				// Do not cache generated bundle
				'Cache-Control': 'no-cache'
			});

			var time = Date.now();
			webmake(bundles[req.url], { cache: true }, function (err, content) {
				if (err) {
					console.error("Webmake error: " + err.message);
					res.end('console.error("Webmake error: ' + err.message + '");');
					return;
				}

				// Send script
				console.log("Webmake OK (" + ((Date.now() - time)/1000).toFixed(3) + "s)");
				res.end(content);
			});
		} else {
			staticServer.serve(req, res);
		}
	});
}).listen(port);

console.log("Server started");