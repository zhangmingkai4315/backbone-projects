var BookView = Backbone.View.extend({
    tagName:'div',
    className:'bookContainer',
    template:_.template($('#book-template').html()),
    events:{
        'click #delete-book-button':'deleteBookHandler',
    },
    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    deleteBookHandler:function(){
        this.model.destroy();
        this.remove();
    }
});

module.exports = BookView;
