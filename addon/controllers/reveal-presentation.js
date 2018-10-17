import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  emberRevealJs: service(),

  queryParams: ['h', 'v', 'r', 'p', 'o', 'c', 't', 'ct', 'pw', 'ph', 'print-pdf'],
  h: alias('emberRevealJs.indexh'),
  v: alias('emberRevealJs.indexv'),
  r: alias('emberRevealJs.isSpeakerNotes'),
  p: alias('emberRevealJs.paused'),
  o: alias('emberRevealJs.overview'),
  c: alias('emberRevealJs.controls'),
  t: alias('emberRevealJs.themePreference'),
  ct: alias('emberRevealJs.codeThemePreference'),
  pw: alias('emberRevealJs.presentationWidth'),
  ph: alias('emberRevealJs.presentationHeight'),
  'print-pdf': alias('emberRevealJs.printPdf')
});
