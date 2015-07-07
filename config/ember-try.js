/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: '1.11.4',
      dependencies: {
        'ember': '1.11.4'
      }
    },
    {
      name: '1.12.2',
      dependencies: {
        'ember': '1.12.2'
      }
    },
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
