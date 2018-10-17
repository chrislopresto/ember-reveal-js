/* global marked */
import $ from 'jquery';

import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { isPresent, isBlank } from '@ember/utils';
import layout from './template';

// NOTE: This component ports source from the reveal.js speaker notes plugin and
//       therefore contains much code that is not idiomatic Ember.
export default Component.extend({
  classNames: ['reveal-speaker-notes'],
  layout,

  emberRevealJs: service(),

  didInsertElement() {
    this._super();
    this._initializeSpeakerNotes();
  },

  currentUrl: computed(function() {
    let s = location.search;
    let params = 'postMessageEvents=true';
    let qs = isBlank(s) ? `?${params}` : `${s}&${params}`;
    return ['//', location.host, location.pathname, qs].join('');
  }),

  upcomingUrl: computed(function() {
    let s = location.search;
    let params = 'controls=false';
    let qs = isBlank(s) ? `?${params}` : `${s}&${params}`;
    return ['//', location.host, location.pathname, qs].join('');
  }),

  notes: null,
  notesValue: null,
  currentState: null,
  currentSlide: null,
  upcomingSlide: null,
  connected: false,

  // jscs:disable
  _initializeSpeakerNotes() {
    let self = this;
    this.handleConnectMessage();

    window.addEventListener( 'message', function( event ) {
      var revealMessage = event && event.data && event.data.indexOf && (event.data.indexOf("reveal") > 0);
      if (!revealMessage) {
        return;
      }
      // BEGIN-MONKEYPATCH notesjs-locals
      var Reveal = self.get('currentSlide').contentWindow.Reveal;
      // END-MONKEYPATCH notesjs-locals

      // BEGIN-SNIPPET notesjs-post
      var slideElement = Reveal.getCurrentSlide(),
        notesElement = slideElement.querySelector( 'aside.notes' );

      var messageData = {
        // namespace: 'reveal-notes',
        // type: 'state',
        notes: '',
        markdown: false //,
        // state: Reveal.getState()
      };

      // Look for notes defined in a slide attribute
      if( slideElement.hasAttribute( 'data-notes' ) ) {
        messageData.notes = slideElement.getAttribute( 'data-notes' );
      }

      // Look for notes defined in an aside element
      if( notesElement ) {
        messageData.notes = notesElement.innerHTML;
        messageData.markdown = typeof notesElement.getAttribute( 'data-markdown' ) === 'string';
      }
      // END-SNIPPET notesjs-post

      // BEGIN-MONKEYPATCH handleStateMessage-locals
      var data = JSON.parse( event.data );
      data.notes = messageData.notes;
      data.markdown = messageData.markdown;
      var notes = get(self, 'notes');
      var notesValue = get(self, 'notesValue');
      var currentSlide = {
        // PATCH: Add || window to support loading slide notes view in main window
        contentWindow: window.opener || window
      };
      var upcomingSlide = get(self, 'upcomingSlide');
      // END-MONKEYPATCH handleStateMessage-locals

      // BEGIN-SNIPPET handleStateMessage
      // No need for updating the notes in case of fragment changes
      if ( data.notes ) {
        notes.classList.remove( 'hidden' );
        if( data.markdown ) {
          notesValue.innerHTML = marked( data.notes );
        }
        else {
          notesValue.innerHTML = data.notes;
        }
      }
      else {
        notes.classList.add( 'hidden' );
      }

      // Update the note slides
      currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ] }), '*' );
      upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'setState', args: [ data.state ] }), '*' );
      upcomingSlide.contentWindow.postMessage( JSON.stringify({ method: 'next' }), '*' );
      // END-SNIPPET handleStateMessage

      self._syncRevealState(data.state);
    });
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

  handleConnectMessage: function( /* data */ ) {
    // BEGIN-MONKEYPATCH handleConnectMessage
    this.setupIframes();
    this.setupKeyboard();
    this.setupNotes();
    this.setupTimer();
    // END-MONKEYPATCH handleConnectMessage
  },

  setupKeyboard: function() {
    // BEGIN-MONKEYPATCH setupKeyboard-locals
    var currentSlide = get(this, 'currentSlide');
    // END-MONKEYPATCH setupKeyboard-locals

    document.addEventListener( 'keydown', function( event ) {
      currentSlide.contentWindow.postMessage( JSON.stringify({ method: 'triggerKey', args: [ event.keyCode ] }), '*' );
    } );
  },

  setupIframes: function( /* data */ ) {
    // BEGIN-MONKEYPATCH setupIframes-properties
    set(this, 'currentSlide', $('#current-slide iframe')[0]);
    set(this, 'upcomingSlide', $('#upcoming-slide iframe')[0]);
    // END-MONKEYPATCH setupIframes-properties
  },

  setupNotes: function() {
    // BEGIN-MONKEYPATCH setupNotes-locals
    var notes, notesValue;
    // END-MONKEYPATCH setupNotes-locals

    notes = document.querySelector( '.speaker-controls-notes' );
    notesValue = document.querySelector( '.speaker-controls-notes .value' );

    // BEGIN-MONKEYPATCH setupNotes-properties
    set(this, 'notes', notes);
    set(this, 'notesValue', notesValue);
    // END-MONKEYPATCH setupNotes-properties
  },

  setupTimer: function() {
    // BEGIN-MONKEYPATCH setupTimer-locals
    var zeroPadInteger = this.zeroPadInteger;
    // END-MONKEYPATCH setupTimer-locals

    var start = new Date(),
      timeEl = document.querySelector( '.speaker-controls-time' ),
      clockEl = timeEl.querySelector( '.clock-value' ),
      hoursEl = timeEl.querySelector( '.hours-value' ),
      minutesEl = timeEl.querySelector( '.minutes-value' ),
      secondsEl = timeEl.querySelector( '.seconds-value' );

    function _updateTimer() {

      var diff, hours, minutes, seconds,
        now = new Date();

      diff = now.getTime() - start.getTime();
      hours = Math.floor( diff / ( 1000 * 60 * 60 ) );
      minutes = Math.floor( ( diff / ( 1000 * 60 ) ) % 60 );
      seconds = Math.floor( ( diff / 1000 ) % 60 );

      clockEl.innerHTML = now.toLocaleTimeString( 'en-US', { hour12: true, hour: '2-digit', minute:'2-digit' } );
      hoursEl.innerHTML = zeroPadInteger( hours );
      hoursEl.className = hours > 0 ? '' : 'mute';
      minutesEl.innerHTML = ':' + zeroPadInteger( minutes );
      minutesEl.className = minutes > 0 ? '' : 'mute';
      secondsEl.innerHTML = ':' + zeroPadInteger( seconds );

    }

    // Update once directly
    _updateTimer();

    // Then update every second
    setInterval( _updateTimer, 1000 );

    timeEl.addEventListener( 'click', function() {
      start = new Date();
      _updateTimer();
      return false;
    } );

  },

  zeroPadInteger: function(num) {

    var str = '00' + parseInt( num );
    return str.substring( str.length - 2 );

  }
  // jscs:enable
});
