var myApp={
	models:{},
	views:{},
	routers:{},
	collections:{}
};

myApp.models.Todo=Backbone.Model.extend({
	defaults:{
		text:'enter something...',
		done:false
	}
});

myApp.collections.TodoCollection=Backbone.Collection.extend({
	model:myApp.models.Todo
});

myApp.routers.BaseRouter=Backbone.Router.extend({
	routes:{
		'':'index',
		'new':'new'
	},
	new:function(){
		$("#content").html(new myApp.views.AddView().render().el);
	},
	index:function(){
		$("#content").html(new myApp.views.SearchView().render().el);
		if(window.todos){
			_.each(window.todos.models,function(item){
				//$("#content").append(new myApp.views.TodoView({model:item.toJSON()}).render().el);
				$("#content").append(new myApp.views.TodoView({model:item}).render().el);
			},this);
		}

		// _.each(this.model.models, function (employee) {
  //           this.$el.append(new directory.EmployeeListItemView({model:employee}).render().el);
  //       }, this);
		$("#footer").html(new myApp.views.FooterView().render().el);
		console.log("This is index router");
	}
});


myApp.views.TodoView=Backbone.View.extend({
	template:_.template($("#todo-template").html()),
	render:function(){
		//this.$el.html(this.template());
		// var data = _.clone(this.model.attributes);
		// if(this.model.id){
  //       	data.id = this.model.id;
		// }
		// console.log("rendering");
		// console.log(this.model);
		// console.log(this.model.attributes);
		// console.dir(data);
		//console.log(this.model);
		console.log(this.template(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));
		return this;
	},
	events:{
		'click .checkbox':function(event){
			console.dir(event);
			console.log(event.currentTarget.checked);
			console.log(this.model);
			this.model.set({done:!this.model.get('done')});
		}
	}
});

myApp.views.AddView=Backbone.View.extend({
	//tagName:'li',
	template:_.template($("#add-template").html()),
	render:function(){
		this.$el.html(this.template());
		return this;
	},
	events: {
        'click #save': 'saveUser'
    },
    saveUser: function (ev) {
    	var text=$("#text").val();
    	// var todoDetails={};
    	// todoDetails["text"]=text;
    	// console.dir(todoDetails);
        var todo = new myApp.models.Todo();
        todo.set('text',text);
        window.todos.add(todo);
        // todo.save(todoDetails, {
        //   success: function (todo) {
            window.baserouter.navigate('', {trigger:true});
        //   }
        // });
        return false;
    },
});


myApp.views.SearchView=Backbone.View.extend({
	template:_.template($("#search-template").html()),
	render:function(){
		this.$el.html(this.template());
		return this;
	},
	events:{
		"keyup #search":function(event){
			// console.log('Searching : '+event.currentTarget);
			// console.log('Searching : '+$(event.currentTarget).val());
			var searchKey=$("#search").val();
			var filtered = window.todos.filter(function(todo) {
      			return todo.get("text") === searchKey;
      		});
    		//return new Boxes(filtered);
    		console.log(filtered);
		}
	}
});


myApp.views.FooterView=Backbone.View.extend({
	template:_.template($("#stats-template").html()),
	render:function(){
		this.$el.html(this.template());
		return this;
	}
});

$(function(){
	window.baserouter=new myApp.routers.BaseRouter();
	Backbone.history.start();
	window.todos=new myApp.collections.TodoCollection();
});