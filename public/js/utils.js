
Ember.children = function(cls) {
	
	return function(key, children) {
		var self = this;
		
		if (typeof cls === 'string')
			cls = Ember.get(cls);
		
		var proto   = {}
		var name    = Ember.typeName(self);
		proto[name] = proto.parent = this;
		
		children = (children || []).map(function(child) {
			return cls.create(child, proto);
		})
		children.push(cls.create(proto));
		
		return children;
	
	}.property()
}

Ember.child = function(cls) {
	
	return function(key, child) {
		var self = this;
		
		if (typeof cls === 'string')
			cls = Ember.get(cls);
		
		var proto   = {}
		var name    = Ember.typeName(self);
		proto[name] = proto.parent = this;
		
		return cls.create(child, proto);
	
	}.property()
}

Ember.typeName = function(ob) {
	return ob.constructor.toString().split('.').get('lastObject').toLowerCase();
}


window.util = {
	
	eval: function(_string, _scope) {
		
		if (!_string)
			return;
		
		for (var _key in _scope) {
			eval('var ' + _key + ' = _scope[_key];');
		}
		
		eval('var result = ' + _string.trim());
		
		return result;
	},
	
	deepCopy: function(item) {
		return JSON.parse(JSON.stringify(item));
	}
	
}