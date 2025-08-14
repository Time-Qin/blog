---
title: '手写Promise满足A+规范（class写法）'
description: '本文介绍了Promise的实现原理及如何实现一个符合A+规范的Promise'
pubDate: '2024-7-22'
heroImage: '/banner-img/1755164491.png'
author: 'Ekko'
tags: ["web", "js",'promise','test']
---
## 背景

一个后端室友在写前端页面时对于`Promise`这个方法不理解，于是自己便想着写一篇blog记录一下。

## `Promise`介绍

`Promise`直译为契约，是异步编程的一种解决方案，比传统的解决方案（回调函数）更加合理和更加强大

在`Promise`出现之前，我们经常使用的多层异步操作，很容易变成回调地狱（无穷无尽的回调函数）如下：

```js
toDo(function(result) {
  toDoElse(result, function(newResult) {
    toDoThing(newResult, function(finalResult) {
      console.log('得到最终结果: ' + finalResult);
    }, callback);
  }, callback);
}, callback);
```

<br/>

用`Promise`方法改写这段代码：

```js
const toDo = ()=>{
	return new Promise()
}

toDO().then((result)=>{
    return toDoElse(result)
}).then((newResult)=>{
    return toDoElse(newResult)
}).then((finalResult)=>{
    console.log('得到最终结果: ' + finalResult); 
}).cath(callback)

```

<br/>

由此便可看出`Promise`方法的优点

> 1. 链式操作减低了编码难度
> 2. 代码可读性强

<br/>

##### `Promise`流程

<img src="/img/promises.png" />

#### `Promise/A+`规范

##### 规范术语

> 1. `promise`：是一个拥有 `then` 方法的对象或函数，其行为符合本规范
> 2. `thenable`：是一个定义了 `then` 方法的对象或函数。这个主要是用来兼容一些老的Promise实现，只要一个Promise实现是thenable，也就是拥有`then`方法的，就可以跟Promises/A+兼容。
> 3. `value`：指`reslove`出来的值，可以是任何合法的JS值(包括 `undefined` , thenable 和 promise等)
> 4. `exception`：异常，在Promise里面用`throw`抛出来的值
> 5. `reason`：拒绝原因，是`reject`里面传的参数，表示`reject`的原因

<br/>

##### `Promise`内部状态

> 1. `pending`: 一个promise在resolve或者reject前就处于这个状态。
> 2. `fulfilled`: 一个promise被resolve后就处于`fulfilled`状态，这个状态不能再改变，而且必须拥有一个**不可变**的值(`value`)。
> 3. `rejected`: 一个promise被reject后就处于`rejected`状态，这个状态也不能再改变，而且必须拥有一个**不可变**的拒绝原因(`reason`)。
>
> **不可变**指的是`===`，也就是说，如果`value`或者`reason`是对象，只要保证引用不变就行，规范没有强制要求里面的属性也不变。


##### `then`方法

一个promise必须拥有一个`then`方法来访问他的值或者拒绝原因。`then`方法有两个参数：

```js
promise.then(onFulfilled, onRejected)
```

<br/>

> `onFulfilled` 和 `onRejected` 都是可选参数。
>
> - 如果 `onFulfilled` 不是函数，其必须被忽略
> - 如果 `onRejected` 不是函数，其必须被忽略

<br/>

##### `onFulfilled` 特性

如果 `onFulfilled` 是函数：

- 当 `promise` 执行结束后其必须被调用，其第一个参数为 `promise` 的终值`value`
- 在 `promise` 执行结束前其不可被调用
- 其调用次数不可超过一次

<br/>

##### `onRejected` 特性

如果 `onRejected` 是函数：

- 当 `promise` 被拒绝执行后其必须被调用，其第一个参数为 `promise` 的据因`reason`
- 在 `promise` 被拒绝执行前其不可被调用
- 其调用次数不可超过一次

<br/>

##### 多次调用

`then` 方法可以被同一个 `promise` 调用多次

- 当 `promise` 成功执行时，所有 `onFulfilled` 需按照其注册顺序依次回调
- 当 `promise` 被拒绝执行时，所有的 `onRejected` 需按照其注册顺序依次回调

<br/>

##### 返回

`then` 方法必须返回一个 `promise` 对象。

```javascript
promise2 = promise1.then(onFulfilled, onRejected); 
```

- 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行 **Promise 解决过程**：`[[Resolve]](promise2, x)`
- 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`
- 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值
- 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因

<br/>

`Promise`的解决过程会在在下面的代码实现中体现

## 手写`Promise`

<br/>

#### 准备

> 1. 新建Promise需要使用`new`关键字，那他肯定是作为面向对象的方式调用的，Promise是一个类。
> 2. 我们`new Promise(fn)`的时候需要传一个函数进去，说明Promise的参数是一个函数
> 3. 构造函数传进去的`fn`会收到`resolve`和`reject`两个函数，用来表示Promise成功和失败，说明构造函数里面还需要`resolve`和`reject`这两个函数，这两个函数的作用是改变Promise的状态。
> 4. 根据规范，promise有`pending`，`fulfilled`，`rejected`三个状态，初始状态为`pending`，调用`resolve`会将其改为`fulfilled`，调用`reject`会改为`rejected`。
> 5. promise实例对象建好后可以调用`then`方法，而且是可以链式调用`then`方法，说明`then`是一个实例方法。简单的说就是`then`方法也必须返回一个带`then`方法的对象，可以是this或者新的promise实例。

<br/>

#### 类方法实现

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
      constructor(executor) {
         /**
         * 初始化 Promise 实例的状态为 PENDING，表示正在等待执行
         * 初始化 Promise 实例的结果为 NULL，表示没有结果返回
         * 初始化 Promise 实例的原因，用来处理 Promise 被 reject 时的错误信息
         * 初始化 Promise 的两个回调队列，用于存储 then 和 catch 的回调函数
         */
        this.state = PENDING;
        this.result = null;
        this.reason = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
      }
}
```

<br/>

#### 添加`resolve`和`reject`方法

```js
......
class MyPromise {
    	......
      constructor(executor) {
          ......
              // 缓存当前 Promise 实例的引用，以便在 resolve 和 reject 函数中使用
    var that = this;
    function resolve(value) {
      if (that.state === PENDING) {
        // 处理 value 值为 Promise 类型时的情况
        if(value instanceof MyPromise) {
          return value.then(resolve, reject);
        }
         /**
         * 设置 Promise 实例的状态为 FULFILLED，标记执行结束且没有遇到错误或异常
         * 设置 Promise 实例的结果为 value，表示成功执行并返回的结果
         * 遍历 onFulfilledCallbacks 队列，执行其中存储的所有回调函数，并传递 Promise 结果
         */
        that.state = FULFILLED;
        that.result = value;
        that.onFulfilledCallbacks.forEach((fn) => fn(that.result));
      }
    }
    function reject(reason) {
      if (that.state === PENDING) {
        /**
         * 设置 Promise 实例的状态为 REJECTED，标记执行结束且遇到错误或异常
         * 设置 Promise 实例的原因，记录错误信息，以便后续处理
         * 遍历 onRejectedCallbacks 队列，执行其中存储的所有回调函数，并传递错误原因
         */
        that.state = REJECTED;
        that.reason = reason;
        that.onRejectedCallbacks.forEach((fn) => fn(that.reason));
      }
    }
    try {
      // 立即执行 executor 函数，启动 Promise 的执行流程
      executor(resolve, reject);
    } catch (error) {
       /**
       * executor 执行过程中出错，调用 reject 处理错误
       * 这里的处理方式取决于具体的需求
       * 可以将错误信息传递给 reject 函数，让 Promise 进入 rejected 状态，也可以抛出错误，让 Promise 进入异常状态
       */
      reject(error);
      // throw error;
    } 
      }
}
```

<br/>

#### `then`方法及返回值

```js
......
class MyPromise {  
    ......
  then(onFulfilled, onRejected) {
    const relOnFulfilled =
      typeof onFulfilled !== "function"
        ? function (value) {
          value;
        }
        : onFulfilled;
    const relOnRejected =
      typeof onRejected !== "function"
        ? function (reason) {
          throw reason;
        }
        : onRejected;
    var that = this;
    if (this.state === FULFILLED) {
      const promise2 = new MyPromise(function (resolve, reject) {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(that.result);
            } else {
              const x = relOnFulfilled(that.result);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
            // throw error;
          }
      });
      return promise2;
    }
    else if (this.state === REJECTED) {
      const promise2 = new MyPromise(function (resolve, reject) {
          try {
            if (typeof onRejected !== "function") {
              reject(that.reason);
            } else {
              const x = relOnRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject); // 调用Promise 解决过程
            }
          } catch (error) {
            reject(error);
            // throw error;
          }
      });
      return promise2;
    } else {
      const promise2 = new MyPromise(function (resolve, reject) {
        that.onFulfilledCallbacks.push(function () {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(that.result);
              } else {
                const x = relOnFulfilled(that.result);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
              // throw error;
            }
        });
        that.onRejectedCallbacks.push(function () {
            try {
              if (typeof onRejected !== "function") {
                reject(that.reason);
              } else {
                const x = relOnRejected(that.reason);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
              // throw error;
            }
        });
      });
      return promise2;
    }
  }
}
```

<br/>

#### `Promise`的解决过程

```js
/**
 * 将给定的值解析为 Promise 对象，并根据值的类型执行相应的处理逻辑
 * 如果值是 Promise 对象，则等待其解决，并相应地解决或拒绝外部 Promise
 * 如果值是对象或函数，尝试获取其 then 属性，并根据 then 属性的行为决定如何解决或拒绝 Promise
 * 如果值不是上述情况，则直接解决 Promise
 * 这个函数用于解析 Promise 链中的链接值，确保正确地传递和处理 Promise 的结果
 *
 * @param {MyPromise} promise2 - 要解析其值的 Promise 对象
 * @param {any} x - 要被解析的值，可以是 Promise、对象、函数或其他类型
 * @param {Function} resolve - Promise 的解决函数，用于解决外部 Promise
 * @param {Function} reject - Promise 的拒绝函数，用于拒绝外部 Promise
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  if (x instanceof MyPromise) {
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
    // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
    return x.then(function (y) {
      resolvePromise(promise2, y, resolve, reject);
    }, reject);
    // 如果 x 为对象或者函数
  } else if (typeof x === "object" || typeof x === "function") {
     // 这个坑是跑测试的时候发现的，如果x是null，应该直接resolve
    if (x === null) {
      return resolve(x);
    }
    try {
      // 把 x.then 赋值给 then
      var then = x.then;
    } catch (e) {
      // throw e;
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(e);
    }
    // 如果 then 是函数
    if (typeof then === "function") {
      let called = false;
      // 将 x 作为函数的作用域 this 调用之
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          function (y) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;
        reject(error);
        // throw error;
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}
```

<br/>

#### `onFulfilled` 和 `onRejected` 的执行时机

规范中有一条：`onFulfilled` 和 `onRejected` 只有在执行环境堆栈仅包含**平台代码**时才可被调用

这一条的意思是实践中要确保 `onFulfilled` 和 `onRejected` 方法异步执行，且应该在 `then` 方法被调用的那一轮事件循环之后的新执行栈中执行。

所以在我们执行`onFulfilled` 和 `onRejected`的时候都应该包到`setTimeout`（因为兼容问题，所以这里使用`setTimeout`而没有使用`queueMicrotask`）里面去。

```js
......
class MyPromise {  
    ......
    
   /**
   * 为 Promise 对象添加一个 then 回调函数
   * 此函数将根据 Promise 的状态（fulfilled 或 rejected）执行相应的回调函数，并返回一个新的 Promise 对象，该对象将在回调函数执行完毕后解析
   * 如果 then 函数的参数不是函数，则忽略该参数
   *
   * @param {Function} onFulfilled - 当 Promise 成功时应执行的函数，接受 Promise 的结果作为参数
   * @param {Function} onRejected - 当 Promise 失败时应执行的函数，接受 Promise 的原因作为参数
   * @return {Promise} - 一个新的 Promise 对象，该对象将在回调函数执行完毕后解析
   */
  then(onFulfilled, onRejected) {
    const relOnFulfilled =
      typeof onFulfilled !== "function"
        ? function (value) {
          value;
        }
        : onFulfilled;
    const relOnRejected =
      typeof onRejected !== "function"
        ? function (reason) {
          throw reason;
        }
        : onRejected;
    var that = this;
    if (this.state === FULFILLED) {
      const promise2 = new MyPromise(function (resolve, reject) {
        setTimeout(function () {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(that.result);
            } else {
              const x = relOnFulfilled(that.result);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
            // throw error;
          }
        }, 0);
      });
      return promise2;
    }
    else if (this.state === REJECTED) {
      const promise2 = new MyPromise(function (resolve, reject) {
        setTimeout(function () {
          try {
            if (typeof onRejected !== "function") {
              reject(that.reason);
            } else {
              const x = relOnRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject); // 调用Promise 解决过程
            }
          } catch (error) {
            reject(error);
            // throw error;
          }
        }, 0);
      });
      return promise2;
    } else {
      const promise2 = new MyPromise(function (resolve, reject) {
        that.onFulfilledCallbacks.push(function () {
          setTimeout(function () {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(that.result);
              } else {
                const x = relOnFulfilled(that.result);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
              // throw error;
            }
          }, 0);
        });
        that.onRejectedCallbacks.push(function () {
          setTimeout(function () {
            try {
              if (typeof onRejected !== "function") {
                reject(that.reason);
              } else {
                const x = relOnRejected(that.reason);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
              // throw error;
            }
          }, 0);
        });
      });
      return promise2;
    }
  }
}
```

<br/>

#### 测试`MyPromise`

我们使用`Promise/A+`官方的测试工具[promises-aplus-tests](https://link.segmentfault.com/?enc=II4WxCm%2F1UB%2FC0P%2BdH6T%2FQ%3D%3D.ApkV27o5memvW3l7Yd0Z5M%2Fc%2BPc2vuTZ%2FRZTfktgY40EblrTVv%2BVrElSiV2dlr0hsLusQcA8%2BtABjlAnfv4dlQ%3D%3D)来对我们的`MyPromise`进行测试，要使用这个工具我们必须实现一个静态方法`deferred`，官方对这个方法的定义如下:

> `deferred`: 返回一个包含{ promise, resolve, reject }的对象
>
>  `promise` 是一个处于`pending`状态的promise
>
>  `resolve(value)` 用`value`解决上面那个`promise`
>
>  `reject(reason)` 用`reason`拒绝上面那个`promise`

```javascript
MyPromise.deferred = ()=> {
  var result = {};
  result.promise = new MyPromise(function(resolve, reject){
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
```

<br/>

然后用`npm`将`promises-aplus-tests`下载下来，再配置下`package.json`就可以跑测试了:

```json
{
  "name": "promise",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "promises-aplus-tests MyPromiseTest" // MyPromiseTest 是MyPromise模块的文件名
  },
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  },
}
```

<br/>

这个测试总共872用例，`MyPromise`完美通过了所有用例:

<img src="/img/promise_test.png" style="zoom:80%;" />

<br/>

#### 完整代码

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
     /**
     * 初始化 Promise 实例的状态为 PENDING，表示正在等待执行
     * 初始化 Promise 实例的结果为 NULL，表示没有结果返回
     * 初始化 Promise 实例的原因，用来处理 Promise 被 reject 时的错误信息
     * 初始化 Promise 的两个回调队列，用于存储 then 和 catch 的回调函数
     */
    this.state = PENDING;
    this.result = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    // 缓存当前 Promise 实例的引用，以便在 resolve 和 reject 函数中使用
    var that = this;
    function resolve(value) {
      if (that.state === PENDING) {
        // 处理 value 值为 Promise 类型时的情况
        if(value instanceof MyPromise) {
          return value.then(resolve, reject);
        }
         /**
         * 设置 Promise 实例的状态为 FULFILLED，标记执行结束且没有遇到错误或异常
         * 设置 Promise 实例的结果为 value，表示成功执行并返回的结果
         * 遍历 onFulfilledCallbacks 队列，执行其中存储的所有回调函数，并传递 Promise 结果
         */
        that.state = FULFILLED;
        that.result = value;
        that.onFulfilledCallbacks.forEach((fn) => fn(that.result));
      }
    }
    function reject(reason) {
      if (that.state === PENDING) {
        /**
         * 设置 Promise 实例的状态为 REJECTED，标记执行结束且遇到错误或异常
         * 设置 Promise 实例的原因，记录错误信息，以便后续处理
         * 遍历 onRejectedCallbacks 队列，执行其中存储的所有回调函数，并传递错误原因
         */
        that.state = REJECTED;
        that.reason = reason;
        that.onRejectedCallbacks.forEach((fn) => fn(that.reason));
      }
    }
    try {
      // 立即执行 executor 函数，启动 Promise 的执行流程
      executor(resolve, reject);
    } catch (error) {
       /**
       * executor 执行过程中出错，调用 reject 处理错误
       * 这里的处理方式取决于具体的需求
       * 可以将错误信息传递给 reject 函数，让 Promise 进入 rejected 状态，也可以抛出错误，让 Promise 进入异常状态
       */
      reject(error);
      // throw error;
    }
  }
   /**
   * 为 Promise 对象添加一个 then 回调函数
   * 此函数将根据 Promise 的状态（fulfilled 或 rejected）执行相应的回调函数，并返回一个新的 Promise 对象，该对象将在回调函数执行完毕后解析
   * 如果 then 函数的参数不是函数，则忽略该参数
   *
   * @param {Function} onFulfilled - 当 Promise 成功时应执行的函数，接受 Promise 的结果作为参数
   * @param {Function} onRejected - 当 Promise 失败时应执行的函数，接受 Promise 的原因作为参数
   * @return {Promise} - 一个新的 Promise 对象，该对象将在回调函数执行完毕后解析
   */
  then(onFulfilled, onRejected) {
    const relOnFulfilled =
      typeof onFulfilled !== "function"
        ? function (value) {
          value;
        }
        : onFulfilled;
    const relOnRejected =
      typeof onRejected !== "function"
        ? function (reason) {
          throw reason;
        }
        : onRejected;
    var that = this;
    if (this.state === FULFILLED) {
      const promise2 = new MyPromise(function (resolve, reject) {
        setTimeout(function () {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(that.result);
            } else {
              const x = relOnFulfilled(that.result);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
            // throw error;
          }
        }, 0);
      });
      return promise2;
    }
    else if (this.state === REJECTED) {
      const promise2 = new MyPromise(function (resolve, reject) {
        setTimeout(function () {
          try {
            if (typeof onRejected !== "function") {
              reject(that.reason);
            } else {
              const x = relOnRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject); // 调用Promise 解决过程
            }
          } catch (error) {
            reject(error);
            // throw error;
          }
        }, 0);
      });
      return promise2;
    } else {
      const promise2 = new MyPromise(function (resolve, reject) {
        that.onFulfilledCallbacks.push(function () {
          setTimeout(function () {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(that.result);
              } else {
                const x = relOnFulfilled(that.result);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
              // throw error;
            }
          }, 0);
        });
        that.onRejectedCallbacks.push(function () {
          setTimeout(function () {
            try {
              if (typeof onRejected !== "function") {
                reject(that.reason);
              } else {
                const x = relOnRejected(that.reason);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
              // throw error;
            }
          }, 0);
        });
      });
      return promise2;
    }
  }
   /**
   * 捕获 Promise 对象的错误，并将错误作为参数传递给 onRejected 回调函数
   * 此函数通过返回一个新的 Promise 对象来实现错误处理，新对象将在原 Promise 对象被拒绝时执行 onRejected 回调
   * 如果 cath 函数的参数不是函数，则创建一个默认的 onRejected 回调函数，该函数将错误作为参数抛出
   *
   * @param {Function} onRejected - 当 Promise 失败时应执行的函数，接受 Promise 的原因作为参数
   * @return {Promise} - 一个新的 Promise 对象，该对象将在原 Promise 对象被拒绝时执行 onRejected 回调
   */
  cath(onRejected){
    return this.then(null, onRejected);
  }
   /**
   * 在 Promise 链的末尾添加一个 finally 回调
   * finally 回调不接收任何参数，也不会影响 Promise 的状态或值
   * 其主要目的通常是在 Promise 链结束后执行清理或最终步骤
   *
   * @param {Function} onFinally - 当 Promise 链结束时应执行的函数，无论 Promise 是成功还是失败
   * @return {Promise} - 一个新的 Promise 对象，该对象将在原 Promise 对象结束后执行 onFinally 回调
   */
  finally(onFinally) {
    return this.then(
      function (value) {
        return MyPromise.resolve(onFinally?.()).then(function () {
          return value;
        });
      },
      function (reason) {
        return MyPromise.resolve(onFinally?.()).then(function () {
          throw reason;
        });
      }
    );
  }
  static resolve(parameter) {
    if (parameter instanceof MyPromise) {
      return parameter;
    } else {
      return new MyPromise(function (resolve) {
        resolve(parameter);
      });
    }
  }
  static reject(reason) {
    return new MyPromise(function (resolve, reject) {
      reject(reason);
    });
  }
  static all(promiseList) {
    return new MyPromise(function (resolve, reject) {
      const length = promiseList.length;
      let arr = [];
      let count = 0;
      if (length === 0) {
        resolve(arr);
      }
      // 遍历数组
      // 遍历数组的每一项
      for (let item of promiseList) {
        MyPromise.resolve(item).then(function (value) {
          arr.push(value);
          count++;
          if (count === length) {
            resolve(arr);
          }
        }, reject);
      }
    });
  }
  static race(promiseList) {
    return new MyPromise(function (resolve, reject) {
      const length = promiseList.length;
      if (length === 0) {
        return resolve();
      }
      for (let item of promiseList) {
        MyPromise.resolve(item).then(resolve, reject);
      }
    });
  }
  static allSettled(promiseList) {
    return new MyPromise(function (resolve, reject) {
      const length = promiseList.length;
      let arr = [];
      let count = 0;
      if (length === 0) {
        return resolve(arr);
      }
      for (let item of promiseList) {
        (function (item) {
          const currentPromise = MyPromise.resolve(item);
          currentPromise.then(
            function (value) {
              arr.push({ status: "fulfilled", value: value });
              count++;
              if (count === length) {
                return resolve(arr);
              }
            },
            function (reason) {
              arr.push({ status: "rejected", reason: reason });
              count++;
              if (count === length) {
                return resolve(arr);
              }
            }
          );
        })(item);
      }
    });
  }
}
MyPromise.deferred = function () {
  const result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

/**
 * 将给定的值解析为 Promise 对象，并根据值的类型执行相应的处理逻辑
 * 如果值是 Promise 对象，则等待其解决，并相应地解决或拒绝外部 Promise
 * 如果值是对象或函数，尝试获取其 then 属性，并根据 then 属性的行为决定如何解决或拒绝 Promise
 * 如果值不是上述情况，则直接解决 Promise
 * 这个函数用于解析 Promise 链中的链接值，确保正确地传递和处理 Promise 的结果
 *
 * @param {MyPromise} promise2 - 要解析其值的 Promise 对象
 * @param {any} x - 要被解析的值，可以是 Promise、对象、函数或其他类型
 * @param {Function} resolve - Promise 的解决函数，用于解决外部 Promise
 * @param {Function} reject - Promise 的拒绝函数，用于拒绝外部 Promise
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  if (x instanceof MyPromise) {
    return x.then(function (y) {
      resolvePromise(promise2, y, resolve, reject);
    }, reject);
  } else if (typeof x === "object" || typeof x === "function") {
    if (x === null) {
      return resolve(x);
    }
    // var then;
    try {
      var then = x.then;
    } catch (e) {
      // throw e;
      return reject(e);
    }
    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          function (y) {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) return;
        reject(error);
        // throw error;
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}
module.exports = MyPromise;
```

<br/>

## 总结

以上我自己实现的`MyPromise`并不是`Promise`源码，主要是理解`Promise`的实现逻辑，所以没有使用微任务。

1. `promise`的核心原理其实就是发布订阅模式，通过两个队列来缓存成功的回调（onResolve）和失败的回调（onReject）。
2. `then`方法是把正在`pending`状态的任务，将其回调函数`onFilfilled`和`onRejected`塞入了两个数组
3. `Promise`构造函数里面的`resolve`和`reject`方法，是将缓存在`onFilfilledCallbacks`和`onRejectedCallbacks`中的回调函数拿出来一一执行
4. `then`、`catch`和`finally`都会返回一个新的`Promise`，由此来实现链式调用