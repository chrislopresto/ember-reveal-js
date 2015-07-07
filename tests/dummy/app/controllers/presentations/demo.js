import Ember from 'ember';
import RevealPresentation from 'ember-reveal-js/controllers/reveal-presentation';

const { set } = Ember;

export default RevealPresentation.extend({
  presentation() {
    let viewRegistry = this.container.lookup('-view-registry:main');

    // for < 1.12.0 support
    if (!viewRegistry) {
      viewRegistry = Ember.View.views;
    }

    return viewRegistry.demoPresentation;
  },
  actions: {
    setTheme(theme) {
      set(this.presentation(), 'theme', theme);
    }
  }
});
