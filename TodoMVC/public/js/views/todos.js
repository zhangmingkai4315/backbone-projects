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