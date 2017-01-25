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