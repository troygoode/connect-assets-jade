var express = require('express')
  , assets = require('connect-assets')
  , jadeAssets = require('../')
  , PORT = 3000;

var app = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});

  app.use(assets({
    jsCompilers: {jade: jadeAssets()}
  }));

  app.use(app.router);
});

app.get('/', function(req, res){
  res.render('home');
});

app.listen(PORT, function(){
  console.log('Example app for connect-assets-jade running on port %d.', PORT);
});
