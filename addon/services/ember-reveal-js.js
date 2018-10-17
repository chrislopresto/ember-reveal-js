import Service from '@ember/service';
import { get, computed } from '@ember/object';

export default Service.extend({
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
