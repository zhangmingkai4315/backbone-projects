const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const BookModel = require("../model/book");
const utils = require('../utils/utils');
/* GET api port. */
router.get('/', (req, res) => {
    res.send("This is a api server")
});

router.get('/books', (req, res) => {
    return BookModel.find((err, books) => {
        if (!err) {
            if (books.length === 0) {
                return res.sendStatus(404);
            }
            return res.send(books);
        } else {
            return res.sendStatus(500);
        }
    });
});


router.post('/books', (req, res) => {
    console.log(req.body)
    var title = req.body.title;
    var author = req.body.author;
    var cover_image = req.body.cover_image;
    var release_date = req.body.release_date;
    var keywords = req.body.keywords;
    var book = new BookModel({
        title,
        author,
        cover_image,
        keywords,
        release_date,
    });
    book.save((err) => {
        if (!err) {
            return res.json(book);
        } else {
            return res.sendStatus(500);
        }
    });
});


router.get('/books/:id', (req, res) => {
    return BookModel.findById(req.params.id, (err, book) => {
        if (!err) {
            if (book) {
                return res.send(book);
            } else {
                return res.sendStatus(404);
            }
        } else {
            return res.sendStatus(500);
        }
    });
});


router.put('/books/:id', (req, res) => {
    console.log('Updating book ' + req.body.title);
    return BookModel.findById(req.params.id, (err, book) => {
        book.title = req.body.title;
        book.author = req.body.author;
        book.keywords = req.body.keywords.split(',');
        return book.save(err => {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.sendStatus(200);
            }
        })
    })
});


router.delete('/books/:id', (req, res) => {
    return BookModel.findById(req.params.id, (err, book) => {
        if (!err) {
            if (book) {

                return book.remove(err=>{
                    if(err) res.send(500);
                    return res.sendStatus(200);
                })
            } else {
                return res.sendStatus(404);
            }
        } else {
            return res.sendStatus(500);
        }
    });
});

router.post("/upload",(req,res)=>{
    if(req.files&&req.files.files){
        var storeName=Date.now()+'__'+req.files.files.name;
        var newPath = path.join(__dirname+"./../../web/img/uploads/"+storeName);
        var data = req.files.files.data;
        fs.writeFile(newPath,data,function(err){
            if(err){ 
                console.log(err)
             return utils.send_json(res,null,err,500);
            }
            var storepath='/img/uploads/'+storeName;
            return utils.send_json(res,{path:storepath},null,200);
        });
    }else{
        return utils.send_json(res,null,'发送数据无法解析',400);
    }
});

module.exports = router;