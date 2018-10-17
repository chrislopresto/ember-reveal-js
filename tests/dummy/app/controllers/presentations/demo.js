import { set } from '@ember/object';
import RevealPresentation from 'ember-reveal-js/controllers/reveal-presentation';

export default RevealPresentation.extend({
  presentation() {
    let viewRegistry = this.container.lookup('-view-registry:main');

    return viewRegistry.demoPresentation;
  },
  actions: {
    setTheme(theme) {
      set(this.presentation(), 'theme', theme);
    }
  }
});
