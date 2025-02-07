import eslintPluginReact from '@eslint-react/eslint-plugin';
import type { TSESLint } from '@typescript-eslint/utils';
import globals from 'globals';

import { pickPlugins } from '../../utils.js';
/**
 * Common rules for React, working with TypeScript.
 */
const config: TSESLint.FlatConfig.ConfigArray = [
  eslintPluginReact.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: pickPlugins([
      ...(Object.keys(
        eslintPluginReact.configs.all.plugins,
      ) as (keyof typeof eslintPluginReact.configs.all.plugins)[]),
      '@rightcapital',
      '@stylistic',
      'react-hooks',
      'jsx-a11y',
    ]),
    rules: {
      // naming convention
      '@eslint-react/naming-convention/component-name': ['error', 'PascalCase'],
      '@eslint-react/naming-convention/filename': [
        'error',
        { rule: 'kebab-case' },
      ],
      '@eslint-react/naming-convention/use-state': 'error',

      // JSX
      '@eslint-react/no-useless-fragment': 'error',
      '@rightcapital/no-explicit-type-on-function-component-identifier':
        'error',
      '@stylistic/jsx-self-closing-comp': 'error',
      '@rightcapital/jsx-no-unused-expressions': 'error',

      // React 19 feature, not applicable to projects using React 18 or below
      // https://react.dev/blog/2024/12/05/react-19#context-as-a-provider
      // https://eslint-react.xyz/docs/rules/no-context-provider
      '@eslint-react/no-context-provider': 'off',
      // React 19 feature
      // https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop
      // https://eslint-react.xyz/docs/rules/no-forward-ref
      '@eslint-react/no-forward-ref': 'off',

      // hooks
      // Enforce Rules of Hooks
      // https://github.com/facebook/react/blob/c11015ff4f610ac2924d1fc6d569a17657a404fd/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
      'react-hooks/rules-of-hooks': 'error',

      // Verify the list of the dependencies for Hooks like useEffect and similar
      // https://github.com/facebook/react/blob/1204c789776cb01fbaf3e9f032e7e2ba85a44137/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js
      'react-hooks/exhaustive-deps': 'error',

      // MEMO: There are too many false positives with this rule.
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',

      // A11y
      // Enforce that all elements that require alternative text have meaningful information
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img', 'object', 'area', 'input[type="image"]'],
          img: [],
          object: [],
          area: [],
          'input[type="image"]': [],
        },
      ],

      // Enforce that anchors have content
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-has-content.md
      'jsx-a11y/anchor-has-content': ['error', { components: [] }],

      // elements with aria-activedescendant must be tabbable
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-activedescendant-has-tabindex.md
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',

      // Enforce all aria-* props are valid.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-props.md
      'jsx-a11y/aria-props': 'error',

      // Enforce ARIA state and property values are valid.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-proptypes.md
      'jsx-a11y/aria-proptypes': 'error',

      // Require ARIA roles to be valid and non-abstract
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: false }],

      // Enforce that elements that do not support ARIA roles, states, and
      // properties do not have those attributes.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements.md
      'jsx-a11y/aria-unsupported-elements': 'error',

      // Enforce that a control (an interactive element) has a text label.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
      'jsx-a11y/control-has-associated-label': [
        'error',
        {
          labelAttributes: ['label'],
          controlComponents: [],
          ignoreElements: [
            'audio',
            'video',
            'canvas',
            'embed',
            'input',
            'textarea',
            'tr',
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/959
            'th',
            'td',
          ],
          ignoreRoles: [
            'grid',
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'row',
            'tablist',
            'toolbar',
            'tree',
            'treegrid',
          ],
          depth: 5,
        },
      ],

      // ensure <hX> tags have content and are not aria-hidden
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/heading-has-content.md
      'jsx-a11y/heading-has-content': ['error', { components: [''] }],

      // require HTML elements to have a "lang" prop
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/html-has-lang.md
      'jsx-a11y/html-has-lang': 'error',

      // ensure iframe elements have a unique title
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/iframe-has-title.md
      'jsx-a11y/iframe-has-title': 'error',

      // Prevent img alt text from containing redundant words like "image", "picture", or "photo"
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md
      'jsx-a11y/img-redundant-alt': 'error',

      // Elements with an interactive role and interaction handlers must be focusable
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus.md
      'jsx-a11y/interactive-supports-focus': 'error',

      // Enforce that a label tag has a text label and an associated control.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/b800f40a2a69ad48015ae9226fbe879f946757ed/docs/rules/label-has-associated-control.md
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelComponents: [],
          labelAttributes: [],
          controlComponents: [],
          assert: 'both',
          depth: 25,
        },
      ],

      // require HTML element's lang prop to be valid
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang.md
      'jsx-a11y/lang': 'error',

      // media elements must have captions
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md
      'jsx-a11y/media-has-caption': [
        'error',
        {
          audio: [],
          video: [],
          track: [],
        },
      ],

      // require that mouseover/out come with focus/blur, for keyboard-only users
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
      'jsx-a11y/mouse-events-have-key-events': 'error',

      // Prevent use of `accessKey`
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key.md
      'jsx-a11y/no-access-key': 'error',

      // prohibit autoFocus prop
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],

      // prevent distracting elements, like <marquee> and <blink>
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-distracting-elements.md
      'jsx-a11y/no-distracting-elements': [
        'error',
        {
          elements: ['marquee', 'blink'],
        },
      ],

      // WAI-ARIA roles should not be used to convert an interactive element to non-interactive
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-interactive-element-to-noninteractive-role.md
      'jsx-a11y/no-interactive-element-to-noninteractive-role': [
        'error',
        {
          tr: ['none', 'presentation'],
        },
      ],

      // A non-interactive element does not support event handlers (mouse and key handlers)
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],

      // WAI-ARIA roles should not be used to convert a non-interactive element to interactive
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-to-interactive-role.md
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        'error',
        {
          ul: [
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
          ],
          ol: [
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'tablist',
            'tree',
            'treegrid',
          ],
          li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
          table: ['grid'],
          td: ['gridcell'],
        },
      ],

      // Tab key navigation should be limited to elements on the page that can be interacted with.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-tabindex.md
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        {
          tags: [],
          roles: ['tabpanel'],
        },
      ],

      // ensure HTML elements do not specify redundant ARIA roles
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-redundant-roles.md
      'jsx-a11y/no-redundant-roles': 'error',

      // Enforce that DOM elements without semantic behavior not have interaction handlers
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
      'jsx-a11y/no-static-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],

      // Enforce that elements with ARIA roles must have all required attributes
      // for that role.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props.md
      'jsx-a11y/role-has-required-aria-props': 'error',

      // Enforce that elements with explicit or implicit roles defined contain
      // only aria-* properties supported by that role.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-supports-aria-props.md
      'jsx-a11y/role-supports-aria-props': 'error',

      // only allow <th> to have the "scope" attr
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/scope.md
      'jsx-a11y/scope': 'error',

      // Enforce tabIndex value is not greater than zero.
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md
      'jsx-a11y/tabindex-no-positive': 'error',
    },
  },
];

export default config;
