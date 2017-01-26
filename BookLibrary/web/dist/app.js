(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Book = require("../models/Book");

var Library = Backbone.Collection.extend({
    model: Book,
    url: '/api/books'
});

module.exports = Library;
},{"../models/Book":3}],2:[function(require,module,exports){
// global.app = app || {}
var LibraryView = require('./views/LibraryView');
var util = require('./utils/utils');
$(function(){
    console.log("debug")
    $('#release-date').datepicker();
    new LibraryView(books);
    $("#cover-image").change(function(){
        if(util.validateFile(this.files[0],10000000,/\.(jpg|png|gif)$/i)){
             util.uploadFile(this.files[0],{
                 success:function(data){
                    var path = data[0].data.path;
                    // console.log()
                    util.update_coverimage(path);
                 },
                 error:function(data){
                    var error = typeof data[0].data.error===null||"上传失败,请稍后重试";
                    // console.log(data)
                    util.update_coverimage_error(error);
                 }
             });
        }else{
            $('#cover-image-alert').removeClass().addClass('alert alert-danger').text('无法上传，格式或尺寸超出范围');
        }
    });

    $("#upload-file").change(function(){
        if(util.validateFile(this.files[0],3000000000,/\.(pdf|pptx|ppt|doc|docx|rar)$/i)){
             util.uploadFile(this.files[0],{
                 success:function(data){
                    var path = data[0].data.path;
                    // console.log()
                    util.update_book_file_success(path);
                 },
                 error:function(data){
                    var error = typeof data[0].data.error===null||"上传失败,请稍后重试";
                    // console.log(data)
                    util.update_book_file_error(error);
                 }
             });
        }else{
            $('#upload-file-alert').removeClass().addClass('alert alert-danger').text('无法上传，格式或尺寸超出范围');
        }
    });
});
},{"./utils/utils":4,"./views/LibraryView":6}],3:[function(require,module,exports){
var Book = Backbone.Model.extend({
    defaults: {
        'cover_image': 'img/placeholder.png',
        'title': '暂无标题',
        'author': '暂无作者信息',
        'keywords': "暂无关键词",
    },
    parse:function(res){
        res.id=res._id;
        return res;
    }
});

module.exports = Book;
},{}],4:[function(require,module,exports){
module.exports = {
    uploadFile: function (file,handler) {
        var formData = new FormData();
        formData.append(
            "files", file
        );
        $.ajax({
            url: '/api/upload',
            type: 'POST',
            data: formData,
            success: function () {
                handler.success([].slice.call(arguments))
            },
            error: function () {
                handler.error([].slice.call(arguments))
            },
            processData:false,
            contentType:false,
        })
    },
    validateFile: function (file, size, type) {
        console.log(file)
        var args = Array.prototype.slice.call(arguments);
        var size = 0;
        var type = /\.(jpg|png|gif)$/i
        if (args.length === 3) {
            size = args[1];
            type = args[2];
        } else if (args.length === 2) {
            size = args[1];
        } else {
            return false;
        }
        return file.size < size && type.test(file.name)
    },
    update_coverimage:function(path){
        $('#cover-image-alert').removeClass().addClass('alert alert-info').text("文件上传成功");
        $('input#cover-image-file-path').val(path);
        $('#show-cover-image').removeClass('hidden');
        $('#show-cover-image img').attr("src", path);
    },
    update_coverimage_error:function(error){
        $('#cover-image-alert').removeClass().addClass('alert alert-danger').text(error);
        $('input#cover-image-file-path').val('');
         $('#show-cover-image').addClass('hidden');
    },
    update_book_file_success:function(path){
        $('#upload-file-alert').removeClass().addClass('alert alert-info').text("文件上传成功");
        $('input#upload-file-path').val(path);
    },
    update_book_file_error:function(error){
        $('#upload-file-alert').removeClass().addClass('alert alert-danger').text(error);
        $('input#upload-file-path').val('');
    }
}
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
},{"../collections/Library":1,"../models/Book":3,"./BookView":5}]},{},[2])