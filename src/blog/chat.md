---
title: 聊天上下文
---

### 1. 滚动边界确定

- [JavaScript 判断元素是否在可视区域的方法](https://github.com/kangduu/camp/issues/65)
- [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

- Observer API 实现

  ```tsx
  import { useLayoutEffect, useRef, type PropsWithChildren } from "react";
  import { useScrollObserverCtx } from "../context";

  // placeholder element
  const PlaceholderKeys = { up: "upstairs", down: "downstairs" };
  const ElementPlaceholder = ({ className }: ComponentCSSProps) => <div className={className} style={{ height: 1, visibility: "hidden" }} />;

  let observer: IntersectionObserver = null;
  export default function ScrollObserver({ children }: PropsWithChildren<{}>) {
    const { refresh } = useScrollObserverCtx(); // 详解 2
    const ContainerRef = useRef(null);

    // mount
    useLayoutEffect(() => {
      const container = ContainerRef.current;
      const upTarget = container.querySelector(`div.${PlaceholderKeys.up}`),
        downTarget = container.querySelector(`div.${PlaceholderKeys.down}`);

      // observe
      observer = new IntersectionObserver(
        function (entires) {
          const state = entires.reduce(
            (prev, curr) => {
              const classList = curr.target.classList;
              const isIntersecting = curr.isIntersecting;
              if (classList.contains(PlaceholderKeys.up) && isIntersecting) prev.upward = true;
              if (classList.contains(PlaceholderKeys.down) && isIntersecting) prev.downward = true;
              return prev;
            },
            { upward: false, downward: false }
          );
          refresh(state);
        },
        { root: container, threshold: 1.0 }
      );
      observer.observe(upTarget);
      observer.observe(downTarget);

      // unobserve
      return () => (observer = null);
    }, []);

    return (
      <div style={{ overflow: "auto", height: "100%", padding: "0 24px" }} ref={ContainerRef}>
        <ElementPlaceholder className={PlaceholderKeys.up} />
        {children}
        <ElementPlaceholder className={PlaceholderKeys.down} />
      </div>
    );
  }
  ```

### 2. 使用`useContext`管理状态，确保 `new IntersectionObserver` 只在组件 mount 执行一次即可

```tsx
// context.tsx

import { createContext, useContext } from "react";
export interface ScrollObserverState {
  upward: boolean;
  downward: boolean;
}
export interface ScrollObserverContext {
  state: ScrollObserverState;
  refresh: (value: ScrollObserverState) => void;
}
export const ScrollObserverInitialState = {
  upward: false,
  downward: false,
};
export const ScrollObserverCtx = createContext<ScrollObserverContext>({
  state: ScrollObserverInitialState,
  refresh: (value) => {
    console.log(value);
  },
});
export const useScrollObserverCtx = () => useContext(ScrollObserverCtx);
```

### 3. 滚动加载内容

获取 context 状态，判断上下滚动

```tsx
// index.tsx

export default function () {
 const loadPreviousData = (current) => {
   // other feature ...

   scrollTargetIntoView(current, 'start')
 }

 const loadNextData = (current) => {
   // other feature ...

   scrollTargetIntoView(current, 'end')
 }

  // 向上或向下滚动
  const [scrollState, setScrollState] = useState<ScrollObserverState>(
    ScrollObserverInitialState
  );
  const refreshScrollState = useCallback(setScrollState,[]);

  useEffect(() => {
    const pending = loading > 0;
    // 向上滚动
    if (scrollState.upward && !pending) {
      const first = list[0];
      if (first) {
        setScrollState(ScrollObserverInitialState);
        loadPreviousData(first); // 加载数据
      }
    }
    // 向下滚动
    if (scrollState.downward && !pending) {
      const last = list[list.length - 1];
      if (last) {
        setScrollState(ScrollObserverInitialState);
        loadNextData(last); // 加载数据
      }
    }
  }, [scrollState, loading, list]);

  const ScrollEleWrapper = useRef(null);

  return (
    <ScrollObserverCtx.Provider
      value={{ state: scrollState, refresh: refreshScrollState }}
    >
      <section
        style={{ height: 400, position: "relative",}} // 高度固定，且用来矫正滚动 详见 4
        ref={ScrollEleWrapper}
      >
        <ScrollObserver>
           <!--  实际渲染的内容 -->
        </ScrollObserver>
      </section>
    </ScrollObserverCtx.Provider>
  );
}
```

### 4. 数据加载后滚动到可视区域

```tsx
const ScrollEleWrapper = useRef(null);
const scrollTargetIntoView = (target, block?: ScrollLogicalPosition) => {
  if (!target) return;
  function intoView() {
    const ScrollElement: HTMLUListElement = scroll_ref?.current;
    const TargetElement: HTMLLIElement = ScrollElement?.querySelector?.(`#${target?.id}`);

    if (TargetElement) {
      const _block = block !== undefined ? block : "end";
      // 【1】
      // ! 当调用子元素内目标元素的 scrollIntoView() 时，浏览器默认会逐级向上遍历所有可滚动的祖先容器（包括 body），并调整它们的滚动位置以确保目标元素在视口中可见。
      TargetElement.scrollIntoView({ block: _block });
    }

    // 矫正祖先元素滚动导致当前上下文展示错误问题 【1】
    ScrollEleWrapper.current?.scrollIntoView?.({ block: "center" });
  }

  // 这里也很重要
  window.requestAnimationFrame(intoView);
};
```
