---
title: 面向对象编程思想、封装、多态
category: javascript
---

## 一句话结论

面向对象编程是把数据和行为组织到对象、类或构造函数中，通过封装、继承和多态管理复杂业务。JavaScript 的 OOP 建立在原型机制上，`class` 是更清晰的语法层封装。

## 为什么需要它

当业务对象有稳定状态和行为时，把它们封装到对象模型里，比散落的函数和变量更容易维护。

- 场景：组件实例、游戏角色、图形对象、领域模型、SDK 客户端。
- 不处理会怎样：状态和行为分散，调用顺序靠约定，复用和扩展成本升高。

## 核心概念

| 概念 | 含义 | JavaScript 表达 |
| ---- | ---- | ---- |
| 封装 | 把数据和行为放在同一抽象内，隐藏内部细节 | 构造函数、`class`、闭包私有变量 |
| 继承 | 子类型复用父类型能力 | 原型链、`extends` |
| 多态 | 同一接口在不同对象上有不同实现 | 方法重写、鸭子类型 |
| 静态成员 | 属于类本身，不属于实例 | `static` |
| 实例成员 | 属于每个实例 | `this.name` |

## 原理

JavaScript 没有传统基于类的底层模型，对象继承依赖原型链。ES6 `class` 让写法更接近其他语言，但方法仍然定义在原型上。

```js
class Car {
  constructor(name) {
    this.name = name;
  }

  run() {
    return `${this.name} running`;
  }
}

const car = new Car("Tesla");

console.log(car.run()); // 'Tesla running'
console.log(Object.getPrototypeOf(car) === Car.prototype); // true
```

## 实现

### ES5 构造函数与原型

```js
function Car(name, price) {
  if (!(this instanceof Car)) {
    return new Car(name, price);
  }

  this.name = name;
  this.price = price;
}

Car.prototype.run = function run() {
  return `${this.name} running`;
};

const car = new Car("Model 3", 200000);

console.log(car.run());
```

原笔记中的「对象安全模式」思路是正确的，但要注意判断应使用当前构造函数本身，而不是其他变量名。

### ES6 class

```js
class Vehicle {
  constructor(name) {
    this.name = name;
  }

  run() {
    return `${this.name} running`;
  }

  static isVehicle(value) {
    return value instanceof Vehicle;
  }
}

class Bus extends Vehicle {
  constructor(name, seats) {
    super(name);
    this.seats = seats;
  }

  run() {
    return `${this.name} carries ${this.seats} passengers`;
  }
}

const bus = new Bus("City Bus", 40);

console.log(bus.run()); // 'City Bus carries 40 passengers'
console.log(Vehicle.isVehicle(bus)); // true
```

`Bus#run` 重写了父类方法，这就是多态的一种体现：同样调用 `run()`，不同对象可以给出不同结果。

### 私有字段

```js
class Counter {
  #count = 0;

  increment() {
    this.#count += 1;
    return this.#count;
  }
}

const counter = new Counter();

console.log(counter.increment()); // 1
```

`#count` 是语言级私有字段，类外部不能直接访问。

## 边界与常见坑

- **`class` 不是新的继承模型**：它仍然基于原型。
- **继承层级不要太深**：深继承会让行为来源难追踪。
- **构造函数忘记 `new` 会出错**：`class` 会直接抛错，普通构造函数可能污染全局。
- **实例方法写在构造函数里会重复创建**：共享方法优先放在原型或类方法中。
- **多态不等于大量 `if`**：让对象自己实现同名方法，调用方只依赖接口。

## 工程取舍

- 适合：对象有明确生命周期、状态和行为；需要表达领域模型。
- 谨慎：只有纯数据转换时使用类，可能比函数更重。
- 应换方案：组合优先于继承；工具逻辑用普通函数；状态流复杂时考虑状态机或框架约定。

## 面试 / 自测

1. JavaScript 的 `class` 和原型是什么关系？
2. 封装、继承、多态分别解决什么问题？
3. 为什么不建议把实例方法写在构造函数内部？
4. `static` 方法和实例方法有什么区别？
5. 为什么说组合通常比深继承更稳？

## 相关文章

- [原型链](./prototype.md)
- [new](./new.md)
- [this](./this.md)

## 参考

- [MDN: Classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
