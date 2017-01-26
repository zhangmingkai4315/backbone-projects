var BookDetailView = require('../views/BookDetailView');

var AppRoute = Backbone.Router.extend({
  routes:{

    "help":"helpHandler",//#help
    "books/:id":"detailHandler", //#books/:id
    "search/:name":"searchHandler",
    "tags":"showTagsHandler",
   },
   defaultHandler:function(){
       window.app.collection.trigger('reset')
   },
   helpHandler:function(){
       console.log("help page");
   },
   detailHandler:function(id){
       window.app.collection.trigger('detail',id)
   },
   searchHandler:function(){
       console.log("search page");
   },
   showTagsHandler:function(){
        console.log("showTags page");
   }
}
);

module.exports=AppRoute;

