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