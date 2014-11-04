var express = require('express');
var http    = require('http')
var io      = require('socket.io');
var fs      = require('fs');
var uuid    = require('node-uuid');


var proxy = {
    port: 4000,
    
    init: function() {
        var proxy = this;
        this.callbacks = {};
        
        this.createServer();
        this.createSocket();
    },
    
    createServer: function() {
        
        this.app = express();
        this.app.use(express.static(__dirname + '/public'));
        
        this.app.use(function(req, res, next) {
            var data = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) { 
               data += chunk;
            });
            req.on('end', function() {
                req.rawBody = data;
                next()
            });
        });
        
        this.server = http.createServer(this.app)
        this.server.listen(this.port);
        
        this.app.get('/', function(req, res) {
            fs.readFile(__dirname + '/public/index.htm', function (err, data) {
                res.writeHead(200);
                res.end(data);
            });
        })
        
        this.app.all('/*', function(req, res) {
            proxy.request(req, res)
        })
    },
    
    createSocket: function() {
        
        io.listen(this.server).sockets.on('connection', function (socket) {
            proxy.connect(socket)
        })
    },
    
    connect: function(socket) {
        var proxy = this;
        
        if (this.socket) {
            this.socket.emit('error', 'New browser socket opened in new browser window');
            this.socket.disconnect();
            
            socket.emit('warning', 'Closed existing socket in other browser window')
        }

        this.socket = socket;
        
        this.socket.on('disconnect', function (data) {
            proxy.disconnect();
        });   
        
        this.socket.on('response', function (data) {
            proxy.response(data);
        });    
    },
    
    disconnect: function() {
        delete this.socket;
    },
    
    request: function(req, res) {
        var proxy = this;
        
        try {
            if (req.method === 'POST')
                var body = JSON.parse(req.rawBody);
        } catch(e) {
            return this.httpErrorMessage(res, 'Invalid JSON request: ' + e);
        }
        
        var request = {
            uri:    req.url,
            method: req.method,
            body:   body,
        }
        
        this.socketRequest(request, function(response, err) {
            if (err)
                return proxy.httpErrorMessage(res, err);
            
            proxy.httpResponse(res, response)
        })
    },
    
    response: function(res) {
        this.socketResponse(res);
    },
    
    httpResponse: function(res, body, status) {
        res.writeHead(status || 200);
        return res.end(JSON.stringify(body, null, 2) + '\n');
    },
    
    httpError: function(res, body) {
        this.httpResponse(res, body, 500);
    },
    
    httpErrorMessage: function(res, message) {
        this.httpError(res, {error: message})  
    },
    
    socketRequest: function(request, callback) {
        
        if (!this.socket)
            return callback(null, 'No browser connected');
        
        var id = uuid.v4();
        
        this.socket.emit('request', {
            request: request,
            callback: id
        });
        
        this.callbacks[id] = callback;
    },
    
    socketResponse: function(res) {
        if (!this.callbacks.hasOwnProperty(res.callback))
            return console.error('Callback not found!')
        
        var callback = this.callbacks[res.callback];
        delete this.callbacks[res.callback];
        
        if (res.error)
            callback(res.body, res.error);
        else
            callback(res.body)
        
    }
}

proxy.init();