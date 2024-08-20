---
title: "js数组方法详细介绍"
description: "本文是记录前端使用js数组方法详细介绍"
pubDate: "2024-8-20"
heroImage: "https://picsum.photos/id/8/510/255.webp"
author: "Ekko"
tags: ["web", "js","array"]
---
## 静态方法

### Array.from()

从可迭代或类数组对象创建一个新的浅拷贝的数组实例。

> Array.from(arr,mapFn,this)
>
> arr -- 想要转换成数组的类数组或可迭代对象。
>
> mapFn(可选) --  调用数组每个元素的函数。如果提供，每个将要添加到数组中的值首先会传递给该函数，然后将 `mapFn` 的返回值增加到数组中
>
> this(可选) -- 执行 `mapFn` 时用作 `this` 的值。

```js
console.log(Array.from('foo'));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x));
// Expected output: Array [2, 4, 6]
```

<br/>

### Array.fromAsync()-2024新方法

可以由一个异步可迭代对象、可迭代对象或类数组对象创建一个新的、浅拷贝的 Array 实例。

```js
Array.fromAsync(
  new Map([
    [1, 2],
    [3, 4],
  ]),
).then((array) => console.log(array));
// [[1, 2], [3, 4]]
```

<br/>

### Array.isArray()

用于确定传递的值是否是一个数组。

```js
console.log(Array.isArray([1, 3, 5]));
// Expected output: true

console.log(Array.isArray('[]'));
// Expected output: false

console.log(Array.isArray(new Array(5)));
// Expected output: true

console.log(Array.isArray(new Int16Array([15, 33])));
// Expected output: false
```

<br/>

### Array.of()

通过可变数量的参数创建一个新的 Array 实例，而不考虑参数的数量或类型。

```js
console.log(Array.of('foo', 2, 'bar', true));
// Expected output: Array ["foo", 2, "bar", true]

console.log(Array.of());
// Expected output: Array []
```



## 实例方法

### Array.prototype.at()

方法接收一个整数值并返回该索引对应的元素，允许正数和负数。负整数从数组中的最后一个元素开始倒数。

```js
const array1 = [5, 12, 8, 130, 44];

let index = 2;

console.log(`An index of ${index} returns ${array1.at(index)}`);
// Expected output: "An index of 2 returns 8"

index = -2;

console.log(`An index of ${index} returns ${array1.at(index)}`);
// Expected output: "An index of -2 returns 130"
```

<br/>

### Array.prototype.concat()

方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

```js
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array3);
// Expected output: Array ["a", "b", "c", "d", "e", "f"]
```

<br/>

### Array.prototype.copyWithin()

方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。

> copyWithin(target, start, end)
>
> target -- 序列开始替换的目标位置，以 0 为起始的下标表示，且将被转换为整数
>
> - 负索引将从数组末尾开始计数——如果 `target < 0`，则实际是 `target + array.length`。
> - 如果 `target < -array.length`，则使用 `0`。
> - 如果 `target >= array.length`，则不会拷贝任何内容。
> - 如果 `target` 位于 `start` 之后，则复制只会持续到 `array.length` 结束（换句话说，`copyWithin()` 永远不会扩展数组）。
>
> start -- 要复制的元素序列的起始位置，以 0 为起始的下标表示，且将被转换为整数
>
> - 负索引将从数组末尾开始计数——如果 `start < 0`，则实际是 `start + array.length`。
> - 如果省略 `start` 或 `start < -array.length`，则默认为 `0`。
> - 如果 `start >= array.length`，则不会拷贝任何内容。
>
> end -- 要复制的元素序列的结束位置，以 0 为起始的下标表示，且将被转换为整数。copyWithin 将会拷贝到该位置，但不包括 end 这个位置的元素。
>
> - 负索引将从数组末尾开始计数——如果 `end < 0`，则实际是 `end + array.length`。
> - 如果 `end < -array.length`，则使用`0`。
> - 如果省略 `end` 或 `end >= array.length`，则默认为 `array.length`，这将导致直到数组末尾的所有元素都被复制。
> - 如果 `end` 位于 `start` 之前，则不会拷贝任何内容。

<br/>

```js
const array1 = ['a', 'b', 'c', 'd', 'e'];

// Copy to index 0 the element at index 3
console.log(array1.copyWithin(0, 3, 4));
// Expected output: Array ["d", "b", "c", "d", "e"]

// Copy to index 1 all elements from index 3 to the end
console.log(array1.copyWithin(1, 3));
// Expected output: Array ["d", "d", "e", "d", "e"]
```

<br/>

### Array.prototype.entries()

方法返回一个新的数组迭代器对象，该对象包含数组中每个索引的键/值对

```js
const array1 = ['a', 'b', 'c'];

const iterator1 = array1.entries();

console.log(iterator1.next().value);
// Expected output: Array [0, "a"]

console.log(iterator1.next().value);
// Expected output: Array [1, "b"]
```

<br/>

### Array.prototype.every()

方法测试一个数组内的所有元素是否都能通过指定函数的测试。它返回一个布尔值。

```js
const isBelowThreshold = (currentValue) => currentValue < 40;

const array1 = [1, 30, 39, 29, 10, 13];

console.log(array1.every(isBelowThreshold));
// Expected output: true
```

<br/>

### Array.prototype.fill()

方法用一个固定值填充一个数组中从起始索引（默认为 `0`）到终止索引（默认为 `array.length`）内的全部元素。它返回修改后的数组。

> fill(value, start, end)
>
> value -- 用来填充数组元素的值。注意所有数组中的元素都将是这个确定的值：如果 `value` 是个对象，那么数组的每一项都会引用这个元素。
>
> start -- 基于零的索引，从此开始填充，转换为整数。
>
> - 负数索引从数组的末端开始计算，如果 `start < 0`，则使用 `start + array.length`。
> - 如果 `start < -array.length` 或 `start` 被省略，则使用 `0`。
> - 如果 `start >= array.length`，没有索引被填充。
>
> end -- 基于零的索引，在此结束填充，转换为整数。fill() 填充到但不包含 end 索引。
>
> - 负数索引从数组的末端开始计算，如果 `end < 0`，则使用 `end + array.length`。
> - 如果 `end < -array.length`，则使用 `0`。
> - 如果 `end >= array.length` 或 `end` 被省略，则使用 `array.length`，导致所有索引都被填充。
> - 如果经标准化后，`end` 的位置在 `start` 之前或之上，没有索引被填充。

<br/>

```js
const array1 = [1, 2, 3, 4];

// Fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// Expected output: Array [1, 2, 0, 0]

// Fill with 5 from position 1
console.log(array1.fill(5, 1));
// Expected output: Array [1, 5, 5, 5]

console.log(array1.fill(6));
// Expected output: Array [6, 6, 6, 6]
```

<br/>

### Array.prototype.filter()

方法创建给定数组一部分的浅拷贝，其包含通过所提供函数实现的测试的所有元素。

```js
const words = ['spray', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter((word) => word.length > 6);

console.log(result);
// Expected output: Array ["exuberant", "destruction", "present"]
```

<br/>

### Array.prototype.find()

方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

```js
const array1 = [5, 12, 8, 130, 44];

const found = array1.find((element) => element > 10);

console.log(found);
// Expected output: 12
```

<br/>

### Array.prototype.findIndex()

方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

```js
const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber));
// Expected output: 3
```

<br/>

### Array.prototype.findLast()-2022新方法

方法反向迭代数组，并返回满足提供的测试函数的第一个元素的值。如果没有找到对应元素，则返回 undefined。

```js
const array1 = [5, 12, 50, 130, 44];

const found = array1.findLast((element) => element > 45);

console.log(found);
// Expected output: 130
```

<br/>

### Array.prototype.findLastIndex()-2022新方法

 方法反向迭代数组，并返回满足所提供的测试函数的第一个元素的索引。若没有找到对应元素，则返回 -1。

```js
const array1 = [5, 12, 50, 130, 44];

const isLargeNumber = (element) => element > 45;

console.log(array1.findLastIndex(isLargeNumber));
// Expected output: 3
// Index of element with value: 130
```

<br/>

### Array.prototype.flat()

 方法创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中。

```js
const arr1 = [0, 1, 2, [3, 4]];

console.log(arr1.flat());
// expected output: Array [0, 1, 2, 3, 4]

const arr2 = [0, 1, [2, [3, [4, 5]]]];

console.log(arr2.flat());
// expected output: Array [0, 1, 2, Array [3, Array [4, 5]]]

console.log(arr2.flat(2));
// expected output: Array [0, 1, 2, 3, Array [4, 5]]

console.log(arr2.flat(Infinity));
// expected output: Array [0, 1, 2, 3, 4, 5]

```

<br/>

### Array.prototype.flatMap()

 方法对数组中的每个元素应用给定的回调函数，然后将结果展开一级，返回一个新数组。它等价于在调用 map() 方法后再调用深度为 1 的 flat() 方法（arr.map(...args).flat()），但比分别调用这两个方法稍微更高效一些。

```js
const arr1 = [1, 2, 1];

const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));

console.log(result);
// Expected output: Array [1, 2, 2, 1]
```

<br/>

### Array.prototype.forEach()

方法对数组的每个元素执行一次给定的函数。

```js
const array1 = ['a', 'b', 'c'];

array1.forEach((element) => console.log(element));

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
```

<br/>

### Array.prototype.includes()

方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 `true`，否则返回 `false`。

> includes(searchElement, fromIndex)
>
> searchElement -- 需要查找的值。
>
> fromIndex(可选) -- 开始搜索的索引（从零开始），会转换为整数
>
> - 负索引从数组末尾开始计数——如果 `fromIndex < 0`，那么实际使用的是 `fromIndex + array.length`。然而在这种情况下，数组仍然从前往后进行搜索。
> - 如果 `fromIndex < -array.length` 或者省略 `fromIndex`，则使用 `0`，这将导致整个数组被搜索。
> - 如果 `fromIndex >= array.length`，则不会搜索数组并返回 `false`。

<br/>

```js
const array1 = [1, 2, 3];

console.log(array1.includes(2));
// Expected output: true

const pets = ['cat', 'dog', 'bat'];

console.log(pets.includes('cat'));
// Expected output: true

console.log(pets.includes('at'));
// Expected output: false
```

<br/>

### Array.prototype.indexOf()

方法返回数组中第一次出现给定元素的下标，如果不存在则返回 -1。

> indexOf(searchElement, fromIndex) -- 参数定义和includes方法一样

```js
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];

console.log(beasts.indexOf('bison'));
// Expected output: 1

// Start from index 2
console.log(beasts.indexOf('bison', 2));
// Expected output: 4

console.log(beasts.indexOf('giraffe'));
// Expected output: -1

```

<br/>

### Array.prototype.join()

方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串，用逗号或指定的分隔符字符串分隔。如果数组只有一个元素，那么将返回该元素而不使用分隔符。

```js
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// Expected output: "Fire,Air,Water"

console.log(elements.join(''));
// Expected output: "FireAirWater"

console.log(elements.join('-'));
// Expected output: "Fire-Air-Water"
```

<br/>

### Array.prototype.keys()

方法返回一个新的数组迭代器对象，其中包含数组中每个索引的键。

```js
const array1 = ['a', 'b', 'c'];
const iterator = array1.keys();

for (const key of iterator) {
  console.log(key);
}

// Expected output: 0
// Expected output: 1
// Expected output: 2
```

<br/>

### Array.prototype.lastIndexOf()

方法返回数组中给定元素最后一次出现的索引，如果不存在则返回 -1。该方法从 `fromIndex` 开始向前搜索数组。

```js
const animals = ['Dodo', 'Tiger', 'Penguin', 'Dodo'];

console.log(animals.lastIndexOf('Dodo'));
// Expected output: 3

console.log(animals.lastIndexOf('Tiger'));
// Expected output: 1
```

<br/>

### Array.prototype.map()

方法**创建一个新数组**，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

```js
const array1 = [1, 4, 9, 16];

// Pass a function to map
const map1 = array1.map((x) => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]
```

<br/>

### Array.prototype.pop()

方法从数组中删除**最后一个**元素，并返回该元素的值。此方法会更改数组的长度。

```js
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];

console.log(plants.pop());
// Expected output: "tomato"

console.log(plants);
// Expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]

plants.pop();

console.log(plants);
// Expected output: Array ["broccoli", "cauliflower", "cabbage"]
```

<br/>

### Array.prototype.push()

方法将指定的元素添加到数组的末尾，并返回新的数组长度。

```js
const animals = ['pigs', 'goats', 'sheep'];

const count = animals.push('cows');
console.log(count);
// Expected output: 4
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows"]

animals.push('chickens', 'cats', 'dogs');
console.log(animals);
// Expected output: Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
```

<br/>

### Array.prototype.reduce()

方法对数组中的每个元素按序执行一个提供的 **reducer** 函数，每一次运行 **reducer** 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

第一次执行回调函数时，不存在“上一次的计算结果”。如果需要回调函数从数组索引为 0 的元素开始执行，则需要传递初始值。否则，数组索引为 0 的元素将被用作初始值，迭代器将从第二个元素开始执行（即从索引为 1 而不是 0 的位置开始）。

```js
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
// Expected output: 10
```

<br/>

### Array.prototype.reduceRight()

方法对累加器（accumulator）和数组的每个值（按从右到左的顺序）应用一个函数，并使其成为单个值。

```js
const array1 = [
  [0, 1],
  [2, 3],
  [4, 5],
];

const result = array1.reduceRight((accumulator, currentValue) =>
  accumulator.concat(currentValue),
);

console.log(result);
// Expected output: Array [4, 5, 2, 3, 0, 1]
```

<br/>

### Array.prototype.reverse()

方法就地反转数组中的元素，并返回同一数组的引用。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。换句话说，数组中的元素顺序将被翻转，变为与之前相反的方向。

```js
const array1 = ['one', 'two', 'three'];
console.log('array1:', array1);
// Expected output: "array1:" Array ["one", "two", "three"]

const reversed = array1.reverse();
console.log('reversed:', reversed);
// Expected output: "reversed:" Array ["three", "two", "one"]

// Careful: reverse is destructive -- it changes the original array.
console.log('array1:', array1);
// Expected output: "array1:" Array ["three", "two", "one"]
```

<br/>

### Array.prototype.shift()

方法从数组中删除**第一个**元素，并返回该元素的值。此方法更改数组的长度。

```js
const array1 = [1, 2, 3];

const firstElement = array1.shift();

console.log(array1);
// Expected output: Array [2, 3]

console.log(firstElement);
// Expected output: 1

```

<br/>

### Array.prototype.slice()

方法返回一个新的数组对象，这一对象是一个由 start 和 end 决定的原数组的浅拷贝（包括 start，不包括 end），其中 start 和 end 代表了数组元素的索引。原始数组不会被改变

```js
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// Expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2));
// Expected output: Array ["duck", "elephant"]

console.log(animals.slice(2, -1));
// Expected output: Array ["camel", "duck"]

console.log(animals.slice());
// Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]
```

<br/>

### Array.prototype.some()

方法测试数组中是否至少有一个元素通过了由提供的函数实现的测试。如果在数组中找到一个元素使得提供的函数返回 true，则返回 true；否则返回 false。它不会修改数组。

```js
const array = [1, 2, 3, 4, 5];

// Checks whether an element is even
const even = (element) => element % 2 === 0;

console.log(array.some(even));
// Expected output: true
```

<br/>

### Array.prototype.sort()

方法就地对数组的元素进行排序，并返回对相同数组的引用。默认排序是将元素转换为字符串，然后按照它们的 UTF-16 码元值升序排序。

```js
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
// Expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// Expected output: Array [1, 100000, 21, 30, 4]
```

<br/>

### Array.prototype.splice()

方法就地移除或者替换已存在的元素和/或添加新的元素

> splice(start, deleteCount, item1, ...itemN)
>
> start -- 从 0 开始计算的索引，表示要开始改变数组的位置，它会被转换成整数。
>
> - 负索引从数组末尾开始计算——如果 `-buffer.length <= start < 0`，使用 `start + array.length`。
> - 如果 `start < -array.length`，使用 `0`。
> - 如果 `start >= array.length`，则不会删除任何元素，但是该方法会表现为添加元素的函数，添加所提供的那些元素。
> - 如果 `start` 被省略了（即调用 `splice()` 时不传递参数），则不会删除任何元素。这与传递 `undefined` 不同，后者会被转换为 `0`。
>
> deleteCount -- 一个整数，表示数组中要从 `start` 开始删除的元素数量。
>
> - 如果省略了 `deleteCount`，或者其值大于或等于由 `start` 指定的位置到数组末尾的元素数量，那么从 `start` 到数组末尾的所有元素将被删除。但是，如果你想要传递任何 `itemN` 参数，则应向 `deleteCount` 传递 `Infinity` 值，以删除 `start` 之后的所有元素，因为显式的 `undefined` 会[转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number#整数转换)为 `0`。
> - 如果 `deleteCount` 是 `0` 或者负数，则不会移除任何元素。在这种情况下，你应该至少指定一个新元素（请参见下文）。
>
> item1, ...itemN -- 从 `start` 开始要加入到数组中的元素。
>
> - 如果不指定任何元素，`splice()` 将只从数组中删除元素。

<br/>

```js
const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb');
// Inserts at index 1
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May');
// Replaces 1 element at index 4
console.log(months);
// Expected output: Array ["Jan", "Feb", "March", "April", "May"]
```

<br/>

### Array.prototype.tolocaleString()

方法返回一个字符串，表示数组中的所有元素。每个元素通过调用它们自己的 toLocaleString 方法转换为字符串，并且使用特定于语言环境的字符串（例如逗号“,”）分隔开。

> toLocaleString(locales, options)
>
> locales -- 带有 BCP 47 语言标签的字符串，或者此类字符串的数组。对于 locales 参数的一般形式和说明，可以参见 [`Intl` 主页面的参数说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_参数)
>
> options -- 一个具有配置属性的对象。对于数字，请参见 [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)；对于日期，请参见 [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)。

```js
const array1 = [1, 'a', new Date('21 Dec 1997 14:12:00 UTC')];
const localeString = array1.toLocaleString('en', { timeZone: 'UTC' });

console.log(localeString);
// Expected output: "1,a,12/21/1997, 2:12:00 PM",
// This assumes "en" locale and UTC timezone - your results may vary
```

<br/>

### Array.prototype.toReversed()-2023新方法

实例的 toReversed() 方法是 reverse() 方法对应的复制版本。它返回一个元素顺序相反的新数组。

```js
const items = [1, 2, 3];
console.log(items); // [1, 2, 3]

const reversedItems = items.toReversed();
console.log(reversedItems); // [3, 2, 1]
console.log(items); // [1, 2, 3]
```

<br/>

### Array.prototype.toSorted()-2023新方法

实例的 toSorted() 方法是 sort() 方法的复制方法版本。它返回一个新数组，其元素按升序排列。

```js
// 不传入函数
toSorted()

// 传入箭头函数
toSorted((a, b) => { /* … */ })

// 传入比较函数
toSorted(compareFn)

// 內联比较函数
toSorted(function compareFn(a, b) { /* … */ })
```

<br/>

### Array.prototype.toSpliced()-2023新方法

实例的 toSpliced() 方法是 splice() 方法的复制版本。它返回一个新数组，并在给定的索引处删除和/或替换了一些元素。

```js
toSpliced(start)
toSpliced(start, deleteCount)
toSpliced(start, deleteCount, item1)
toSpliced(start, deleteCount, item1, item2, itemN)
```

<br/>

### Array.prototype.toString()

方法返回一个字符串，表示指定的数组及其元素。

```js
const array1 = [1, 2, 'a', '1a'];

console.log(array1.toString());
// Expected output: "1,2,a,1a"
```

<br/>

### Array.prototype.unShift()

方法将指定元素添加到数组的开头，并返回数组的新长度。

```js
const array1 = [1, 2, 3];

console.log(array1.unshift(4, 5));
// Expected output: 5

console.log(array1);
// Expected output: Array [4, 5, 1, 2, 3]
```

<br/>

### Array.prototype.values()

方法返回一个新的数组迭代器对象，该对象迭代数组中每个元素的值。

```js
const array1 = ['a', 'b', 'c'];
const iterator = array1.values();

for (const value of iterator) {
  console.log(value);
}

// Expected output: "a"
// Expected output: "b"
// Expected output: "c"
```

<br/>

### Array.prototype.with()-2023新方法

实例的 with() 方法是使用方括号表示法修改指定索引值的复制方法版本。它会返回一个新数组，其指定索引处的值会被新值替换。

> with(index, value)
>
> index -- 要修改的数组索引（从 0 开始），将会转换为整数。
>
> - 负数索引会从数组末尾开始计数——即当 `index < 0` 时，会使用 `index + array.length`。
> - 如果规范化后的索引超出数组边界，会抛出 [`RangeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RangeError)。
>
> value -- 要分配给指定索引的任何值。

```js
arrayInstance.with(index, value)
```
