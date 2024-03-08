# Disallow ignoring return value of React hooks (`@rightcapital/no-ignore-return-value-of-react-hooks`)

💼 This rule is enabled in the `recommended-react` config.

<!-- end auto-generated rule header -->

## Fail

```js
function Foo() {
  useState(0);
}
```

## Pass

```js
function Foo() {
  const [count, setCount] = useState(0);
  const stateAndAction = useState(0);
}
```

```js
function Foo() {
  return useState(0);
}
```

```js
const Foo = () => useState(0);
```
