const Hello = () => <div>Hello World</div>;

export default Hello;

if (Math.random() > 0.1)
  // eslint-disable-next-line curly
  document.write('this line should trigger ESLint error: curly');

if (Math.random() > 0.1) {
  document.write('this line should not trigger ESLint error: curly');
}
