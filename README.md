# connect-assets-jade

Expose your jade views in the browser using connect-assets.

## Installation

```bash
$ npm install connect-assets-jade
```

## Usage

See example app in `/example` directory.

Integration with [`connect-assets`](https://github.com/TrevorBurnham/connect-assets/) is done like so:

```javascript
var express = require('express')
  , assets = require('connect-assets')
  , jadeAssets = require('../') // <-- here
  , PORT = 3000;

var app = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});

  app.use(assets({
    jsCompilers: jadeAssets() // <-- and here
  }));

  app.use(app.router);
});

app.get('/', function(req, res){
  res.render('home');
});

app.listen(PORT, function(){
  console.log('Example app for connect-assets-jade running on port %d.', PORT);
});
```

## Credits

* [Trevor Power](http://trevorpower.com/) for identifying [how to use `connect-assets'` `jsCompilers` configuration option](http://trevorpower.com/blog/server-side-compiling-of-jade-templates-with-connect-assets).
* [Mike Ball](https://twitter.com/onkis) for pointing me in the direction of this approach.

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))