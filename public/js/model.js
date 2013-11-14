

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


Pigeon.Api = Pigeon.Model.extend({
	keyName: 'endpoint',
	
	options: Ember.children('Pigeon.Option'),
	
	init: function() {
		this._super();
		
		this.resetState();
	},
	
	body: function(key, value) {
	
		if (typeof value === 'string')
			return value;
		
		return JSON.stringify(value, null, 2);
	}.property(),
	
	obj: function(key, value) {
		
		var options = {}
		this.get('options').forEach(function(option) {
			if (!option.get('key')) return;
			
			try {
				eval('var content = ' + option.get('content'))
			}
			catch (e) {
				var content = option.get('content');
			}
			
			options[option.get('key')] = content;
		})
		
		try {
			eval('var body = ' + this.get('body'));
			this.set('error', null);
			return body;
		}
		catch (e) {
			this.set('error', e)
		}
	}.property('body', 'options.@each.key', 'options.@each.content'),
	
	updateState: function() {
		this.propertyDidChange('state');
	},
	
	resetState: function(key, value) {
		this.set('state', JSON.parse(JSON.stringify(this.get('obj') || null)));
	}.observes('obj'),
	
	json: function() {
		
		try {
			return JSON.stringify(this.get('state'), null, 2);
			this.set('error', null);
			return state;
		}
		catch (e) {
			this.set('error', e)
		}
	}.property('state'),
	
	call: function(request, callback) {
		
		var state = this.get('state');
		
		if (this.get('middleware')) {
			eval(this.get('middleware'));
			this.updateState();
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