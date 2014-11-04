
Ember.RadioButton = Ember.View.extend({
    tagName : "input",
    type : "radio",
    attributeBindings : [ "name", "type", "value", "selection:checked:" ],
    change: function() {
        this.set("selection", true)
    }
});


Pigeon.GlobalView = Ember.View.extend({
	actions: {
		
		reset: function() {
			this.get('content').resetState();
		}
	}
})


Pigeon.ApiView = Ember.View.extend({
	
	actions: {
		
		remove: function() {
			this.get('content').remove();
		}
	}
})

Pigeon.OptionView = Ember.View.extend({
	
	actions: {
		
		remove: function() {
			this.get('content').remove();
		}
	}
})

Pigeon.ValueView = Ember.View.extend({
	
	actions: {
		
		remove: function() {
			this.get('content').remove();
		}
	}
})

Pigeon.MiddleWareView = Ember.View.extend({
	
})



Pigeon.EditorView = Ember.View.extend({
	
	templateName: 'editor',
	
	didInsertElement: function() {
		var view = this;
		var editor = this.get('editor');
		
		editor.getSession().setMode('ace/mode/javascript');
		editor.getSession().setUseWorker(false);
		editor.renderer.setShowGutter(false);
		editor.blur();
		
		editor.setOptions({
			minLines: this.get('dynamic') ? 0 : 5,
			maxLines: 15
		});
		
		editor.getSession().setValue(view.get('value') || '')
		
		editor.on('change', function() {
			view.set('value', editor.getSession().getValue())
		})
	},
	
	editor: function() {
		return ace.edit(this.get('id'))
	}.property(),
	
	id: function() {
		return 'editor-' + parseInt(Math.random() * 1000 % 1000)
	}.property()
})

Pigeon.StateView = Ember.View.extend({
	
	actions: {
		
		reset: function() {
			this.get('content').resetState();
		}
	}
})

Ember.Handlebars.registerBoundHelper('json', function(ob) {
    
	try {
	    return JSON.stringify(ob, null, 2);
	}
	catch(e) {
	    return e;
	}
	
});