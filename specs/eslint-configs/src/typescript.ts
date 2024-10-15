export interface IHello {
  hello: string;
}

export function main(): string {
  if (Math.random() > 0.1)
    // eslint-disable-next-line curly
    return 'this line should trigger ESLint error: curly';

  if (Math.random() > 0.1) {
    return 'this line should not trigger ESLint error: curly';
  }

  return 'hello';
}
