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
