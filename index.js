/* jshint node: true */
'use strict';

var path = require('path');
var fs = require('fs');
var Funnel = require('broccoli-funnel');
var unwatchedTree  = require('broccoli-unwatched-tree');
var mergeTrees = require('broccoli-merge-trees');
var replace = require('broccoli-string-replace');
var stew = require('broccoli-stew');

module.exports = {
  name: 'ember-reveal-js',

  included: function(app/*, parentAddon*/) {
    this._super.included(app);
    if (app.import) {
      this.importNpmDependencies(app);
    }
  },

  importNpmDependencies: function(app/*, parentAddon*/) {
    app.import('vendor/reveal.js/js/reveal.js');
    app.import('vendor/reveal.js/lib/js/classList.js');
    app.import('vendor/reveal.js/plugin/markdown/marked.js');
    app.import('vendor/reveal.js/plugin/markdown/markdown.js');
    app.import('vendor/reveal.js/plugin/highlight/highlight.js');
  },

  treeForVendor: function() {
    return new Funnel(unwatchedTree(path.dirname(require.resolve('reveal.js/package.json'))), {
      srcDir: '/',
      destDir: '/reveal.js',
      files: [
        'js/reveal.js',
        'lib/js/classList.js',
        'plugin/markdown/marked.js',
        'plugin/markdown/markdown.js',
        'plugin/highlight/highlight.js'
      ]
    });
  },

  treeForStyles: function(tree) {
    tree = this._super.treeForStyles.apply(this, [tree]);

    var addonThemesDir = 'app/styles/ember-reveal-js/css/theme/source';
    var addonThemeFiles = fs.readdirSync(addonThemesDir);

    var addonThemes = Array.prototype.map.call(addonThemeFiles, function(addonTheme) {
      return addonTheme.split('.')[0];
    });

    addonThemes.push('ember');

    var addonThemesScss = Array.prototype.map.call(addonThemes, function(addonTheme) {
      return '$themeName: \'' + addonTheme + '\';\n' +
        '@import \'css/theme/source/' + addonTheme + '\';\n\n';
    }).join('');
    addonThemesScss = '\n/* BEGIN ember-reveal-js-addon-themes */\n' + addonThemesScss;
    addonThemesScss += '/* END ember-reveal-js-addon-themes */\n';

    var stylesTree = replace(tree, {
      files: [
        'app/styles/ember-reveal-js/ember-reveal-js-themes.scss'
      ],
      pattern: {
        match: /\/\*__ember-reveal-js-addon-themes__\*\//g,
        replacement: addonThemesScss
      }
    });

    var revealCssTree = new Funnel(unwatchedTree(path.dirname(require.resolve('reveal.js/package.json'))), {
      srcDir: '/css',
      destDir: '/app/styles/ember-reveal-js/css',
      include: [
        'reveal.scss',
        'theme/**/*.scss'
      ]
    });

    var replaceCssTree = replace(revealCssTree, {
      files: [
        'app/styles/ember-reveal-js/css/theme/template/theme.scss',
        'app/styles/ember-reveal-js/css/theme/source/*.scss'
      ],
      patterns: [
        {
          match: /\.reveal/g,
          replacement: '.#{$themeName}.reveal'
        },
        {
          match: /body \{/g,
          replacement: '.#{$themeName}.reveal {'
        },
        {
          match: /\.\.\/\.\.\/lib\/font/g,
          replacement: 'ember-reveal-js/lib/font'
        }
      ]
    });

    replaceCssTree = replace(replaceCssTree, {
      files: [
        'app/styles/ember-reveal-js/css/reveal.scss'
      ],
      patterns: [
        {
          match: /html, body,/g,
          replacement: 'html.reveal, body.reveal,'
        }
      ]
    });

    var revealPrintCssTree = new Funnel(unwatchedTree(path.dirname(require.resolve('reveal.js/package.json'))), {
      srcDir: '/css/print',
      destDir: '/app/styles/ember-reveal-js/css/print'
    });
    revealPrintCssTree = stew.rename(revealPrintCssTree, '.css', '.scss');

    var fontCssTree = new Funnel(unwatchedTree(path.dirname(require.resolve('reveal.js/package.json'))), {
      srcDir: '/lib/font',
      destDir: '/app/styles/ember-reveal-js/lib/font',
      files: [
        'league-gothic/league-gothic.css',
        'source-sans-pro/source-sans-pro.css'
      ]
    });

    var highlightJsTree = new Funnel(unwatchedTree(path.dirname(require.resolve('highlight.js/package.json'))), {
      srcDir: '/styles',
      destDir: '/app/styles/ember-reveal-js/highlight.js'
    });
    highlightJsTree = stew.rename(highlightJsTree, '.css', '.scss');

    return mergeTrees([
        stylesTree,
        replaceCssTree,
        fontCssTree,
        revealPrintCssTree,
        highlightJsTree
      ], {
        overwrite: true
      }
    );
  },

  treeForPublic: function() {
    var assetsPath = path.join(__dirname, 'public');
    var assetsTree = new Funnel(this.treeGenerator(assetsPath), {
      srcDir: '/',
      destDir: '/assets/ember-reveal-js'
    });
    var fontTree = new Funnel(unwatchedTree(path.dirname(require.resolve('reveal.js/package.json'))), {
      srcDir: '/lib/font',
      destDir: '/assets/ember-reveal-js/lib/font'
    });
    var pluginTree = new Funnel(unwatchedTree(path.dirname(require.resolve('reveal.js/package.json'))), {
      srcDir: '/plugin',
      destDir: '/assets/ember-reveal-js/plugin'
    });
    var classListTree = new Funnel(unwatchedTree(path.dirname(require.resolve('highlight.js/package.json'))), {
      srcDir: '/lib/js',
      destDir: '/assets/ember-reveal-js/lib/js'
    });
    return mergeTrees([
      fontTree,
      pluginTree,
      classListTree,
      assetsTree
    ]);
  },

  isDevelopingAddon: function() {
    return true;
  }
};
