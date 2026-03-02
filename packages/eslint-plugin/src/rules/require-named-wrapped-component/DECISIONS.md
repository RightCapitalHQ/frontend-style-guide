# Technical Decisions

## Naming Conventions

This rule follows React's official HOC terminology as defined in the [React documentation](https://legacy.reactjs.org/docs/higher-order-components.html).

### Terminology Reference

| Term                             | Definition                                                    | Example                          |
| -------------------------------- | ------------------------------------------------------------- | -------------------------------- |
| **HOC** (Higher-Order Component) | A function that takes a component and returns a new component | `observer`, `forwardRef`, `memo` |
| **Wrapped component**            | The component passed into the HOC                             | `() => <div>...</div>`           |
| **Enhanced component**           | The new component returned by the HOC                         | `observer(() => ...)`            |

### Rule Name: `require-named-wrapped-component`

The rule name uses "wrapped component" because that's the official React term for the component passed into an HOC.

### Option: `hocNames`

List of HOC function names to check. Named `hocNames` because these functions ARE HOCs according to React's definition: "a function that takes a component and returns a new component".

### Option: `includeReactHocs`

Controls whether React's built-in HOCs (`forwardRef`, `memo`) are also checked. Named `includeReactHocs` to clearly indicate these are React's HOCs, not third-party ones.

By default, React's HOCs are excluded because they handle display names automatically.
