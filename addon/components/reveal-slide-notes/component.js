import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  classNames: ['notes'],
  tagName: 'aside',
  attributeBindings: ['data-markdown'],
  hasMarkdown: true,
  'data-markdown': computed('hasMarkdown', function() {
    return get(this, 'hasMarkdown') || null;
  })
});
