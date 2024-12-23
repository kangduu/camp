---
title: Vue高级实战技巧
category: Vue
---

## 权限控制（自定义指令）

你是否还是使用`display:none` 控制权限按钮的显示，或者使用`v-if/v-else` 。现在你可以尝试使用[`自定义指令【vue.directive()】`](https://vuejs.bootcss.com/guide/custom-directive.html)

思考，后台如何传对应的权限给你？（数组）。下面我们模拟一个后台返回的数据。

- permission.js（检查是否有权限）

 ```js
export function checkArr(key) {
  let arr = ['101', '211', '302', '404', 'other']; // 后端返回的权限数组
  const hasIndex = arr.indexOf(key)
  return hasIndex > -1 ? true : false
}
 ```

- main.js

```js
// ... 
import { checkArr } from './common/array'
Vue.directive('display-key', {
  inserted(el, binding) {
    // 元素上绑定的值，如 <input v-bind:value = '1' />
    let displayKey = binding.value;
    if (displayKey) {
      let permission = checkArr(displayKey);
      //无权限则不显示
      if (!permission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // 抛出异常
      throw new Error(`你需要设置一个指令！如：v-display-key="'2'"`)
    }
  }
})
// ... 
```

- 组件使用

```vue
<template>
<div>
  <button v-display-key="'2111'">支付</button> <!-- 不会显示 -->
  </div>
</template>
<!-- 其它内容 -->
```

## 主路由动态引入

我们在实际开发中，业务往往都是分模块，分功能的。比如，登录、课程、作业、商品列表等，像这样的情况我们就需要`业务分层`。那么`VueRouter` 就需要根据分层进行模块管理。

##### 过去式

- router > index.js

```javascript
import Vue from 'vue'
import vueRouter from 'vue-router'
// 引入组件模块
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
Vue.use(vueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
  // a lot of
]
export const router = new vueRouter({ routes: routes })
```

- main.js

```javascript
// .. 
import { router } from './router/index';
// ..
new Vue({
+ router: router,
  render: h => h(App),
}).$mount('#app')
```

这样的问题在于，业务庞大时 ，代码密集，不好维护 。

##### 现在

将所有的路由按业务分层，放入新建文件夹route下，并以 `.routes.js` 结尾命名，如 `login.routes.js` 

- route > login.routes.js（单独的业务模块需要的所有路由，每一个模块为一个js文件）

```js
export default {
  path: '/login',
  name: 'Login',
  component: () => import('../views/Login.vue')
  // a lot of
}
```

- router > index.js

```js
import Vue from 'vue'
import vueRouter from 'vue-router'
Vue.use(vueRouter)
// 下面的内容，重点注意
const routerList = [];
function importAll(req) {
  req.keys().forEach((key) => {
    routerList.push(req(key).default)
    // 这里的default就是export default 的 default
  });
}
importAll(require.context('../route', true, /\.routes\.js$/))
const routes = [
  {
    path: '/',
    name: 'Class',
    component: () => import('../views/Class.vue')
  },
  ...routerList, // 拓展符
]
export const router = new vueRouter({ routes: routes })
```

这种做法，你需要注意的是，route文件下的文件命名必须按照` /\.routes\.js$/`匹配。

怎么实现的动态？ `  component: () => import('../views/Login.vue')`

##### [路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html#%E8%B7%AF%E7%94%B1%E6%87%92%E5%8A%A0%E8%BD%BD)

## [render](https://cn.vuejs.org/v2/api/#render)函数实现自定义组件

1. ​

##### 过去式

使用`v-if` ` v-else-if` ` v-else` 判断，然后显示后触发不同事件。针对只有两种情况是可以这么做，但是很多种情况怎么办啦?

render.vue

```vue
<template>
  <div>
    <button @click="clickEvent(1)" v-if="num === 1">click-1</button>
    <button @click="clickEvent(2)" v-else-if="num === 2">click-2</button>
    <button @click="clickEvent(3)" v-else>click-3</button>
  </div>
</template>
<script>
export default {
  name: "Render",
  data() {
    return {
      num: 1
    };
  },
  methods: {
    clickEvent(param) {
      alert(param);
    }
  }
};
</script>
```

##### 现在

我们的做法，是采用vue提供的render函数，编写组件。首先，你需要知道以下知识：

1. [createElement参数](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)
2. [数据对象（h函数的第二个参数）](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)

button.vue （render）

```vue
<script>
  export default {
    props: {
      type: {
        type: String,
        default: "normal"
      },
      text: {
        type: String,
        default: "Click Me"
      }
    },
    render(h) {
      return h("button", {
        // v-bind:css
        class: {
          btn: true,
          "btn-success": this.type === "success",
          "btn-danger": this.type === "danger",
          "btn-warning": this.type === "warning",
          normal: !this.type
        },
        // dom操作
        domProps: {
          innerText: this.text
        },
        on: {
          click: this.handleClick
        }
      });
    },
    methods: {
      handleClick() {
        this.$emit("clickEvent" );
      }
    }
  };
</script>
<style scoped>
  .btn {
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    background: #ccc;
  }
  .btn-success {
    background: green;
  }
  .btn-danger {
    background: red;
  }
  .btn-warning {
    background: orange;
  }
</style>
```

render.vue

```vue
<template>
<div>
  <Button :type="'success'" :text="'提交'" @clickEvent="handerClick"></Button>
  </div>
</template>
<script>
  import Button from "../components/render/button.vue";
  export default {
    name: "Render",
    components: { Button },
    methods: {
      handerClick() {
        alert(1);
      }
    }
  };
</script>
```

##### QA

> Q：vue已经有了`template`，为什么还要`render`函数？
>
> A：弥补template的不足。

> Q：template和render函数的应用场景？区别？
>
> A：	相同之处：`render 函数` 跟 `template` 一样都是创建 html 模板。
>
> ​	不同之处：
>
> - Template适合逻辑简单，render适合复杂逻辑。
>
>
> - template理解相对容易，但灵活性不足；render函数灵活性高，但对使用者要求较高；
>
>
> - render的性能比template性能好；
>
>
> - 使用render函数渲染无编译过程，相当于使用者直接将代码给程序。所以，使用它对使用者要求高，且易出现错误
>
>
> - Render 函数的`优先级`要比template的级别要高，但是要注意的是Mustache(双花括号)语法就不能再次使用
> - template会`转义`为vNode，而render免去转义过程，

## 不一定需要Vuex

##### Vuex的缺点

- 引起不必要的体积
- 引起复杂的管理麻烦

##### 何时可以不用Vuex

- 使用少量的跨组件通信（state变量少于20个）

##### Vuex的替代方案

这里讲的两个方案，针对的都是小型项目，你的数据少，不足以去构建vuex。

[vue.observable()](https://vuejs.bootcss.com/api/#Vue-observable)

###### bus（vue的发布/订阅模式【\$on-\$emit】）

```js
// main.js
Vue.prototype.bus = new Vue();
```

```vue
<!--  a.vue -->
<script>
  export default {
    name: "A",
    mounted() {
      this.bus.$on("busClick", function(info) {
        alert(info);
      });
    },
  };
</script>
```

```vue
<!--  b.vue -->
<script>
  export default {
    name: "B",
    methods: {
      handerClick() {
        this.bus.$emit("busClick", "B");
      }
    }
  };
</script>
```

这样写，只能少数使用，写得太多，难以维护；而且在原型链上加一个bus，确实也不太好。

###### 简易store

```js
// store.oneself.js
// 使用vue.observable()处理你需要响应式的属性
import vue from 'vue';
let state = vue.observable({
  count: 0,
});
let mutations = {
  notifyCount(newVal) {
    store.count = newVal
  }
}
export { state, mutations }
```

```vue
<!-- 使用 -->
<template>
    <div>{{count}}</div>
</template>
<script>
import { state } from "../../store.oneself.js";
export default {
  name: "Child",
  computed: { // 必须在组件的计算属性中使用，否则无法响应式
    count() {
      return state.count;
    }
  },
};
</script>
```

```vue
<script>
  import { state, mutations } from "../../store.oneself.js";
  export default {
    render(h) {
      return h("button", {
        // dom操作
        domProps: { 
          innerText: this.text + state.count  // 也可在render函数中使用。
        },
        on: {
          click: this.handleClick
        }
      });
    },
    methods: {
      handleClick() {
        this.$emit("clickEvent"); 
        mutations.notifyCount(20); // 也可在render函数中使用。
      }
    }
  };
</script>
```## 使用[插件](https://vuejs.bootcss.com/guide/plugins.html)解决问题

将一些特定需求注入到每一个组建的生命周期，然后可以自动完成你所想要的结果。

主要使用两个API：[Vue.use()](https://vuejs.bootcss.com/api/#Vue-use) 、[Vue.mixin()](https://vuejs.bootcss.com/api/#Vue-mixin)

用途：`提供全局自定义操作`

##### 案例一

> Q：vuex过大，打包结果便会很大
>
> A：按组件异步拆分加载vuex

- 插件（vuexplugins -> index.js）

```js
const vuex_plugins = {
  install: function (vue) {
    vue.mixin({
      created: function () {
        const options = this.$options; // vue template | VNode
        if (options.isVuex) {
          const _name = options.name.toLowerCase();
          import('../store/modules/' + _name).then((res) => {
            this.$store.registerModule(_name, res.default);
          });
        }
      }
    })
  }
}
export default vuex_plugins
```

**思考**

1. ` import('../store/modules/' + _name ) `能够动态加载的原理？

2. [this.$store.registerModule(_name, res.default)](https://vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C)

3. **有一个要求**：template的name选项，modules下模块的文件名，使用时state的属性值，必须一致（无无论是设置为一样的还是使用代码处理后的）。

4. 错误的写法，import中只能是字面量，不可是一个变量

   ```js
   // const _path = '../store/modules/' + name;
   // import(_path).then(()=>{})
   ```

- 注册`vuexplugins` — main.js

```js
// ... 
import vuexPlugins from './vuexplu/index.js';
Vue.use(vuexPlugins)
```

- vuex模块

```js
// eg home.js
export default {
  state: {
    homeUser: '杜康'
  },
  mutations: {
    changeHomeUser(state, value) {
      state.homeUser = value
    }
  }
  // ... 
}
```

正常写store一样。

- 使用 （Home.vue）

```vue
<template>
<div>
  <div>Home Page</div>
  <p>user is : {{user}}</p>
  </div>
</template>
<script>
  export default {
    name: "Home", // 注意这里的名字
    isVuex: true,
    computed: {
      user() {
        const _state = this.$store.state;
        return _state.Home && _state.Home.homeUser;
      }
    },
  };
</script>
```

使用时，只能在computed中使用。

在data或watch中来使用，刷新页面后，值为undefined【未找到原因】，那样的话，你会收到如下的警告：

> [vuex] state field "Home" was overridden by a module with the same name at "Home"
>
> [vuex]状态字段“Home”被一个在“Home”中具有相同名称的模块覆盖## watch的高阶使用

##### 立即执行

watch是监听属性改变时触发，所以当组件初次挂载完成是不会触发watch的。这里提供两种实现方式：

1. 在create生命周期中修改一次watch的属性
2. watch设置immediate属性为`true`

```js
export default {
  watch: {
    name:{
      handler:function(){},
      immediate: true, // 【2】
      deep:false
    }
  },
  created(){
    this.name = 'initVal' // 【1】
  }
}
```

##### 监听触发时执行多个方法

1. 使用数组方式，添加监听触发处理。数组项类型可以是 `String`、`Function`、`Object`

```js
export default {
  watch: {
    name:[
      // 【1 字符串】
      'setName', 
      // 【2 函数】
      function(){},
      // 【3 对象】
      { 
        handler:  function(){},
      }
    ]
  },
  methods: {
    setName(){}
  }
}
```

##### watch监听多个变量

watch默认是不可监听多个变量的，我们可以利用`deep`属性和`computed`选项变向实现监听多个变量。**这样的做法主要是watch触发时执行相同的业务逻辑**

```js
export default {
  data(){
    return{
      name:'',
      age:'',
      text:'',
    }
  },
  computed:{
    multiWatch(){
      const {name,age,text} = this // 绑定对应属性
      return {
        name,age,text	
      }
    }
  },
  watch: {
    multiWatch:{
      handler: function(){},
      deep:true, // 不许设置为 true
    }
  },
}
```

