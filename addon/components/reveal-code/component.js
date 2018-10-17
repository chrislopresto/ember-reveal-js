import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  emberRevealJs: service(),
  // codeTheme - passed in
  // language - passed in
  codeThemePreference: alias('emberRevealJs.codeThemePreference'),
  computedCodeTheme: computed('codeTheme', 'codeThemePreference', function() {
    return get(this, 'codeThemePreference') || get(this, 'codeTheme') || 'hybrid';
  })

});
