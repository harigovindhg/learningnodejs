const fs = require('fs');
const a = 100;

setImmediate(() => console.log('setImmediate'));

fs.readFile('file.txt', () => {
    console.log('Completed File read CB');
});

Promise.resolve("Promise").then(console.log);

setTimeout(() => {
    console.log('setTimeout of 0s completed')
}, 0);

process.nextTick(() => console.log('process.nextTick'))

function printA() {
    console.log('a =', a);
}

printA();
console.log("End of File reached.")


/**
 * a=100
 * End of File reached
 * process.nextTick
 * Promise resolved
 * setTimeout of 0s completed
 * setImmediate
 * completed File read CB
 */