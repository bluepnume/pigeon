

Pigeon.Model = Ember.Object.extend({
	
	init: function() {
		var self = this;
		
		if (this.get('keyName'))
			this.addObserver(this.get('keyName'), this, 'keyChanged');
	},
	
	type: function() {
		return Ember.typeName(this);
	}.property(),
	
	plural: function() {
		return this.get('type') + 's';	
	}.property('type'),
	
	proto: function() {
		var proto = {}
		proto[this.get('parent.type')] = proto.parent = this.get('parent');
		return proto;
	}.property('name', 'parent.type'),
	
	all: function() {
		return this.get('parent').get(this.get('plural'));
	}.property('parent', 'plural'),
	
	others: function() {
		var self = this
		return this.get('all').filter(function(other) {
			return other !== self;
		})
	}.property('all', 'all.length'),
	
	keyValue: function() {
		if (this.get('keyName'))
			return this.get(this.get('keyName'))
	}.property('keyName').volatile(),
	
	construct: function() {
		this.setProperties.apply(this, arguments);
	},
	
	createNew: function() {
		return this.constructor.create(this.get('proto'));
	},
	
	addNew: function() {
		this.get('all').pushObject(this.createNew());
	},
	
	remove: function() {
		this.get('all').removeObject(this);
		
		if (!this.get('all').length)
			this.addNew();
	},
	
	keyChanged: function() {
		var self = this;
		
		emptyCount = this.get('others').filter(function(item) {
			return !item.get('keyValue')
		}).length;
		
		if (this.get('keyValue') && !emptyCount)
			this.addNew();
		
		else if (!this.get('keyValue') && emptyCount)
			this.get('others').forEach(function(item) {
				if (!item.get('keyValue'))
					item.remove();
			});
	}
})



Pigeon.Global = Pigeon.Model.extend({
	keyName: 'global',
	
	apis: Ember.children('Pigeon.Api'),
	options: Ember.children('Pigeon.Option'),
	
	body: function(key, value) {
	
		if (typeof value === 'string')
			return value;
		
		return JSON.stringify(value, null, 2);
	}.property(),
	
	error: function() {
		
		try {
			JSON.stringify(util.eval(this.get('body'), {
				options: this.get('evaluatedOptions')
			}));
		} catch(e) {
			return e;
		}
	}.property('body'),
	
	state: function(key, value) {
		
		if (value)
			return value;
		
		if (!this.get('error'))
			return util.eval(this.get('body'), {
				options: this.get('evaluatedOptions')
			});

	}.property('body', 'error', 'evaluatedOptions'),
	
	evaluatedOptions: function() {
		var self = this;
		
		var options = {}
		this.get('options').forEach(function(option) {
			var key = option.get('key');
			
			if (!key)
				return;
			
			try {
				options[key] = util.eval(option.get('content'), {
					global: self.get('pigeon.state'),
					option: option
				})
			}
			catch (e) {
				options[key] = option.get('content');
			}
		})
		
		return options
		
	}.property('options.@each.key', 'options.@each.content'),
	
	updateState: function() {
		this.set('state', util.deepCopy(this.get('state')));
	},
	
	resetState: function() {
		this.get('apis').forEach(function(api) {
			api.resetState();
		});
		
		this.propertyDidChange('state');
	},
})


Pigeon.Api = Pigeon.Model.extend({
	keyName: 'endpoint',
	
	options: Ember.children('Pigeon.Option'),
	
	init: function() {
		this._super();
	},
	
	middleware: function(key, value) {
		if (!value)
			return;
		
		value = value.toString().trim();
		
		var match = value.match('function\\s*\\([^)]*\\)\\s*\{[ \\t]*\\n?([\\s\\S]+)\\s*\\}');
		
		if (match)
			value = match[1].trimRight();
			
		if (!value.trim())
			return;
		
		var lines = value.split('\n')
		
		while (true) {
			
			var whitespaceChar = lines[0].charAt(0);
			
			if (whitespaceChar !== ' ' && whitespaceChar != '\t')
				break;
			
			var indented = lines.every(function(line) {
				
				if (!line)
					return true
				
				return line.charAt(0) === whitespaceChar;
			})
			
			if (indented)
				lines = lines.map(function(line) {
					if (!line)
						return line;
					
					return line.slice(1);
				})
			else
				break
		}
		
		return lines.filter(function(line) {
			return line;
		}).join('\n')
		
	}.property(),
	
	body: function(key, value) {
	
		if (typeof value === 'string')
			return value;
		
		return JSON.stringify(value, null, 2);
	}.property(),
	
	error: function() {
		
		try {
			JSON.stringify(util.eval(this.get('body'), {
				global:  this.get('global.state'),
				options: this.get('evaluatedOptions')
			}));
		} catch(e) {
			return e;
		}
	}.property('body'),
	
	state: function(key, value) {
		
		if (value)
			return value;
		
		if (!this.get('error'))
			return util.eval(this.get('body'), {
				global:  this.get('global.state'),
				options: this.get('evaluatedOptions')
			});
		
	}.property('body', 'error', 'evaluatedOptions'),
	
	evaluatedOptions: function() {
		var self = this;
		
		var options = {}
		this.get('options').forEach(function(option) {
			var key = option.get('key');
			
			if (!key)
				return;
			
			try {
				options[key] = util.eval(option.get('content'), {
					global: self.get('pigeon.state'),
					option: option
				})
			}
			catch (e) {
				options[key] = option.get('content');
			}
		})
		
		return options
		
	}.property('options.@each.key', 'options.@each.content'),
	
	updateState: function() {
		this.set('state', util.deepCopy(this.get('state')));
	},
	
	resetState: function(key, value) {
		this.propertyDidChange('state');
	},
	
	call: function(request, callback) {
		
		var state = this.get('state');
		
		if (this.get('middleware')) {
			util.eval(this.get('middleware'), {
				request: request,
				global:  this.get('global.state'),
				state:   this.get('state')
			});
			this.updateState();
			this.get('global').updateState();
		}
		
		callback(state);
	}
})


Pigeon.Option = Pigeon.Model.extend({
	keyName: 'key',
	
	init: function() {
		this._super();
		this.get('content');	
	},
	
	qualified_key: function() {
		return 'options.' + this.get('key')	
	}.property('key'),
	
	id: function() {
		return this.get('key') + '-' + parseInt(Math.random() * 1000 % 1000)
	}.property('key'),
	
	values: Ember.children('Pigeon.Value'),
	
	value: function() {
		return this.get('values').findProperty('selected', true);
	}.property('values.@each.selected'),
	
	content: function() {
		return this.get('value.content');
	}.property('value.content')
})

Pigeon.Value = Pigeon.Model.extend({
	keyName: 'content',
	
	select: function() {
		if (this.get('selected'))
			this.get('others').forEach(function(value) {
				value.set('selected', false);
			})
	}.observes('selected'),
})