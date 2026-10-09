var legacy = 1;
console.log(legacy == 2);
export default legacy;

// `process` is not a browser global
export const mode = process.env.NODE_ENV;
