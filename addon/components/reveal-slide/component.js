import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['RevealSlide'],
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
  }),
  centeredVertically: false
});
