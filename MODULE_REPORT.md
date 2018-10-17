## Module Report
### Unknown Global

**Global**: `Ember.inject`

**Location**: `addon/controllers/reveal-presentation.js` at line 3

```js
import Ember from 'ember';

const { computed, inject } = Ember;

export default Ember.Controller.extend({
```

### Unknown Global

**Global**: `Ember.subscribe`

**Location**: `addon/components/reveal-presentation/component.js` at line 71

```js
    Reveal.addEventListener('resumed', this._revealResumed);
    let self = this;
    Ember.subscribe('emberRevealJs.message', {
      before() {},
      after(name, timestamp, payload) {
```

### Unknown Global

**Global**: `Ember.instrument`

**Location**: `addon/components/reveal-presentation/component.js` at line 108

```js

  _revealSlideChanged(event) {
    Ember.instrument('emberRevealJs.message', event);
  },

```

### Unknown Global

**Global**: `Ember.instrument`

**Location**: `addon/components/reveal-presentation/component.js` at line 113

```js
  _revealOverviewShown(event) {
    event.overview = true;
    Ember.instrument('emberRevealJs.message', event);
  },

```

### Unknown Global

**Global**: `Ember.instrument`

**Location**: `addon/components/reveal-presentation/component.js` at line 118

```js
  _revealOverviewHidden(event) {
    event.overview = false;
    Ember.instrument('emberRevealJs.message', event);
  },

```

### Unknown Global

**Global**: `Ember.instrument`

**Location**: `addon/components/reveal-presentation/component.js` at line 123

```js
  _revealPaused(event) {
    event.paused = true;
    Ember.instrument('emberRevealJs.message', event);
  },

```

### Unknown Global

**Global**: `Ember.instrument`

**Location**: `addon/components/reveal-presentation/component.js` at line 128

```js
  _revealResumed(event) {
    event.paused = false;
    Ember.instrument('emberRevealJs.message', event);
  },

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `addon/components/reveal-wormhole/component.js` at line 4

```js
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';

const { inject, computed } = Ember;

export default EmberWormhole.extend({
```

### Unknown Global

**Global**: `Ember.View`

**Location**: `tests/dummy/app/controllers/presentations/demo.js` at line 12

```js
    // for < 1.12.0 support
    if (!viewRegistry) {
      viewRegistry = Ember.View.views;
    }

```
