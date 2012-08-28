var _ = require('underscore')
  , jade = require('jade')
  , path = require('path')
  , defaults = {
      templatesArray: 'JadeTemplates'
    , templateNamePattern: /^.*\/assets\/js\/(.+)\.jade/
    , debug: false
  };

module.exports = function(options){
  var options = _.defaults(options || {}, defaults);
  return {
      match: /\.js$/
    , compileSync: function(sourcePath, source){
        // create a name to store this as for retrieval in client script
        var match = sourcePath.match(options.templateNamePattern);
        var templateName = match[1];

        // get template function
        var filename = path.basename(sourcePath, '.jade');
        var js = jade.compile(source, {
            client: true
          , filename: sourcePath
        }).toString();

        // needed for jade runtime
        var attrs = jade.runtime.attrs.toString();
        var escape = jade.runtime.escape.toString();
        var rethrow = jade.runtime.rethrow.toString();
        var merge = jade.runtime.merge.toString();
        var runtime = (escape + attrs + rethrow + merge).replace(/exports\./g, '');

        // needed to make things work...
        js = 'if(window.' + options.templatesArray + ' === undefined){window.' + options.templatesArray + '={};}\n' + js;
        js = js.replace('function anonymous', options.templatesArray + '[\'' + templateName + '\'] = function');
        js = js.replace(/buf = \[\];/, 'buf = [];' + runtime + '\n'); // make the runtime functions available
        js = js.replace(/^attrs.*$/gm, ''); // attrs line references "jade" object that doesn't exist

        // remove debug statements and format code nicely
        if(!options.debug){
          js = js.replace(/^var __jade.*$/gm, ''); // get rid of __jade debug object
          js = js.replace(/^try.*$/gm, ''); // get rid of outer try block
          js = js.replace(/^__jade\..*$\n/gm, ''); // git rid of debug statements
          js = js.replace(/\n{2,}/g, ''); // get rid of blank lines
          js = js.replace('{var buf', '{\nvar buf'); // the above line is slight greedier than I want it
          js = js.substring(0, js.indexOf('} catch')) + '};'; // get rid of catch block, since there is no try
        }

        return js;
    }
  };
};
