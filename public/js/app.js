
window.Pigeon = Ember.Application.extend({
	
	init: function() {
		this._super();
		this.initSocket();	
	},
	
	global: Ember.child('Pigeon.Global'),
	
	dispatch: function(request, callback) {
		var dispatched = this.get('global.apis').some(function(api) {
			var method = (api.get('method') || '').toLowerCase();
			 
			if (api.get('endpoint') && request.uri.match('^' + api.get('endpoint') + '$')) {
				if (!method || method === 'all' || method === request.method.toLowerCase()) {
					api.call(request, callback);
					return true;
				}
			}
		})
		
		if (!dispatched)
			callback(null, 'Address Not Found');
	},
	
	initSocket: function() {
		var self = this;
		
		var socket = io.connect('http://localhost');
		
		socket.on('connect', function() {
			console.log('Connected!')
		})
		
		socket.on('disconnect', function() {
			console.error('Disconnected!')
		})
		
		socket.on('request', function (data) {
			var req = data.request;
			
			console.log('Request:', req);
			
			self.dispatch(req, function(response, err) {
				
				console.log('Response:', response);
				
				socket.emit('response', {
					body: response,
					callback: data.callback,
					error: err
				});
			})
		});
		
		socket.on('message', function(message) {
			console.log(message)
		})
		
		socket.on('warning', function(message) {
			console.warn(message)
		})
		
		socket.on('error', function(message) {
			console.error(message)
		})
	}
	
}).create();