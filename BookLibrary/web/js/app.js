// global.app = app || {}
var LibraryView = require('./views/LibraryView');

$(function(){
    console.log("debug")
    $('#release-date').datepicker();
    new LibraryView(books);
});