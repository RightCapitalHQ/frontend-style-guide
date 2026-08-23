import type { ConfigObject } from '@eslint/core';

import { pickPlugins } from '../../utils.js';

/**
 * Browser-security rules: the client-side sinks a type checker cannot see.
 *
 * Scoped to the eight rules that are structural (they match a syntactic shape,
 * not a guess about a value), so they do not need type information and do not
 * fire on well-written code.
 */
const config: readonly ConfigObject[] = [
  {
    plugins: pickPlugins(['browser-security']),

    rules: {
      // disallow assigning to innerHTML/outerHTML, the most common XSS sink
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-innerhtml.md
      'browser-security/no-innerhtml': 'error',

      // disallow eval() and its string-compiling relatives
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-eval.md
      'browser-security/no-eval': 'error',

      // disallow storing a JWT in localStorage/sessionStorage, where any XSS on
      // the page can read it, unlike an HttpOnly cookie
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-jwt-in-storage.md
      'browser-security/no-jwt-in-storage': 'error',

      // same reasoning for other secrets kept in Web Storage
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-sensitive-localstorage.md
      'browser-security/no-sensitive-localstorage': 'error',

      // disallow credentials in query strings, which land in browser history,
      // Referer headers, and server access logs
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-credentials-in-query-params.md
      'browser-security/no-credentials-in-query-params': 'error',

      // require Secure and SameSite when setting cookies from JavaScript.
      // HttpOnly is deliberately absent: a cookie set through document.cookie
      // cannot be HttpOnly, which is the point of the flag.
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/require-cookie-secure-attrs.md
      'browser-security/require-cookie-secure-attrs': 'error',

      // disallow postMessage(..., '*'), whose origin wildcard leaks the payload
      // to whatever happens to be framed
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-postmessage-wildcard-origin.md
      'browser-security/no-postmessage-wildcard-origin': 'error',

      // disallow redirects built from unvalidated input (open redirect)
      // https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/docs/rules/no-insecure-redirects.md
      'browser-security/no-insecure-redirects': 'error',
    },
  },
];

export default config;
