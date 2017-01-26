var BookDetailView = Backbone.View.extend({
    el: 'div',
    className:'bookDetail',
    template:_.template($('#book-detail-template').html()),
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

module.exports = BookDetailView;