/* global Reveal, hljs */
import Ember from 'ember';
import layout from './template';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';
import { EKMixin, keyUp } from 'ember-keyboard';

const { computed, get, set, observer, isBlank, isPresent, on } = Ember;

export default EmberWormhole.extend(EKMixin, {
  layout,
  keyboard: Ember.inject.service(),

  emberRevealJs: Ember.inject.service(),
  isSpeakerNotes: computed.alias('emberRevealJs.isSpeakerNotes'),
  isMainWindow: computed.not('isSpeakerNotes'),
  isPrintingPdf: computed.alias('emberRevealJs.printPdf'),
  presentationWidth: computed.alias('emberRevealJs.presentationWidth'),
  presentationHeight: computed.alias('emberRevealJs.presentationHeight'),
  // presentation-class - passed in

  transition: 'slide', // none|fade|slide|convex|concave|zoom
  backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom
  progress: true,
  controls: computed.alias('emberRevealJs.controls'),
  center: true,
  // theme - passed in
  themePreference: computed.alias('emberRevealJs.themePreference'),
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

  launchSpeakerNotes: on(keyUp('s'), function() {
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
    Ember.subscribe('emberRevealJs.message', {
      before() {},
      after(name, timestamp, payload) {
        self._syncRevealState(payload);
      }
    });
    this._setRevealState();
    window.RevealMarkdown.convertSlides();
    hljs.initHighlightingOnLoad();
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
    Ember.instrument('emberRevealJs.message', event);
  },

  _revealOverviewShown(event) {
    event.overview = true;
    Ember.instrument('emberRevealJs.message', event);
  },

  _revealOverviewHidden(event) {
    event.overview = false;
    Ember.instrument('emberRevealJs.message', event);
  },

  _revealPaused(event) {
    event.paused = true;
    Ember.instrument('emberRevealJs.message', event);
  },

  _revealResumed(event) {
    event.paused = false;
    Ember.instrument('emberRevealJs.message', event);
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
