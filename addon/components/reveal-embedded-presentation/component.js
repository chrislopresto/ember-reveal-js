import Ember from 'ember';
import layout from './template';

const { computed, get } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['reveal-embedded-presentation'],
  width: 640,
  height: 512,
  url: null, // passed in
  src: computed('url', function() {
    let params = [
      'progress=false',
      'history=false',
      'transition=none',
      'autoSlide=0',
      'backgroundTransition=none'
    ].join('&');
    let url = get(this, 'url');
    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }
    url = url.replace(/&r=true/, '');
    url = url.replace(/r=true/, '');
    url += params;
    return url;
  })
});
