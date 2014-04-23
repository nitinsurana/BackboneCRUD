 $.fn.serializeObject = function() {
     var o = {};
     var a = this.serializeArray();
     $.each(a, function() {
         if (o[this.name] !== undefined) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
 };
 var UserModel = Backbone.Model.extend({
     defaults: {
         firstname: '',
         lastname: '',
         age: 0,
         id:undefined
     }
 });
 var UserCollection = Backbone.Collection.extend({
     model: UserModel
 });
 // var user=new UserModel();
 var sampleUserOne = new UserModel({
     id: 1,
     firstname: 'Shweta',
     lastname: 'Moses',
     age: 24
 });
 var sampleUserTwo = new UserModel({
     id: 2,
     firstname: 'Kamla',
     lastname: 'Surana',
     age: 42
 });
 var sampleUserThree = new UserModel({
     id: 3,
     firstname: 'Nikhil',
     lastname: 'Singh',
     age: 26
 });
 var userCollection = new UserCollection([sampleUserOne, sampleUserTwo, sampleUserThree]);
 var UserListView = Backbone.View.extend({
     render: function() {
         console.log("Total Users : " + userCollection.length);
         var template = _.template($("#user-list-template").html(), {
             users: userCollection.models
         });
         this.$el.html(template); // template
         return this;
     }
 });
 var UserEditView = Backbone.View.extend({
     initialize: function() {
         this.$el.off('submit');
     },
     render: function(options) {
         // this.el=options.el;
         if (options && options.id) {
             var template = _.template($("#user-edit-template").html(), {
                 user: userCollection.get(options.id)
             });
             this.$el.html(template);
         } else {
             // console.log("Correct Place ");
             // console.log(this.$el);
             var template = _.template($("#user-edit-template").html(), {
                 user: null
             });
             // console.log(template);
             this.$el.html(template);
         }
         return this;
     },
     events: {
         "submit .form": "submitHandler"
     },
     submitHandler: function(event) {
         var ser = this.$el.find(".form").serializeObject();
         // console.log(ser);
         var user = new UserModel(ser);
         console.log(user.toJSON());
         userCollection.add(user,{merge:true});     //This will take care if user.id exists or not & save/update accordingly
         // userCollection.add(user);

         if(user.get('id')===undefined || user.get('id')===''){
            console.log("Setting id for a new one");
             user.set({
                 id: userCollection.length + 1
             });
         }
         console.log(userCollection.length);
         // user.save(ser)
         Backbone.history.navigate('', true); //triggering the view, which is disabled by default
         return false; //Prevent form submission
     }
 });
 var Router = Backbone.Router.extend({
     routes: {
         '': 'home',
         'new': 'editUser',
         'edit/:id': 'editUser'
     },
     home: function() {
         console.log("show home view");
         var userListView = new UserListView({
             el: '.content'
         });
         userListView.render();
     }
 })
 var router = new Router();
 router.on('route:editUser', function(id) {
     console.log("Show edit user view : " + id);
     var userEditView = new UserEditView({
         el: '.content'
     });
     userEditView.render({
         id: id
     });
 });
 Backbone.history.start();