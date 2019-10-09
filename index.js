var http = require('http');
var serverUtil = require('./src/db_utils')

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("Pining Server response: " + serverUtil.pingServer())
    res.end();
}).listen(8080);