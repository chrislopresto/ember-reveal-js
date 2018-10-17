'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var stew = require('broccoli-stew');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    hinting: false
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  var appTree = app.toTree();
  appTree = stew.mv(appTree, 'ember-reveal-js/*', 'assets/ember-reveal-js/');

  return appTree;
};
