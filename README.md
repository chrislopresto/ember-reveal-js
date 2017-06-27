# ember-reveal-js

This Ember addon provides an easy way to include reveal.js presentations in Ember apps.

## Themes

- Ember theme courtesy of [https://github.com/hbrysiewicz](https://github.com/hbrysiewicz) - [http://hbrysiewicz.github.io/2014-10-10-ember-reveal-theme.html](http://hbrysiewicz.github.io/2014-10-10-ember-reveal-theme.html)

## Controlling Presentation Display with Query Parameters

| Param | Abbreviation | Usage | Explanation |
| ----- | ------------ | ----- | ----------- |
| width | w | `w=1600` | Presentation width. Use together with height to define slide aspect ratio. Useful for printing to PDF. |
| height | h | `h=900` | Presentation height. Use together with width to define slide aspect ratio. Useful for printing to PDF. |
| controls | c | `c=false` | Visibility of arrow navigation controls. Defaults to visible. Specify false to hide them. |
| indexh | h | `h=17` | Horizontal index of current slide. |
| indexv | v | `v=3` | Vertical index of current slide. |
| print-pdf | print-pdf | print-pdf=true |

## Printing to PDF

Add `print-pdf=true` to the querystring to invoke the reveal.js print stylesheets. Favor Chrome. Remove margins. Choose a paper aspect ratio that matches your presentation aspect ratio.

### Disclaimer
Works with simple layouts... not so much with more complicated layouts. There are issues with reveal.js itself.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-reveal-js`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
