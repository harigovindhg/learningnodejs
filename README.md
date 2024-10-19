
**NodeJS is a JavaScript runtime that is built on top of Google's V8 Engine**

**NodeJS has an event-driven architecture, and utilizes asynchronous I/O (Non-Blocking I/O)**

# What is NodeJS

NodeJS is a C++ application with V8 Engine embedded in it
Running a NodeJS file is as simple as executing `node fileName.js`

## Global object in Node.js
The global object in Node is referred using the `global` keyword 

**Note:** `this` and `global` are not the same.
`this` refers to the window/self/frames object in the browser. Same does not apply for Node.

To unify the nomenclature of the window/global object, `globalThis` was added as a new standard reference to the global object across all platforms and tools

# Modules in NodeJS

Any code that is not on the main executable JS is a module. 
Modules are imported/included into another module using `require` keyword

**Note: Modules protect their variables and functions from leaking by default**

To make the functions and variables within the imported module available to the importing module, we have to intentionally export the specific function/variable

We will use `module.exports` to export a function/variable from a module.
**Note: `module.exports` is an empty JS Object by default. We assign a value to it**
**Additional Note: Always make a habit of exporting as module.exports = {functionName}**

Syntax to export/import function/variables from a module to another:
```JS
// Exporting:
module.exports = functionName;

//Exporting multiple items from a module:
module.exports = {
variableName: variableName,
functionName: functionName
}

// Importing:
const functionName = require('./filePath');
functionName();

// Importing multiple Items:
const moduleObject = require('./filepath');
moduleObject.variableName;
moduleObject.functionName;
```

## Module Patterns

### Common JS Modules (cjs)
The above method of creating a module and exporting it using `module.exports` is called Common JS Modules
- We use `module.exports` and `const functionName = require('./filepath.js') ` here
- **This is the default mode for all modules, unless explicitly mentioned**
- Older approach
- Synchronous import/export
- Runs in non-strict mode

### ES JS Modules (ejs)
Another approach to creating and exporting modules is the `ejs` approach, where we will define in the `package.json` as ` "type": "module" ` 
- We use `export functionName` and `import {functionName} from './filepath.js' ` for importing and exporting
- **Used by default by some frameworks like React**
- Latest approach
- Allows Asynchronous Import/Exports
- runs in strict mode

**As of now most nodeJS repos still use the cjs approach. But it is officially recognized that ejs will be the standard soon.**

The Module mode can be defined using the `package.json`

## How `require` works

`module.exports` wraps the entire code which is being exported into a function, which is then exported to the component that `require`s the module.

The imported module is executed within this wrapper function.

**This wrapper function is not a generic standard function. It is an IIFE (Immediately Invoked Function Expression)**

**`require` function always runs in synchronous mode.**
### IIFE (Immediately Invoked Function Expression)

An IIFE is a function that is invoked at the same moment it is created/defined.

Syntax:
```JS
(function () {})();
```

Example:
```JS
(function (a, b) {
console.log(a + b);
}) (2, 8);

// Outputs 10
```

The main advantage of an IIFE, and also the logic of `require` importing a module as an IIFE is that it provide data privacy, and data stability to the imported module functions and variables.

**Note: This is the answer to the important question as to how functions and variables are private in different modules**

**Q. How are we getting access to `module.exports` and `require` ?**
**Ans:** Node.js is providing `module.exports = {}` and `require` as a parameter to the IIFE which is created during a `require` invocation.

**This IIFE which is created by Node.js and contains the code we have written, is then sent to the Google V8 Engine for parsing.**

### 5-step mechanism of `require`

The moment we write `require(/file.js)`, the following 5 steps take place:
1. **Resolving the module**: It will check what is the module path, and the module type.
   It could be a `.js` local path file, or a `.json` data file, or even a node module.
2. **Loading the module:** file content is loaded according to the file type discerned in first step
3. **Wraps the module in an IIFE (Compile step)**
4. **Code evaluation:** In this step, `module.exports` is returned, and processed
5. **Caching: (VV Important!)** The exported module is cached by Node, and this means that regardless of how many times the module is imported/used in the code, the module is parsed only a single time.

# libuv

Libuv acts as a middleware that enables Google V8 with extra capabilities like Event Loop, Thread Pools, and also shares the OS level functionalities to V8, like Timers, DB, File systems, URL systems etc.

Without Libuv, Node.js will not have asynchronous features at all! Libuv is a superhero for Node.js!

## Generic overview of how libuv functions

A generic high level execution sequence of JS code by V8 JS Engine and Libuv is as follows:

1. During code execution, any asynchronous function/task encountered by V8 is offloaded onto libuv along with the associated callback function, which maintains a track of the queued async tasks, and allows the V8 JS Engine to resume execution.
2. Once the global execution context is completed, and pushed out of the call stack, then libuv starts handing over the callbacks that has completed their async processing back to the JS Engine for execution.
## Internal Architecture of libuv

The internal Architecture of `libuv` consists majorly 3 tools:
1. **Event Loop:** The Event Loop monitors the Main Call Stack/Thread as well as the Callback Queue to pick up callbacks from the Callback Queue and push into the Main Call Stack.
   The Event Loop will constantly monitor the Call Stack, and as soon as it is empty and idle, will push callbacks from the callback queue.
2. **Callback Queue:** The job of the callback queue is to keep track of all the asynchronous tasks that complete their async wait, and maintain the callback functions returned from the async task in a queue for the Event Loop to pick up, and push into the Main Call Stack/Thread.
3. **Thread Pool:**

### Internal process cycle of Event Loop
Consider the scenario where multiple async processes in the code complete at the same time, leading to a race-condition. 
How, and which callback will the Event Loop process first?
How does Event Loop prioritize callbacks?

To answer the above questions, let us take a dive into the internal process cycles of Event Loop

Event Loop runs in **phases**. This means that the Event Loop switches between multiple phases in a cycle during its process cycle.

The 4 major process cycles that Event Loop runs through are, in order of priority:
1. **TIMER:** This is the first phase of the Event Loop. All timer based callbacks, such as **setTimeout()** and **setInterval()** are prioritized/picked up first by the Event Loop.
2. **POLL:** During the 2nd phase, The Event Loop will prioritize all **I/O callbacks** like **incoming connections, file CRUD operations, crypto, https.get, data calls, etc.** Majority of the callbacks that usually appear during code execution are therefore processed in this 
3. **CHECK:** All callbacks that are scheduled from the `setImmediate` function are prioritized in this phase.
4. **CLOSE:** Multiple cleanup tasks like socket cleanups are prioritized in this phase. eg: **socket.on("close")**

**V. Imp**: Before every phase of the Event Loop executes, a pre-check is executed. This pre-check consists of 2 tasks:
1. **process.nextTick()**: all nested nextTicks will be processed recursively with highest priority. Event loop continues to next phase only after all the nextTicks are completed processing.
2. **promise callback**: 
This means that before each **TIMER, POLL, CHECK, CLOSE**, NodeJs will check whether there is any **process.nextTick()** callbacks pending, then checks whether any **promise callbacks** are pending. **This check is done before every single phase in each cycle**

**Very Important:** Even before the very first Timer cycle starts, the process.nextTick() and promise callback sub-loop is run.

**Additional VERY IMPORTANT Note:** The event loop will wait at the **POLL** phase if there are no callbacks in any of the queues. If any new POLL phase tasks such as **incoming connections, file CRUD operations, crypto, https.get, data calls (fs)** come, then the event loop will resume from the POLL phase and continue with the loop. **It will not start again from the TIMER phase**

**Browser Event Loop, and libuv Event Loop have entirely different behavior. They are not the same**
# Google V8 JavaScript Engine

Code passed from Node.js to the V8 JS Engine undergoes multiple stages of transformation and processing in order to execute the code.

The various stages that the code undergoes inside the V8 Engine is as follows:
1. **Parsing:** During the parsing phase, the code undergoes 2 stages, namely **Lexical Analysis (Tokenization)** and **Syntax Analysis (Parsing)**
	1. **Lexical Analysis (Tokenization):** During this phase, the code is broken down into `tokens`, which makes the code easier to parse.
	2. **Syntax Analysis (Parsing):** During this phase, the tokens generated in the tokenization phase is transformed into an **Abstract Syntax Tree (AST)**, which is a simplified version of the code, in a tree structure.
2. **Interpreting/Compiling (Optimization):** JS is a **Just In Time (JIT)** compiled language. This means that JS parsing combines both Interpreting as well as Compiling.
	1. Google's Interpreter is called **Iginition**. Ignition's job is to interpret the AST into Byte Code. But it also has another task. Any snippet of code that is repeatedly used throughout the code is sent to the V8 Compiler **Turbofan**, which compiles the code so as to reduce processing time, and optimizes the interpreting process.
	2. Such repeatedly used snippets of code is also referred to as **hot code.**
	3. The **turbofan** compiler compiles such "hot code", to generate the optimized machine code, which can then be executed.
	Sometimes this kind of "optimization" might need to be "de-optimized". 
	Take an example of a function 'sum', which calculates the sum of 2 values passed to it.
	Turbofan will assume that this function will accept only numeric value, since the function seems to be invoked with numeric values for parameters 95% of the time.
	Now consider that there is an invocation of 'sum' with 2 string parameters.
	This means that the optimization done by Turbofan will fail.
	In such scenarios, the code is "de-optimized" and sent back to the Ignition Interpreter to interpret the code line-by-line to generate the byte code.
3. **Garbage Collection:** At the same time that V8 performs Interpreting and Compiling, there is also an addition process of garbage collection being carried out by the JS Engine.
	1. Google has multiple Garbage Collectors, namely **Orinoco, Oil Pan, Scavenger, etc.**
	2. One of the algorithms used by the Garbage Collector is **Mark & Sweep Algorithm**

