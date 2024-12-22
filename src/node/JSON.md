---
title: JSON、XML和序列化对象
---

### JSON

JavaScript对象表示法（JavaScript Object Notation），只有 `stringify` 和 `parse` 两个方法，不能被调用或作为构造函数调用。可用于前后端的[数据交换](http://dukangblog.top/2020/03/31/JSON/#数据交换格式)，XML也是一种数据交换格式。

JSON是JavaScript的子集，但是却不能表示JavaScript中所有的值。[link](http://dukangblog.top/2020/03/31/JSON/#拓展阅读)

- 支持（序列化和解析）

  `对象`、`数组`、`字符串`、`boolean 值`、`null` 

- 特殊的（只能序列化，且结果很意外啊）

  序列化后结果是 **null** ：`NaN`、 `Infinity`、`-Infinity` ；

  序列化后结果是 **{}** ：`RegExp对象`、`Error对象`

  `Date对象`序列化后结果是ISO格式的日期字符串，[Date.toJSON() ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON) ；

- 不支持（不可序列化也不可解析）

  `函数`、`undefined` 、`Symbol` 

下面定义一个json对象，然后使用 JSON.stringify() 和 JSON.parse() 测试，思考结果是怎样的？

```js
let json = {
    // 支持的
    obj: { a: 1 },
    arr: [1, 2],
    str: 'string',
    boolt: true,
    boolf: false,
    nll: null,

    // 序列为 null
    nan: NaN,
    inf: Infinity,
    _inf: -Infinity,

    // 序列化后为 {}
    reg: /\.vue$/,
    err: new Error('error message'),

    //不支持
    sym: Symbol('symbol'),
    fun: function () { return '123' },
    und: undefined,

    //特殊的 Date对象
    date: new Date()

    // BigInt 数据类型为ES10新的数据类型，未测试
    // big: BigInt(222222222222222222)
}
```

##### JSON.stringify( value [ , replacer\<array | function\> [ , indent\<number | string\> ]  ] )

> 序列化对象，返回与指定值对应的JSON字符串。
>
> 可以通过额外的参数, 控制仅包含某些属性, 或者以自定义方法来替换某些key对应的属性值。
>
> 只可序列化对象可枚举的自身属性（否则会被忽略）
>
> 序列化属于深度遍历，即嵌套的属性。

###### 第二个参数

- **null  \| 无**

  对象所有可序列化的属性都会被序列化

  使用 **JSON.stringify(json)** 得到的结果，会发现和源对象有出入，存在很多隐式问题。

  ```js
  {
    // normal
    "obj": { "a": 1 },
    "arr": [1, 2],
    "str": "string",
    "boolt": true,
    "boolf": false,
    "nll": null,

    // is null
    "nan": null,
    "inf": null,
    "_inf": null,

    // is {}
    "reg": {},
    "err": {},

    // Date
    "date": "2020-04-05T08:55:38.213Z" // 注意时间的序列化结果

    // vanish 消失了
    //sym: Symbol('symbol'),
    //fun: function () { return '123' },
    //und: undefined,
  }
  ```

- **数组**

  `只有包含在这个数组中的属性名且其属性值支持序列化的`才会被序列化到最终的 JSON 字符串中，其中可能存在与预期不符合的结果，如RegExp、Date、function（被忽略了）

  ```js
  console.log(JSON.stringify(json, ['obj', 'reg', 'date', 'fun']));
  // {"obj":{},"reg":{},"date":"2020-04-05T09:17:21.821Z"}
  ```

  这一特性，**可以在实际开发中可用于调试代码**，如：返回的数据对象很大，直接打印指定属性即可。


- **函数**

  在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理

  ```js
  let res = JSON.stringify(json, function (key, value) {
    if (value) return value
    else return undefined
  })
  //console.log(res);
  {
    "obj":{"a":1},
    "arr":[1,2],
    "str":"string",
    "boolt":true,
    "inf":null,
    "_inf":null,
    "reg":{},
    "err":{},
    "date": "2020-04-05T09:37:36.035Z"
  }
  ```

  **注意：Infinity和-Infinity这两个值，序列化结果为null，但是却为真值**


##### 第三个参数

​	只是增加索引，便于调试阅读，`指定缩进用的字符串`

- **null \| 空** 

  无缩进，连续字符串形式


- **数字**

  代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；

  ```js
  console.log(JSON.stringify(json, null, 111)); // 此时需要第二个参数
  {
            "obj": {
                      "a": 1
            },
            "arr": [
                      1,
                      2
            ],
            "str": "string",
            "boolt": true,
            "boolf": false,
            "nll": null,
            "nan": null,
            "inf": null,
            "_inf": null,
            "reg": {},
            "err": {},
            "date": "2020-04-05T09:47:17.483Z"
  }
  ```

- 字符串

  该字符串将被作为空格，(当字符串长度超过10个字母，取其前10个字母)

  ```js
  console.log(JSON.stringify(json, null, '*****************'));
  {
  **********"obj": {
  ********************"a": 1
  **********},
  **********"arr": [
  ********************1,
  ********************2
  **********],
  **********"str": "string",
  **********"boolt": true,
  **********"boolf": false,
  **********"nll": null,
  **********"nan": null,
  **********"inf": null,
  **********"_inf": null,
  **********"reg": {},
  **********"err": {},
  **********"date": "2020-04-05T09:48:11.359Z"
  }	
  ```


##### JSON.parse( string  [ , reviver\<function\> ] )

> 解析`JSON字符串`并返回对应的值（反序列化）。
>
> 可以额外传入一个转换函数，用来将生成的值和其属性, 在返回之前进行某些修改。
>
> 转换函数是从内向外遍历每一个属性。
>
> 不允许用逗号作为结尾

```js
let j = '{ "obj": { "a": 1 }, "arr": [1, 2], "str": "string", "boolt": true, "nll": null,"date": "2020-04-05T09:57:59.470Z" }'
console.log(JSON.parse(j));
{
  obj: {a: 1},
  arr: [1, 2],
  str: "string",
  boolt: true,
  nll: null,
  date: "2020-04-05T09:57:59.470Z" // 注意，Date对象在反序列化时，按字符串处理
}
```

##### toJSON方法

如果一个被序列化的对象拥有 `toJSON` 方法，那么该 `toJSON` 方法就会覆盖该对象默认的序列化行为：不是该对象被序列化，而是调用 `toJSON` 方法后的返回值会被序列化，

```js
let obj = {
    first: 'hello',
    last: 'javascript',
    year: 25,
    toJSON: function () {
        return `${this.first} ${this.last}`
    }
}
console.log(JSON.stringify(obj)); //" hello javascript"
```

### 数据交换格式

##### XML

1. 拓展标记语言（Extensible Markup Language, XML）,`标记电子文件使其具有结构性`的**标记语言**;

2. 可`标记数据`、`定义数据类型`；

3. 允许`用户对自己的标记语言进行定义`的源语言；

4. 使用`DTD(document type definition)`文档类型定义来组织数据；

5. 提供**统一的方法**来**描述和交换**独立于应用程序或供应商的结构化数据。

###### 优点

`格式统一` 、`跨平台` 、`符合标准`

###### 缺点

1. XML文件大，文件格式复杂，传输占带宽；
2. 服务端和客户端需大量代码解析XML，导致代码变得异常复杂且不易维护；
3. 客户端不同浏览器解析方式不一致，需编写多套代码（兼容）；
4. 服务端和客户端需花费较多的资源和时间解析XML。

###### 示例（167个字符）

```xml
<?xml version="1.0"?>
<book id="123">
  <title>Object Thinking</title>
  <author>David West</author>
  <published>
    <by>Microsoft Press</by>
    <year>2004</year>
  </published>
</book>
```
##### JSON

###### 优点

1. 数据格式比较简单，易于读写，格式都是压缩的，占用带宽小；

2. 易于解析，客户端JavaScript可以简单的通过eval()进行JSON数据的读取；

3. 支持多种语言，包括ActionScript, C, C#, ColdFusion, Java, JavaScript, Perl, PHP, Python, Ruby等服务器端语言，便于服务器端的解析；

4. 跨平台

5. 因为JSON格式能直接为服务器端代码使用，大大简化了服务器端和客户端的代码开发量，且完成任务不变，并且易于维护。

###### 缺点

​	......

###### 示例（140个字符）

```js
{
  "id": 123,
  "title": "Object Thinking",
  "author": "David West",
  "published": {
    "by": "Microsoft Press",
    "year": 2004
  }
}
```

### XML和JSON的优缺点对比

1. 可读性

   xml相对好一些。

2. 可拓展性

   xml天生好些，但并不是JSON就做不到

3. 编码难度

   XML有丰Dom4j、JDom等，JSON有json.org提供的工具；

   但是JSON的编码明显比XML容易许多，即使不借助工具也能写出JSON的代码，可是要写好XML就不太容易。

4. 解码难度

   XML的解析得考虑子节点父节点；JSON的解析难度几乎为0。

5. 解析手段

    JSON和XML同样拥有丰富的解析手段； 差不多。


6. 数据体积

   同样的数据需求，JSON小于XML

7. 数据交互

   JSON与JavaScript的交互更加方便，更容易解析处理，更好的数据交互

8. 数据描述

   JSON对数据的描述性比XML较差

9. 传输速率

   JSON远远快于XML

10. 流行度

  似乎以前xml更受欢迎，现在可能是JSON；但针对其特点和用途，各有所好


### XML与JSON数据格式比较

##### 关于轻量级和重量级（解析上）

> JSON只提供`整体解析`方案，只在解析`较少的数据`时才能起到良好的效果；
>
> XML提供对大规模数据的`逐步解析`方案，很适合于对`大量数据`的处理。

- XML的两种解析方式（DOM和 SAX）

​        DOM是把一个数据交换格式XML看成一个DOM对象，需要把XML文件整个读入内存，这一点上JSON和XML的原理是一样的，但是`XML要考虑父节点和子节点`，这一点上JSON的解析难度要小很多。

​	SAX不需要整个读入文档就可以对解析出的内容进行处理，是一种`逐步解析`的方法。程序也可以`随时终止`解析。这样，一个大的文档就可以逐步的、一点一点的展现出来，所以SAX适合于大规模的解析。这一点，JSON目前是做不到得。

##### 关于数据格式编码及解码难度

- 在编码方面

  虽然XML和JSON都有各自的编码工具，但是JSON的编码要比XML简单，即使不借助工具，也可以写出JSON代码，但要写出好的XML代码就有点困难；与XML一样，JSON也是基于文本的，且它们都使用Unicode编码，且其与数据交换格式XML一样具有可读性。

  主观来看，JSON更为清晰且冗余更少些。JSON网站提供了对JSON语法的严格描述，只是描述较简短。

  总体来看，XML比较**适合于标记文档**，而JSON却更**适于进行数据交换处理**。


- 在解析方面

  在普通的web应用领域，开发者经常为XML的解析伤脑筋，无论是服务器端生成或处理XML，还是客户端用 JavaScript 解析XML，都常常导致复杂的代码，极低的开发效率。 

  实际上，对于大多数Web应用来说，他们根本不需要复杂的XML来传输数据，XML宣称的扩展性在此就很少具有优势,许多Ajax应用甚至直接返回HTML片段来构建动态Web页面，和返回XML并解析它相比，返回HTML片段大大降低了系统的复杂性，但同时缺少了一定的灵活性。

  同XML或 HTML片段相比，数据交换格式JSON 提供了更好的简单性和灵活性。在Web Serivice应用中，至少就目前来说XML仍有不可动摇的地位。

- 在实例方面

  参见上述两个示例，你会发现同样的信息，编码出来大小不同。在可读性上xml更适合人类语言，而JSON却更像数据块。从编码手写难度来说，xml相对好一些。压缩后，xml却多了很多标记字符。

### 参考

- 【JavaScript权威指南 p141】
- [JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [XML]()
- [JSON.stringify](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [JSON.parse](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

### 拓展阅读

- [JSON: The JavaScript subset that isn't （json不完全是JavaScript的子集）](http://timelessrepo.com/json-isnt-a-javascript-subset)

- JSON和JSONP的区别

  > **JSON**和**JSONP**虽然只有一个字母的差别，但其实他们根本不是一回事儿
  >
  > **JSON是一种数据交换格式** ；
  >
  > **JSONP**是一种依靠开发人员的聪明才智创造出的一种**非官方跨域数据交互协议**。
  >
  > 拿谍战片来打个比方，JSON是地下党们用来书写和交换情报的“暗号”，而JSONP则是把用暗号书写的情报传递给自己同志时使用的接头方式。看到没？**一个是描述信息的格式，一个是信息传递双方约定的方法。**

