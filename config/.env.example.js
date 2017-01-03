/**
 * Configuration variables for specific environments.
 *
 * Configurations cascade from `prod` to `dev` to `test`.
 */

module.exports = {
  prod: {
    CLIENT_ID: '"YOUR-CLIENT-ID"',
    APPLICATION_ID: '"YOUR-APPLICATION-ID"',
    GOOGLE_TRACKING_ID: 'YOUR_GOOGLE_TRACKING_ID'
    /* project configs */
    DEFAULT_MIMETYPE: 'text/plain'
  },
  dev: {
    // CLIENT_ID: '"YOUR-CLIENT-ID"',
    // APPLICATION_ID: '"YOUR-APPLICATION-ID"'
  },
  test: {
    // CLIENT_ID: '"YOUR-CLIENT-ID"',
    // APPLICATION_ID: '"YOUR-APPLICATION-ID"'
  }
}
