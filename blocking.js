const crypto = require('crypto');
const https = require('https');

console.log('Hello World');

let a = 234623456;
let b = 3456;

https.get('https://dummyjson.com/products/1', (res) => {
    console.log("Data Fetched Successfully");
});

// Even if you put timeout duration as 0, it will still be an async call
setTimeout(() => {
    console.log('Call me immediately!!!');
}, 0);

crypto.pbkdf2('MyPassword@321', 'salt-key', 50000000, 50, 'sha512', (err, key) => {
    console.log('key generated asynchronously!', key);
})

function mult(a, b) {
    return a * b;
}

const c = mult(a, b);

console.log('Multiplication Result:', c);