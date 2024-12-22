---
title: 使用memo或PureComponent前的思考
category: React
---

在我们编写 react 组件的时候，尽可能的拆分组件。而针对一些静态组件或没有 props 的组件，我们可以使用`React.memo`或者`React.useMemo`来避免不必要的更新。

###　一个渲染缓慢的组件

```jsx
import { useState } from "react";

function ExpensiveTree() {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
}

const Demo = () => {
  let [color, setSolor] = useState("red");
  return (
    <>
      <input
        type="color"
        value={color}
        onChange={(e) => setSolor(e.target.value)}
        style={{ display: "inline-block", marginLeft: 600 }}
      />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </>
  );
};

export default Demo;
```

现在我们来分析一波，在 App 组件中，当 color 改变时，导致 ExpensiveTree 组件也会更新。

遇到这种情况，我们第一反应是不是使用 [React.mmo](https://react.docschina.org/docs/react-api.html#reactmemo)包装一下？或是将 class 组件改为[React.PureComponent](https://react.docschina.org/docs/react-api.html#reactpurecomponent)继承啦？

```jsx
import { memo, PureComponent } from "react";

// 函数组件 使用memo
const ExpensiveTree = memo(() => {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
});

// class 组件 继承PureComponent
class ExpensiveTree extends PureComponent {
  render() {
    return <p>I am a very slow component tree.</p>;
  }
}
```

或许，我们应该从 React 本质来思考问题，我们写的组件还能不能再优化啦？

### 解法一：向下移动 state

```jsx
import { useState } from "react";

const ExpensiveTree = memo(() => {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
});

// 向下移动State
function App() {
  let [color, setSolor] = useState("red");
  return (
    <>
      <input
        type="color"
        value={color}
        onChange={(e) => setSolor(e.target.value)}
        style={{ display: "inline-block", marginLeft: 600 }}
      />
      <p style={{ color }}>Hello, world!</p>
    </>
  );
}

const Demo = () => {
  return (
    <>
      <App />
      <ExpensiveTree />
    </>
  );
};

export default Demo;
```

当一部分 state 在高开销树的上层代码中使用时上述解法就无法奏效了。 比如，Demo 组件也需要 App 中的 color 状态，那这样便不可解决问题了？或者说又回到了 memo 和 PureComponent 上了啦？我们先来看看 Demo 组件的情况。

```jsx
const ExpensiveTree = () => {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
};

const Demo = () => {
  let [color, setSolor] = useState("red");
  return (
    <div style={{ color }}>
      <input
        type="color"
        value={color}
        onChange={(e) => setSolor(e.target.value)}
        style={{ display: "inline-block", marginLeft: 600 }}
      />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </div>
  );
};
```

### 解法二：内容提升

```jsx
import React, { useState } from "react";

const ExpensiveTree = () => {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
};

// 内容提升
function ColorPicker({ children }) {
  let [color, setSolor] = useState("red");
  return (
    <div style={{ color }}>
      <input
        type="color"
        value={color}
        onChange={(e) => setSolor(e.target.value)}
        style={{ display: "inline-block", marginLeft: 600 }}
      />
      <p>当前的字体颜色</p>
      {children}
    </div>
  );
}

const Demo = () => {
  return (
    <ColorPicker>
      <p>--父组件内容--</p>
      <ExpensiveTree />
    </ColorPicker>
  );
};

export default Demo;
```

ExpensiveTree 组件不会重新渲染的根本原因是，ColorPicker 组件中 color 改变后组件更新时 children 仍然保存着上一次从`Demo`中拿到的相同的`children`属性 。

### 总结

React 组件的更新，只有 props 或 state 改变才会触发。

- [React.PureComponent](https://react.docschina.org/docs/react-api.html#reactpurecomponent)
- [React.memo](https://react.docschina.org/docs/react-api.html#reactmemo)

- ### [在你写 memo()之前](https://overreacted.io/zh-hans/before-you-memo/)

- [React.useMemo](https://react.docschina.org/docs/hooks-reference.html#usememo)
