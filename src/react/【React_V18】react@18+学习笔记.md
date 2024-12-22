---
title: React@18 新特性
category: React
---

### React 18

- [Automatic batching 自动批处理](./[性能优化]React.flushSync处理异步批量setState导致多次更新.md)
- New APIS

  - concurrent features
    - [React.startTransition()](https://reactjs.org/docs/react-api.html#starttransition)
    - [useDeferredValue()](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue)
    - [useTransition()](https://reactjs.org/docs/hooks-reference.html#usetransition)
  - mostly for libraries
    - [useId()](https://reactjs.org/docs/hooks-reference.html#useid)
    - [useSyncExternalStore()](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore)

- Suspense on the server

### react-dom 18

- New Render API
  - [ReactDOM.createRoot](https://reactjs.org/docs/react-dom-client.html#createroot):需要将`ReactDOM.render`切换到`ReactDOM。createRoot`

[官方演示视频](https://www.youtube.com/watch?v=ytudH8je5ko)
