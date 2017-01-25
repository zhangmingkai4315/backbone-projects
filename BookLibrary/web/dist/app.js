(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Book = require("../models/Book");

module.exports = Backbone.Collection.extend({
    model: Book
});
},{"../models/Book":3}],2:[function(require,module,exports){
// global.app = app || {}
var LibraryView = require('./views/LibraryView');

var books = [{
        title: 'Javascript Program',
        author: 'Douglas',
        keywords: 'javascript'
    },
    {
        title: 'Go Program',
        author: 'Alice',
        keywords: 'go'
    },
    {
        title: 'Java Program',
        author: 'Mike',
        keywords: 'java'
    },
    {
        title: 'Python Program',
        author: 'Jone',
        keywords: 'python'
    },
    {
        title: 'c++ Program',
        author: 'Cello',
        keywords: 'c++'
    },
        {
        title: 'Python Program2',
        author: 'Jone2',
        keywords: 'python'
    },
    {
        title: 'c++ Program2',
        author: 'Cello2',
        keywords: 'c++'
    },
]

new LibraryView(books);
},{"./views/LibraryView":5}],3:[function(require,module,exports){
var Book = Backbone.Model.extend({
    defaults: {
        'cover_image': 'img/placeholder.png',
        'title': '暂无标题',
        'author': '暂无作者信息',
        'keywords': "暂无关键词"
    }
});

module.exports = Book;
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

var BookView = require('./BookView');
var Book = require('../models/Book');
var Library = require('../collections/Library')
var LibraryView = Backbone.View.extend({
    el:'#books',
    initialize:function(initialBooks){
        this.collection = new Library(initialBooks);
        this.render();

        this.listenTo(this.collection,'add',this.renderBook);
    },
    events:{
        'click #add-book-button':'addBookHandler'
    },
    addBookHandler:function(e){
        e.preventDefault();
        var formData = {}
        $('#add-book div').children('input').each(function(i,el){
            if ($(el).val()!=''){
                formData[el.id]=$(el).val();
            }
        });
        console.log(formData);
        this.collection.add(new Book(formData));
    },
    render:function(){
        this.collection.each(function(item){
            this.renderBook(item);
        },this);
    },
    renderBook:function(item){
        var bookView = new BookView({
            model:item
        });
        this.$el.append(bookView.render().el);
    }
});

module.exports = LibraryView;
},{"../collections/Library":1,"../models/Book":3,"./BookView":4}]},{},[2])