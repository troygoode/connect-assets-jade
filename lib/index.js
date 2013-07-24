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

        // overwrite templateName if function is provided
        //  - this is useful if you store all of your templates in /assets/js/templates,
        //  - and want templates named "foo" and "bar" instead of "templates/foo" and
        //  - "templates/bar"
        if(options.modifyTemplateName) {
          templateName = options.modifyTemplateName(templateName);
        }

        // get template function
        var filename = path.basename(sourcePath, '.jade');
        var js = jade.compile(source, {
            client: true
          , compileDebug: options.debug
          , filename: sourcePath
        }).toString();

        // needed for jade runtime
        var nulls = "function nulls(val){ return val != null && val !== ''; }";
        var joinClasses = "function joinClasses(val){ return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val; }";
        var attrs = jade.runtime.attrs.toString();
        var escape = jade.runtime.escape.toString();
        var rethrow = jade.runtime.rethrow.toString();
        var merge = jade.runtime.merge.toString();
        var runtime = (nulls + joinClasses + escape + attrs + rethrow + merge).replace(/exports\./g, '');
        var jadeObj = "var jade = {attrs:attrs, escape:escape, interp:null};";

        // needed to make things work...
        js = 'if(window.' + options.templatesArray + ' === undefined){window.' + options.templatesArray + '={};}\n' + js;
        js = js.replace('function anonymous', options.templatesArray + '[\'' + templateName + '\'] = function');
        js = js.replace(/buf = \[\];/, 'buf = [];' + runtime + jadeObj + '\n'); // make the runtime functions available
        js = js.replace(/^attrs.*$/gm, ''); // attrs line references "jade" object that doesn't exist
        js = js + ';'; // without this, file concatenations cause this js to be called as a function on load under certain circumstances

        return js;
    }
  };
};
