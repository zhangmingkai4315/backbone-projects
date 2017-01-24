(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var Todo = require("../models/todo")

var TodoList =Backbone.Collection.extend({
    model:Todo,
    localStorage: new Backbone.LocalStorage("todos-backbone"),
    completed:function(){
        return this.filter(function(todo){
            return todo.get("completed")
        });
    },
    remaining:function(){
        return this.without.apply(this,this.completed())
    },
    nextOrder:function(){
        if( !this.length ){
            return 1;
        }else{
            return this.last().get('order')+1
        }
    },
    comparator:function(todo){
        return todo.get('order');
    }
});

module.exports = TodoList;
},{"../models/todo":3}],2:[function(require,module,exports){
(function (global){
var TodoList =  require("./collections/todos");
var AppView = require("./views/app");
var Router = require("./routers/router");
global.app = global.app||{}
var todos = new TodoList();
app.Todos = todos
app.TodoRouter = new Router();
Backbone.history.start();

new AppView();
// console.log(todos)
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./collections/todos":1,"./routers/router":4,"./views/app":5}],3:[function(require,module,exports){
'use strict'

var Todo =Backbone.Model.extend({
    defaults:{
        title:'',
        completed:false
    },
    toggle :function(){
        this.save({
            completed:!this.get('completed')
        });
    }
});

module.exports = Todo;

},{}],4:[function(require,module,exports){
var WorkSpace = Backbone.Router.extend({
    routes:{
        "*filter":"setFilter"
    },
    setFilter:function(param){
        window.app.TodoFilter = param || '';
        window.app.Todos.trigger('filter');
    }
});

module.exports = WorkSpace 
},{}],5:[function(require,module,exports){
var ENTER_KEY = 13;
var TodoView = require('./todos.js')
var AppView = Backbone.View.extend({
    el: "#todoapp",
    statsTemplate: _.template($("#stats-template").html()),


    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete',
    },
    initialize: function () {
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$("#new-todo");
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);


        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);

        app.Todos.fetch({reset: true})
    },
    addOne: function (todo) {
        var view = new TodoView({
            model: todo
        });
        $('#todo-list').append(view.render().el);
    },
    addAll: function () {
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    render: function () {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if (app.Todos.length) {
            this.$main.show();
            this.$footer.show();
            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + (app.TodoFilter || '') + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }
        this.allCheckbox.checked = !remaining;
    },

    filterOne: function (todo) {
        todo.trigger('visible');
    },
    filterAll: function () {
        console.log('filter event...')
        app.Todos.each(this.filterOne, this)
    },
    newAttributes: function () {
        return {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };
    },
    createOnEnter: function (event) {
        console.log(event.which)
        if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
            return;
        }
        app.Todos.create(this.newAttributes());
        this.$input.val("");
    },
    clearCompleted: function () {
        console.log("clear all")
        console.log(app.Todos.completed())
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    toggleAllComplete: function () {
        var completed = this.allCheckbox.checked;
        app.Todos.each(function (todo) {
            todo.save({
                'completed': completed
            });
        });
    },


})

module.exports = AppView;
},{"./todos.js":6}],6:[function(require,module,exports){
var ENTER_KEY = 13;
var ESC_KEY = 27;
var TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($("#item-template").html()),
    events: {
        'click .toggle': 'toggleCompleted',
        'dbclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'keydown .edit': 'revertOnEscape',
        'click .destroy': 'clear',
        'blur .edit': 'close'
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },
    isHidden: function () {
        return this.model.get('completed') ?
            app.TodoFilter === 'active' :
            app.TodoFilter === 'completed';
    },
    toggleCompleted: function () {
        this.model.toggle();
    },
    toggleVisible: function () {
        this.$el.toggleClass('hidden', this.isHidden());
    },

    render: function () {
        if (this.model.changed.id !== undefined) {
            return;
        }
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('completed'));
        this.toggleVisible();
        this.$input = this.$('.edit')
        return this
    },
    edit: function () {
        this.$el.addClass('editing');
        this.$input.focus();
    },
    // Remove the item, destroy the model from *localStorage* and delete its view.
    clear: function () {
        this.model.destroy();
    },
    close: function () {
        var value = this.$input.val().trim();
        if (value) {
            this.model.save({
                title: value
            });
        }
        this.$el.removeClass('editing');
    },
    updateOnEnter: function (e) {
        if (e.which === ENTER_KEY) {
            this.close();
        }
    },
    revertOnEscape: function (e) {
        if (e.which === ESC_KEY) {
            this.$el.removeClass('editing');
            this.$input.val(this.model.get('title'));
        }
    },
});

module.exports = TodoView;
},{}]},{},[2])