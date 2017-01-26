var BookView = require('./BookView');
var Book = require('../models/Book');
var BookDetailView = require('../views/BookDetailView');
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
        this.$bookdetail = this.$("#books-detail");
        this.render();
        this.listenTo(this.collection, 'add', this.renderBook);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'detail', this.renderDetail);
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
                } else if(el.id==='cover-image-file-path'){
                    formData['cover_image']=$(el).val()
                } else if(el.id==='upload-file-path'){
                    formData['upload_file_path']=$(el).val()
                }else if(el.id==='title'||el.id==='author'){
                    formData[el.id] = $(el).val();
                }
            }
        });
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
        app.collection = this.collection
        this.collection.each(function (item) {
            this.renderBook(item);
        }, this);
    },

    renderDetail: function (id) {
        var item = app.collection.get(id)
        if(typeof item === 'undefined'){
            return
        }else{
           this.$booklist.hide()
           var detail_element = new BookDetailView({
               model:item
           });
           this.$bookdetail.append(detail_element.render().el); 
        }
    },
    renderBook: function (item) {
        var bookView = new BookView({
            model: item
        });
        this.$booklist.append(bookView.render().el);
    }
});

module.exports = LibraryView;