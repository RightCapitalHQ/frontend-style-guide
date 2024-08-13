await Promise.resolve('yay');

if (Math.random() > 0.1)
  // eslint-disable-next-line curly
  process.stdout.write('this line should trigger ESLint error: curly');

if (Math.random() > 0.1) {
  process.stdout.write('this line should not trigger ESLint error: curly');
}
