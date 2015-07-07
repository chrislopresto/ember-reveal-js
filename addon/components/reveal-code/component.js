import Ember from 'ember';
import layout from './template';

const { computed, get } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: '',

  emberRevealJs: Ember.inject.service(),
  // codeTheme - passed in
  // language - passed in
  codeThemePreference: computed.alias('emberRevealJs.codeThemePreference'),
  computedCodeTheme: computed('codeTheme', 'codeThemePreference', function() {
    return get(this, 'codeThemePreference') || get(this, 'codeTheme') || 'hybrid';
  })

});
