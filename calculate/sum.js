
// ES JS Module (ejs) export strategy
// export function calcSum(a, b) {
//     return a + b;
// }

function calcSum(a, b) {
    return a + b;
}

const x = 300;

// Common JS Module (cjs) export strategy
module.exports = { x, calcSum };