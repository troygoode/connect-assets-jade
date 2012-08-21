//#=require_tree templates

var products = document.getElementById('products');
var html = JadeTemplates['templates/product']({
    name: '... and this one is rendered by the browser.'
  , price: '1.99'
});
products.innerHTML += html;
