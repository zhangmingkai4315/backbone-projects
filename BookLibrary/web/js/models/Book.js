var Book = Backbone.Model.extend({
    defaults: {
        'cover_image': 'img/placeholder.png',
        'title': '暂无标题',
        'author': '暂无作者信息',
        'keywords': "暂无关键词"
    }
});

module.exports = Book;