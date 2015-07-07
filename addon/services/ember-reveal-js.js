import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Service.extend({
  indexh: null,
  indexv: null,
  paused: false,
  overview: false,
  controls: true,
  presentationState: computed(
    'indexh',
    'indexv',
    'paused',
    'overview',
    function() {
      return {
        indexh: get(this, 'indexh'),
        indexv: get(this, 'indexv'),
        paused: get(this, 'paused'),
        overview: get(this, 'overview')
      };
    }
  ),
  isSpeakerNotes: false
});
