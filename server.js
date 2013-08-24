// Dependencies:
var createServer = require('http').createServer;
var staticServer = require('node-static').Server;
var webmake      = require('webmake');


// Project path:
var projectPath  = __dirname;
// Public folder path (statics)
var staticsPath  = projectPath + '/public';

// Path to js program file
var programPath = __dirname + '/lib/exponential.js';
// Server port:
var port = 8000;
// Url at which we want to serve generated js file
var programUrl = '/js/exponential.js';

staticServer = new staticServer(staticsPath);


// Initialize http server
createServer(function (req, res) {
	// Start the flow (new Stream API demands that)
	req.resume();
	// Respond to request
	req.on('end', function () {
		if (req.url === programUrl) {
			// Generate bundle with Webmake

			// Send headers
			res.writeHead(200, {
				'Content-Type': 'application/javascript; charset=utf-8',
				// Do not cache generated bundle
				'Cache-Control': 'no-cache'
			});

			var time = Date.now();
			webmake(programPath, { cache: true }, function (err, content) {
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