import Ember from 'ember';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';

const { inject, computed } = Ember;

export default EmberWormhole.extend({
  emberRevealJs: inject.service(),
  // h - passed in
  // v - passed in

  matchesPresentationState: computed('emberRevealJs.indexh', 'emberRevealJs.indexv',
    function() {
      let indexh = `${this.get('emberRevealJs.indexh')}`;
      let indexv = `${this.get('emberRevealJs.indexv')}`;
      let h = this.get('h');
      let v = this.get('v');
      let match = true;
      if (h &&  (h !== indexh)) {
        match = false;
      }
      if (v && (v !== indexv)) {
        match = false;
      }
      return match;
    }),
  renderInPlace: computed.not('matchesPresentationState')
});
