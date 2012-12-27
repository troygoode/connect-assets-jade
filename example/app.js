var express = require('express')
  , assets = require('connect-assets')
  , jadeAssets = require('../')
  , path = require('path')
  , PORT = 3000;

var app = module.exports = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});

  app.use(assets({
      jsCompilers: {jade: jadeAssets()}
    , src: path.join(__dirname, 'assets') // only necessary because of the way I'm unit testing this
  }));

  app.use(app.router);
});

app.get('/', function(req, res){
  res.render('home');
});

app.helpers({
  pathToJs: 'app'
});

if(!module.parent){
  app.listen(PORT, function(){
    console.log('Example app for connect-assets-jade running on port %d.', PORT);
  });
}
