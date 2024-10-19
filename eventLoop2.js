/**
 * Last Line of File
 * nextTick
 * Promise
 * 1st setTimeout
 * setImmediate
 * File reading CB
 * 2nd nextTick
 * 2nd setImmediate     // Because the Event Loop waits at the POLL phase - the next step will be the CHECK phase instead of starting again from TIMER phase
 * 2nd Timer
 */

const fs = require('fs');

setImmediate(() => console.log('setImmediate'));

fs.readFile('file.txt', () => {
    setTimeout(() => {
        console.log('2nd Timer')
    }, 0);
    process.nextTick(() => console.log('2nd nextTick'));
    setImmediate(() => console.log('2nd setImmediate'));
    console.log('Completed File read CB');
});

Promise.resolve("Promise").then(console.log);

setTimeout(() => {
    console.log('1st setTimeout')
}, 0);

process.nextTick(() => console.log('nextTick'))

console.log("End of File reached.")