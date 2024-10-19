const fs = require('fs');

setImmediate(() => console.log('setImmediate'));

setTimeout(() => { console.log('setTimeout') }, 0);

Promise.resolve("Promise").then(console.log);

fs.readFile('file.txt', () => {
    console.log('Completed File read CB');
});

process.nextTick(() => {
    process.nextTick(() => { console.log("inner nextTick") });
    console.log('nextTick');
})

console.log("End of File reached.")

/**
 * EOF
 * nextTick
 * inner nextTick   // all nested nextTicks will be processed recursively with highest priority. Event loop continues to next phase only after all the nextTicks are completed processing.
 * Promise
 * setTimeout
 * setImmediate
 * Completed File read CB
 */