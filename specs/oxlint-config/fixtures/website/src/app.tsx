import { useEffect, useState } from 'react';

// intentionally not awaited: type-aware `no-floating-promises`
const load = async () => 1;
load();

export const title = document.title;

export const Counter = () => {
  const [count, setCount] = useState(0);
  if (count > 1) {
    useEffect(() => {}, []);
  }
  console.log(count);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
