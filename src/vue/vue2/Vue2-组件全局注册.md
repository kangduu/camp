---
title: Vue组件注册
category: Vue
---

### Summary

​	Vue.component是vue为我们提供的全局注册组件API，只有它还不能满足我们的需求，还需要使用到webpack的`require.context`功能，首先将所有的公共组件（基础组件）整理在components文件夹下，使用`require.context`获取到所有组件，解析组件名（name，驼峰命名）和组件选项（options，默认为default），最后使用Vue.component()实现全局注册。

 - [require.context](https://webpack.docschina.org/guides/dependency-management/#require-context) - webpack管理依赖
 - [Vue.component()](https://vuejs.bootcss.com/api/#Vue-component)
 - [Vue.use()](https://vuejs.bootcss.com/api/#Vue-use) 

### default

​	通常我们在组件中注册使用另一个组件，需要先使用模块系统引入组件【1】，然后通过组件选项components属性注册组件【2】，完成【1】【2】后，你就可以在模板中使用该组件了【3】。

```vue
<template>
  <div>
  	<child1 :text="text"></child1> <!-- 【3】 使用 -->
  </div>
</template>
<script>
  import child1 from "./component/child.vue"; // 【1】引入
  export default {
    name: "HelloWorld",
    data() {
      return {
        text: "HelloWord"
      };
    },
    components: { // 【2】注册
      child1
    }
  };
</script>
```

​	你应该经常这样做，即使这个组件会在多个组件中使用。这无疑是增加了代码冗余，增添代码的维护成本。针对于高频使用的组件，如按钮、输入框、dialog组件、文件上传等，在大部分业务系统中都是不可或缺的，也是频繁使用的，那么这种情况就需要使用**全局组件注册**来解决。

### 全局组件注册

首先你可以建立一个common文件夹，将高频组件整理在一起，然后在该文件夹下编写如下index模块。

```javascript
// 获取组件上下文模块
const contextModule = require.context(
    // 组件目录的相对路径
    '.',
    // 查询子目录
    true,
    // 文件名匹配
    /\.vue$/)

// 驼峰命名（首字母大写）
function changeStr(str) { return str.charAt(0).toUpperCase() + str.slice(1) }
const install = (Vue) => {
    contextModule.keys().forEach(key => {
        // 获取组件配置
        let componentConfig = contextModule(key);
        //获取到高频组件的 PascalCase 命名
        let componentName = changeStr(key.substring(key.lastIndexOf('/') + 1).replace(/\.\w+$/, ''))
        Vue.component(componentName,
            // 当组件选项通过 `export default` 导出，优先使用 `.default` ,否则回退到使用模块的根。 
            componentConfig.default || componentConfig)
    });
}

// 必须导出 `install` 命名或匿名函数，因为 `Vue.use()` 自动调用install方法或将匿名函数当作install
export default { install }
```

全局注册的行为必须在`根 Vue 实例 (通过 new Vue) 创建之前`发生

```javascript
// main.js

// 全局组件注册
import globalTemplate from './components/util'
Vue.use(globalTemplate)

// ...

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
})
```

这样，你就成功注册了组件（全局的），可以随心所欲的使用了

```vue
<template>
<div class="hello">
  <child :text="text"></child>
  <child2 :text="text"></child2>
  <child1 :text="text"></child1>
  <child3 :text="text"></child3>
  </div>
</template>

<script>
  // import child1 from "./component/child.vue"; 无需引用
  export default {
    name: "Parent",
    data() {
      return {
        text: "HelloWord"
      };
    }
    // components: { 无需注册
    //   child1
    // }
  };
</script>
<style scoped lang='scss'>
</style>
```