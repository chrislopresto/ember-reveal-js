import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  classNames: ['notes'],
  tagName: 'aside',
  attributeBindings: ['data-markdown'],
  hasMarkdown: true,
  'data-markdown': computed('hasMarkdown', function() {
    return get(this, 'hasMarkdown') || null;
  })
});
