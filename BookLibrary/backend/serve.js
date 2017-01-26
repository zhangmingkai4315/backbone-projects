const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const application_root = __dirname
const routes = require('./routes/index');
const apiroutes = require('./routes/api');
const app = express()
const public_path = path.join(application_root, '../web');


const BookModel = require('./model/book');
mongoose.connect('mongodb://localhost/booklibrary');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(busboyBodyParser());
app.use(cookieParser());
app.use(express.static(public_path))

app.use('/', routes);
app.use('/api', apiroutes);

const port = 4700;
app.listen(port, () => {
    console.log("Serve file root is setted to %s", public_path)
    console.log("Express server is listen on port:%d [ %s ]", port, app.settings.env);
})