/* global Reveal, hljs */
import { alias, not } from '@ember/object/computed';

import { inject as service } from '@ember/service';
import { observer, set, get, computed } from '@ember/object';
import { isPresent, isBlank } from '@ember/utils';
import { on } from '@ember/object/evented';
import layout from './template';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';
import { instrument, subscribe } from '@ember/instrumentation';

import { EKMixin, keyUp } from 'ember-keyboard';

export default EmberWormhole.extend(EKMixin, {
  layout,
  keyboard: service(),

  emberRevealJs: service(),
  isSpeakerNotes: alias('emberRevealJs.isSpeakerNotes'),
  isMainWindow: not('isSpeakerNotes'),
  isPrintingPdf: alias('emberRevealJs.printPdf'),
  presentationWidth: alias('emberRevealJs.presentationWidth'),
  presentationHeight: alias('emberRevealJs.presentationHeight'),
  // presentation-class - passed in

  transition: 'slide', // none|fade|slide|convex|concave|zoom
  backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom
  progress: true,
  controls: alias('emberRevealJs.controls'),
  center: true,
  // theme - passed in
  themePreference: alias('emberRevealJs.themePreference'),
  computedTheme: computed('theme', 'themePreference', function() {
    return get(this, 'themePreference') || get(this, 'theme') || 'black';
  }),

  // Specify ember-wormhole destinationElement of body to escape the
  // application view element, as reveal.js requires 100% height and width
  destinationElement: computed(function() {
    if (typeof document !== 'undefined') {
      return document.body;
    }
  }),

  didInsertElement() {
    this._super();
    this._initializeReveal();
    this.set('keyboardActivated', true);
  },

  speakerNotesUrl() {
    let ss = 'r=true';
    let s = location.search;
    let qs = isBlank(s) ? `?${ss}` : `${s}&${ss}`;
    return ['//', location.host, location.pathname, qs].join('');
  },

  launchSpeakerNotes: on(keyUp('KeyS'), function() {
    if (get(this, 'isSpeakerNotes')) {
      return;
    }
    window.open(this.speakerNotesUrl(), 'reveal.js - Notes', 'width=1100,height=700');
  }),

  _initializeReveal() {
    if (get(this, 'isSpeakerNotes')) {
      return;
    }
    Reveal.initialize(this._revealOptions());
    Reveal.addEventListener('slidechanged', this._revealSlideChanged);
    Reveal.addEventListener('overviewshown', this._revealOverviewShown);
    Reveal.addEventListener('overviewhidden', this._revealOverviewHidden);
    Reveal.addEventListener('paused', this._revealPaused);
    Reveal.addEventListener('resumed', this._revealResumed);
    let self = this;
    subscribe('emberRevealJs.message', {
      before() {},
      after(name, timestamp, payload) {
        self._syncRevealState(payload);
      }
    });
    this._setRevealState();
    window.RevealMarkdown.convertSlides();
    // hljs.initHighlightingOnLoad();
  },

  presentationStateDidChange: observer(
    'emberRevealJs.presentationState',
    function() {
      this._setRevealState();
    }
  ),

  _revealOptions() {
    let revealOptions = {
      history: false, // Don't interfere with Ember's routing
      transition: get(this, 'transition'),
      backgroundTransition: get(this, 'backgroundTransition'),
      progress: get(this, 'progress'),
      controls: get(this, 'controls'),
      center: get(this, 'center')
    };
    if (get(this, 'presentationWidth')) {
      revealOptions.width = get(this, 'presentationWidth');
    }
    if (get(this, 'presentationHeight')) {
      revealOptions.height = get(this, 'presentationHeight');
    }
    return revealOptions;
  },

  _revealSlideChanged(event) {
    instrument('emberRevealJs.message', event);
  },

  _revealOverviewShown(event) {
    event.overview = true;
    instrument('emberRevealJs.message', event);
  },

  _revealOverviewHidden(event) {
    event.overview = false;
    instrument('emberRevealJs.message', event);
  },

  _revealPaused(event) {
    event.paused = true;
    instrument('emberRevealJs.message', event);
  },

  _revealResumed(event) {
    event.paused = false;
    instrument('emberRevealJs.message', event);
  },

  _syncRevealState(state) {
    set(this, 'emberRevealJs.indexh', state.indexh);
    set(this, 'emberRevealJs.indexv', state.indexv);
    if (isPresent(state.paused)) {
      set(this, 'emberRevealJs.paused', !!state.paused);
    }
    if (isPresent(state.overview)) {
      set(this, 'emberRevealJs.overview', !!state.overview);
    }
  },

  _setRevealState() {
    let state = get(this, 'emberRevealJs.presentationState');
    if (state) {
      Reveal.setState(state);
    }
  }
});
