const fs = require('fs');
const https = require('https');

console.log('Hello World');

let a = 234623456;
let b = 3456;

https.get('https://dummyjson.com/products/1', (res) => {
    console.log("Data Fetched Successfully");
});

setTimeout(() => {
    console.log('SetTimeout of 5s completed');
}, 5000);

// Async, will not block the main thread
fs.readFile('./file.txt', 'utf8', (err, data) => {
    console.log('file data', data);
});

// Synchronous, will block the main thread
fs.readFileSync('./file.txt', 'utf8', (err, data) => {
    console.log('file data Sync', data);
});

function mult(a, b) {
    return a * b;
}

const c = mult(a, b);

console.log('Multiplication Result:', c);