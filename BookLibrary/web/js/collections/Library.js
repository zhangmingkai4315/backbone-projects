var Book = require("../models/Book");

module.exports = Backbone.Collection.extend({
    model: Book
});