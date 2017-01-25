const mongoose  =require ('mongoose');
const Book = new mongoose.Schema({
    title:String,
    author:String,
    keywords:[String],
    cover_image:{type:String,default:'/img/placeholder.png'},
    release_date:Date,
});

const BookModel = mongoose.model('Book',Book);

module.exports = BookModel ;

