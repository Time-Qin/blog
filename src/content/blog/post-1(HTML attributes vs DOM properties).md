---
title: 'HTML标签属性与DOM原型属性'
description: 'HTML标签属性与DOM原型属性之间的区别(HTML attributes vs DOM properties)'
pubDate: '2024-7-10'
heroImage: 'https://picsum.photos/id/1/510/255.webp'
author: 'Ekko'
tags: ["html", "js","web"]
---

> <a href="https://jakearchibald.com/2024/attributes-vs-properties/" target="_blank">原文地址(本文为译文)</a>

`Attributes`和`properties`是完全不同的东西。可以将同名的`attributes`和`properties`设置为不同的值。比如说

```html
<div foo="bar">…</div>
<script>
  const div = document.querySelector('div[foo=bar]');

  console.log(div.getAttribute('foo')); // 'bar'
  console.log(div.foo); // undefined

  div.foo = 'hello world';

  console.log(div.getAttribute('foo')); // 'bar'
  console.log(div.foo); // 'hello world'
</script>
```
<br/>
似乎越来越少的开发人员知道这一点，部分原因要归功于框架:

```html
<input className="…" type="…" aria-label="…" value="…" />
```
如果使用框架的模板语言进行上述操作，那么就使用了类属性的语法，但是在底层，它有时会改为设置属性，而且在这种情况下，每个框架的设置是不同的。在某些情况下，它将设置一个属性和一个属性作为副作用，但这不是框架的错误
<br/>
<br/>
大多数时候，这些区别并不重要。我认为开发人员能够在不考虑属性和属性之间的差异的情况下拥有一个长期而愉快的职业生涯是件好事。但是，如果您需要在较低的层次上深入研究 DOM，了解这一点会很有帮助。即使你觉得你知道其中的区别，也许我会提到一些你没有考虑到的细节。那我们就开吃吧。

### 主要区别

在我们进入有趣的话题之前，让我们先来看看一些技术上的差异
<br/>

#### HTML 序列化
`Attributes`序列化为 HTML，而`property`不序列化.
<br/>

```jsx
const div = document.createElement('div');

div.setAttribute('foo', 'bar');
div.hello = 'world';

console.log(div.outerHTML); // <div foo="bar"></div>
```
<br/>

因此，当您查看浏览器开发工具中的元素面板时，您只能看到元素上的属性，而不能看到属性。
<br/>

#### value类型
为了在序列化格式下工作，`attributes`值总是字符串，而`property`可以是任何类型
<br/>

```jsx
const div = document.createElement('div');
const obj = { foo: 'bar' };

div.setAttribute('foo', obj);
console.log(typeof div.getAttribute('foo')); // 'string'
console.log(div.getAttribute('foo')); // '[object Object]'

div.hello = obj;
console.log(typeof div.hello); // 'object'
console.log(div.hello); // { foo: 'bar' }
```
<br/>

#### 属性名区分大小写
`attributes`名称不区分大小写，而`property`名称区分大小写
<br/>

```html
<div id="test" HeLlO="world"></div>
<script>
  const div = document.querySelector('#test');

  console.log(div.getAttributeNames()); // ['id', 'hello']

  div.setAttribute('FOO', 'bar');
  console.log(div.getAttributeNames()); // ['id', 'hello', 'foo']

  div.TeSt = 'value';
  console.log(div.TeSt); // 'value'
  console.log(div.test); // undefined
</script>
```
<br/>

但是，`attributes`值是区分大小写的。
好吧，事情开始变得模糊了:

### 内容映射
看看这个:
```html
<div id="foo"></div>
<script>
  const div = document.querySelector('#foo');

  console.log(div.getAttribute('id')); // 'foo'
  console.log(div.id); // 'foo'

  div.id = 'bar';

  console.log(div.getAttribute('id')); // 'bar'
  console.log(div.id); // 'bar'
</script>
```
<br/>

这似乎与文章中的第一个例子相矛盾，但是上面的例子之所以有效，是因为 `Element` 有一个 `id` getter & setter，它“映射”`id` `attributes`

当`property`映射`attributes`时，该`property`就是数据源。设置`property`时，它正在更新`attributes`。当您从`property`中读取时，它正在读取`attributes`

为了方便起见，大多数 specs 都会为每个已定义的`attributes`创建一个等价的`property`。在本文开头的示例中它不起作用，因为 `foo` 不是规范定义的`attributes`，所以没有映射它的规范定义的 `foo` `property`

下面是 `<ol>` 的规范。“ Content Attribute”部分定义`attributes`，“ DOM interface”部分定义`property`。如果您在 DOM 界面中单击`reversed`，它会将您带到这里
>`reversed` IDL 和`type` IDL 必须映射相同名称的各自内容`attributes`。

但是有些反射器更加复杂

#### 名称不同
这是相对次要的，但是有时`property`与它所映射的`attribute`有不同的名称。

在某些情况下，它只是添加您期望从`property`获得的小写property:
>- 在 `<img>` 上，`el.crossOrigin` 映射了 `crossorigin` attributes
>- 在所有元素中，`el.ariaLabel` 都映射了 `aria-label` attributes(aria 反射器在2023年末成为了跨浏览器。在此之前，您只能使用attributes)

<br/>

在某些情况下，由于旧的 JavaScript 保留字，名称不得不更改:
>- 对于所有元素，`el.className` 映射 `class` attribute
>- 在 `<label>` 上，`el.htmlFor` 映射了 `for` attribute

<br/>

#### 验证、类型强制和默认值
`property`带有验证和默认值，而`attributes`没有
```jsx
const input = document.createElement('input');

console.log(input.getAttribute('type')); // null
console.log(input.type); // 'text'

input.type = 'number';

console.log(input.getAttribute('type')); // 'number'
console.log(input.type); // 'number'

input.type = 'foo';

console.log(input.getAttribute('type')); // 'foo'
console.log(input.type); // 'text'
```
在这种情况下，验证由 getter `type`处理。Setter 允许无效的值`foo`，但是当 getter 看到无效的值或者没有值时，它返回`text`

某些`properties`执行类型强制转换:
```html
<details open>…</details>
<script>
  const details = document.querySelector('details');

  console.log(details.getAttribute('open')); // ''
  console.log(details.open); // true

  details.open = false;

  console.log(details.getAttribute('open')); // null
  console.log(details.open); // false

  details.open = 'hello';

  console.log(details.getAttribute('open')); // ''
  console.log(details.open); // true
</script>
```
在这种情况下，`open` `property`是一个布尔值，返回`attribute`是否存在。Setter 也强制类型-即使 setter 被赋予`“hello”`，它也会转换为布尔值，而不是直接转到`attribute`

像 `img.height` 这样的属性将属性值强制为一个数字。Setter 将传入值转换为数字，并将负值视为0

#### 输入的字段`value`
`value`是一种乐趣。有一个 `value`property和一个 `value` attribute。但是，`value`property不映射 `value` attribute。相反，`defaultValue`property映射 `value` attribute。

我知道，我知道。

事实上，`value` property并不映射任何attribute。这并不罕见，有很多这样的选项(`offsetWidth`、 `ParentNode`、`indeterminate`出于某种原因，在复选框上，以及更多)。

最初，`value` property服从 defaultValue property。然后，一旦通过 JavaScript 或用户交互设置了 `value` property，它就切换到一个内部值。就好像它的实现大致是这样的
```jsx
class HTMLInputElement extends HTMLElement {
  get defaultValue() {
    return this.getAttribute('value') ?? '';
  }

  set defaultValue(newValue) {
    this.setAttribute('value', String(newValue));
  }

  #value = undefined;

  get value() {
    return this.#value ?? this.defaultValue;
  }

  set value(newValue) {
    this.#value = String(newValue);
  }

  // This happens when the associated form resets
  formResetCallback() {
    this.#value = undefined;
  }
}
```
因此:
```html
<input type="text" value="default" />
<script>
  const input = document.querySelector('input');

  console.log(input.getAttribute('value')); // 'default'
  console.log(input.value); // 'default'
  console.log(input.defaultValue); // 'default'

  input.defaultValue = 'new default';

  console.log(input.getAttribute('value')); // 'new default'
  console.log(input.value); // 'new default'
  console.log(input.defaultValue); // 'new default'

  // Here comes the mode switch:
  input.value = 'hello!';

  console.log(input.getAttribute('value')); // 'new default'
  console.log(input.value); // 'hello!'
  console.log(input.defaultValue); // 'new default'

  input.setAttribute('value', 'another new default');

  console.log(input.getAttribute('value')); // 'another new default'
  console.log(input.value); // 'hello!'
  console.log(input.defaultValue); // 'another new default'
</script>
```

如果 `value` attribute被命名为 `defaultvalue`，那么这样做会更有意义。

### 属性应该用于配置

在我看来，attributes应该用于配置，而properties可以包含状态。我还认为 light-DOM 树应该只有一个所有者。

从这个意义上说，我认为` <input value>` 正确地解决了这个问题(除了命名以外)。`Value` attribute配置默认值，而 `value` property为您提供当前状态。

验证应用于获取/设置properties，而不应用于获取/设置attributes，这也是有意义的。

我之所以说“在我看来”，是因为最近的几个 HTML 元素的处理方式不同。

`<details>` 和 `<dialog>`元素通过 `open` attribute表示它们的 open 状态，浏览器将自动添加/删除这个attribute以响应用户交互。

我觉得这是个设计错误。它打破了attributes用于配置的思想，但更重要的是，它意味着负责维护 DOM (框架或普通的 JS)的系统需要为 DOM 自身的更改做好准备。

我认为应该是:

```html
<details defaultopen>…</details>
```

以及用于获取/设置当前状态的 `details.open` property，以及用于定位该状态的 CSS 伪类。

更新: Simon Peters 发现了一些关于这个问题的早期设计讨论。

我想`contenteditable`也违反了合同，但是... 好吧... 这是一个选择，在很多破坏。

### 框架如何处理这种差异
回到之前的例子:
```html
<input className="…" type="…" aria-label="…" value="…" />
```
框架如何处理这个问题？

#### Preact and VueJS
除了一组预定义的支持attributes的情况之外，如果 `proName in element`，那么它们将把prop设置为property，否则它们将设置一个attribute。基本上，他们更喜欢properties而不是attributes。它们的 render-to-string 方法则相反，并忽略仅property的内容。
<br/>
<a href="https://github.com/preactjs/preact/blob/aa95aa924dd5fe28798f2712acdabdc2e9fa38c9/src/diff/props.js#L37" target="_blank">setProperty in Preact.</a>
<br/>
<a href="https://github.com/vuejs/core/blob/958286e3f050dc707ad1af293e91bfb190bdb191/packages/runtime-dom/src/patchProp.ts#L69" target="_blank">shouldSetAsProp in VueJS.</a>

#### React

React的作法恰恰相反。除了一组预定义的偏好properties的情况之外，它们还将设置一个attribute。这使得它们的从渲染到字符串的方法在逻辑上非常相似。

这就解释了为什么自定义元素在 React 中似乎不起作用。因为它们是自定义的，它们的properties不在 React 的“预定义列表”中，所以它们被设置为attributes。任何只属于自定义元素的property都不会起作用。这将在 React 19中修复，在那里他们将切换到用于自定义元素的 Preact/VueJS 模型。

有趣的是，React 使用 `className` 而不是`class`来代替看起来像属性的attribute。但是，即使您使用的是property名而不是attribute名，React 也会在底层设置 `class`attribute。
<br/>
<a href="https://github.com/facebook/react/blob/699d03ce1a175442fe3443e1d1bed14f14e9c197/packages/react-dom-bindings/src/client/ReactDOMComponent.js#L349" target="_blank">setProp in React.</a>

#### lit-html
Lit 的做法有些不同:

```html
<input type="…" .value="…" />
```
它保持attributes和properties之间的区别，要求您在名称前面加上。如果希望设置property而不是attribute，则为
<br/>
<a href="https://lit.dev/docs/templates/expressions/" target="_blank">Lit's expression docs.</a>
