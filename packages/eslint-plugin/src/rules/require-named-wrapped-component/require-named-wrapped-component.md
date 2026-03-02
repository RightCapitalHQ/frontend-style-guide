# @rightcapital/require-named-wrapped-component

📝 Require wrapped components passed to HOCs to be named functions.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Require wrapped components passed to HOCs to be named functions.

## Background

React-related ESLint rules (such as `react-hooks/rules-of-hooks`) determine whether a function is a React component by checking the function name. When passing anonymous inline functions (wrapped components) to HOCs, these rules fail to recognize them as components, leading to:

1. React-related ESLint rules not recognizing the function as a component
2. React DevTools displaying `Anonymous` or `<Unknown>`, making debugging difficult

For more information on HOC terminology, see [React's official HOC documentation](https://legacy.reactjs.org/docs/higher-order-components.html).

## Rule Details

This rule detects anonymous inline functions (including arrow functions and anonymous function expressions) passed to HOCs and requires them to be named functions.

### Incorrect Examples

```tsx
// ❌ Anonymous arrow function
const EnhancedButton = observer(() => {
  return <button>Click</button>;
});

// ❌ Anonymous function expression
const EnhancedButton = observer(function () {
  return <button>Click</button>;
});
```

### Correct Examples

```tsx
// ✅ Named function expression
const EnhancedButton = observer(function EnhancedButton() {
  return <button>Click</button>;
});

// ✅ Define named component first, then pass reference
const EnhancedButtonBase = () => <button>Click</button>;
const EnhancedButton = observer(EnhancedButtonBase);

// ✅ forwardRef exception: anonymous functions allowed (unless includeReactHocs is true)
const EnhancedButton = forwardRef((props, ref) => {
  return (
    <button ref={ref} {...props}>
      Click
    </button>
  );
});

// ✅ React.forwardRef is also an exception
const EnhancedButton = React.forwardRef((props, ref) => {
  return (
    <button ref={ref} {...props}>
      Click
    </button>
  );
});

// ✅ memo exception: anonymous functions allowed (unless includeReactHocs is true)
const ExpensiveComponent = memo(() => {
  return <div>Expensive</div>;
});

// ✅ HOC wrapping forwardRef, anonymous allowed inside forwardRef
const EnhancedButton = observer(
  forwardRef((props, ref) => {
    return (
      <button ref={ref} {...props}>
        Click
      </button>
    );
  }),
);
```

## Auto-fix

This rule supports auto-fix (`--fix`). The fix names the inline function based on the variable name that the HOC's return value is assigned to.

### Fix Examples

```tsx
// Before: Anonymous arrow function
const EnhancedButton = observer(() => {
  return <button>Click</button>;
});

// After: Converted to named function expression
const EnhancedButton = observer(function EnhancedButton() {
  return <button>Click</button>;
});
```

```tsx
// Before: Anonymous function expression
const EnhancedButton = observer(function () {
  return <button>Click</button>;
});

// After: Function name added
const EnhancedButton = observer(function EnhancedButton() {
  return <button>Click</button>;
});
```

### Cases That Cannot Be Auto-fixed

The following cases cannot be auto-fixed and require manual handling:

```tsx
// ❌ Cannot determine variable name (e.g., direct export)
export default observer(() => <button>Click</button>);

// ❌ Cannot determine variable name (e.g., as object property)
const components = {
  Button: observer(() => <button>Click</button>),
};

// ❌ Cannot determine variable name (e.g., as array element)
const list = [observer(() => <button>Click</button>)];
```

## Configuration Options

```typescript
interface Options {
  /**
   * List of HOC function names to check.
   * Only wrapped components passed to these HOCs will be checked.
   */
  hocNames: string[];

  /**
   * Whether to also check React's built-in HOCs (forwardRef, memo).
   * By default, these are exceptions since they handle display names automatically.
   * @default false
   */
  includeReactHocs?: boolean;
}
```

### Default Configuration

```json
{
  "rules": {
    "@rightcapital/require-named-wrapped-component": [
      "error",
      { "hocNames": ["observer"] }
    ]
  }
}
```

By default, React's built-in HOCs (`forwardRef`, `React.forwardRef`, `memo`, `React.memo`) are exceptions and do not require named wrapped components. Set `includeReactHocs: true` to also require named components for these HOCs.
