import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['reveal-slide'],
  attributeBindings: [
    'data-markdown',
    'data-background',
    'data-background-size',
    'data-background-image',
    'data-background-video',
    'data-background-iframe',
    'data-background-color',
    'data-background-repeat',
    'data-background-position',
    'data-background-transition'
  ],
  tagName: 'section',
  hasMarkdown: null,
  'data-markdown': computed('hasMarkdown', function() {
    return get(this, 'hasMarkdown') || null;
  })
});
