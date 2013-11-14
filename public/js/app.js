
window.Pigeon = Ember.Application.extend({
	
	apis: Ember.children('Pigeon.Api'),
	
	construct: function() {
		this.setProperties.apply(this, arguments);
	},
	
	type: function() {
		return Ember.typeName(this);
	}.property(),
	
	resetState: function() {
		this.get('apis').forEach(function(api) {
			api.resetState();
		})
	},
	
	dispatch: function(uri, data, callback) {
		this.get('apis').forEach(function(api) {
			if (api.get('endpoint') === uri) {
				api.call(data, callback)
			}
		})
	}
	
}).create();