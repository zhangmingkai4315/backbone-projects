var BookView = require('./BookView');
var Book = require('../models/Book');
var Library = require('../collections/Library')
var LibraryView = Backbone.View.extend({
    el: '#books',
    initialize: function (initialBooks) {
        // this.collection = new Library(initialBooks);
        this.collection = new Library();
        this.collection.fetch({
            reset: true
        });
        this.$booklist = this.$("#books-list");
        this.render();
        this.listenTo(this.collection, 'add', this.renderBook);
        this.listenTo(this.collection, 'reset', this.render);
    },
    events: {
        'click #add-book-button': 'addBookHandler'
    },
    addBookHandler: function (e) {
        e.preventDefault();
        var formData = {}
        $('#add-book div').children('input').each(function (i, el) {
            if ($(el).val() != '') {
                if (el.id === 'keywords') {
                    formData[el.id] = [];
                    _.each($(el).val().split(','), function (key) {
                        formData[el.id].push(key);
                    })
                } else if (el.id === 'release-date') {
                    formData["release_date"] = $('#release-date').datepicker('getDate').getTime();
                } else {
                    formData[el.id] = $(el).val();
                }
            }
        });
        // console.log(formData);
        // this.collection.add(new Book(formData));
        this.collection.create(formData,{
            // 不去触发add事件，后期手动发送
           silent:true,
           wait:true,
           success:function(model,resp,options){
               console.log("create success");
            //    console.log(data,resp);
               options.collection.trigger("add",model);
            //    
           },
           error:function(err){
               console.log("Got error")
           },
           collection:this.collection
        });
    },
    render: function () {
        this.collection.each(function (item) {
            this.renderBook(item);
        }, this);
    },
    renderBook: function (item) {
        var bookView = new BookView({
            model: item
        });
        this.$booklist.append(bookView.render().el);
    }
});

module.exports = LibraryView;