var should = require('should')
  , supertest = require('supertest')
  , app = require('../example/app');

describe('connect-assets-jade', function(){
  it('can be require_tree\'d in', function(done){
    supertest(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        done();
      });
  });

  it('outputs template script', function(done){
    supertest(app)
      .get('/js/templates/product.js')
      .expect(200)
      .end(function(err, res){
        var text = res.text;
        text.should.match(/^if\(window\.JadeTemplates/);
        text.should.match(/JadeTemplates\[\'templates\/product\'\]/);
        done();
      });
  });
});
