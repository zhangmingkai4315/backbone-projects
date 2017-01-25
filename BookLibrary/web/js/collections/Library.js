var Book = require("../models/Book");

var Library = Backbone.Collection.extend({
    model: Book,
    url: '/api/books'
});

module.exports = Library;