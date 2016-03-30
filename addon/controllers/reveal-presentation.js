import Ember from 'ember';

const { computed, inject } = Ember;

export default Ember.Controller.extend({
  emberRevealJs: inject.service(),

  queryParams: ['h', 'v', 'r', 'p', 'o', 'c', 't', 'ct', 'pw', 'ph', 'print-pdf'],
  h: computed.alias('emberRevealJs.indexh'),
  v: computed.alias('emberRevealJs.indexv'),
  r: computed.alias('emberRevealJs.isSpeakerNotes'),
  p: computed.alias('emberRevealJs.paused'),
  o: computed.alias('emberRevealJs.overview'),
  c: computed.alias('emberRevealJs.controls'),
  t: computed.alias('emberRevealJs.themePreference'),
  ct: computed.alias('emberRevealJs.codeThemePreference'),
  pw: computed.alias('emberRevealJs.presentationWidth'),
  ph: computed.alias('emberRevealJs.presentationHeight'),
  'print-pdf': computed.alias('emberRevealJs.printPdf')
});
