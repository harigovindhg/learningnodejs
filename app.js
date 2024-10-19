// Importing modules
// require('./xyzFile.js');

// Common JS Module (cjs) import strategy
// const { x, calcSum } = require('./calculate/sum.js');
// const { calcMultiply } = require('./calculate/multiply.js');

// Nested JS Import
const { x, calcSum, calcMultiply } = require('./calculate');

// ES JS Module (ejs) import strategy
// import { calcSum } from './sum.js';

const name = 'Hari';
const a = 10;
const b = 30;

console.log(name);
console.log(a + b);
console.log(calcSum(10, 20));
console.log(x);
console.log(calcMultiply(7, 5));
// Global object references in Node.js
// console.log(globalThis);
// console.log(global);