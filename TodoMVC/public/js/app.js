var TodoList =  require("./collections/todos");
var AppView = require("./views/app");
var Router = require("./routers/router");
global.app = global.app||{}
var todos = new TodoList();
app.Todos = todos
app.TodoRouter = new Router();
Backbone.history.start();

new AppView();
// console.log(todos)