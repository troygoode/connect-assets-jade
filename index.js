var jade = require('jade')
  , path = require('path');

module.exports = function(){
  return {
    jade: {
        match: /\.js$/
      , compileSync: function(sourcePath, source){
          var templatesArray = 'JadeTemplates';

          // create a name to store this as for retrieval in client script
          var templateName = sourcePath.replace(/^.*\/assets\/js\//, '');
          templateName = templateName.slice(0, -5);

          // get template function
          var filename = path.basename(sourcePath, '.jade');
          var compiled = jade.compile(source, {
              client: true
            , filename: sourcePath
          }).toString();

          // rename function
          var js = compiled;

          // needed to make things work...
          js = 'if(' + templatesArray + ' === undefined){var ' + templatesArray + '={};}\n' + js;
          js = js.replace('function anonymous', templatesArray + '[\'' + templateName + '\'] = function');
          js = js.replace(/buf = \[\];/, 'buf = [];\nvar escape = function(str){return str.replace(/\'/g, "\\\\\'");};'); // make the 'escape' function available
          js = js.replace(/^attrs.*$/gm, ''); // attrs line references "jade" object that doesn't exist

          // remove debug statements and format code nicely
          js = js.replace(/^var __jade.*$/gm, ''); // get rid of __jade debug object
          js = js.replace(/^try.*$/gm, ''); // get rid of outer try block
          js = js.replace(/^__jade\..*$\n/gm, ''); // git rid of debug statements
          js = js.replace(/\n{2,}/g, ''); // get rid of blank lines
          js = js.replace('{var buf', '{\nvar buf'); // the above line is slight greedier than I want it
          js = js.substring(0, js.indexOf('} catch')) + '};'; // get rid of catch block, since there is no try
          return js;
      }
    }
  };
};
