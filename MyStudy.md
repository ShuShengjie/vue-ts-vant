#### 属性描述符

- writable 是否可以修改属性值
- configable 属性是否是可以配置的，单向的，无法撤销
- enumberable 是否可遍历的

#### 访问描述符

- get 属性获取时调用的方法

- set 属性设置时调用的方法

- 密封对象  Object.seal(对象);

  \- 不可以添加新属性

  \- 不可以删除

  \- 可以读写操作

- 冻结对象  Object.freeze(对象);

  \- 只能读

  \- 不能写入、删除、添加操作

#### this指向

**硬绑定**

- 函数在new中调用（new绑定）this绑定的是创建的新对象

  ```javascript
  var bar = new foo()
  ```

- 函数是否通过call, apply（显示绑定）this绑定的是指定的对象

  ```javascript
  var bar = foo.call()
  ```

- 函数是否在某个上下文对象中调用（隐式绑定）this绑定的是上下文对象

  ```javascript
  var bar = obj1.foo()
  ```

- 如果都不是的话使用默认绑定。严格模式绑到undefined，否则绑定到window

  ```javascript
  var bar = foo()
  ```

- 列外 把null或undefined传入call,  apply, bind，

  使用bind进行函数柯里化的时候会用到null

  可以使用Object.create(null)创建空对象提高代码可读性

#### 箭头函数的绑定无法被修改

```javascript
function foo() {
      return a => {
        console.log(this.a)
      }
    }
    let obj1 = {
      a: 2
    }
    let obj2 = {
      a: 3
    }
    let bar = foo.call(obj1) 
    bar.call(obj2) //2 no 3!!!!
```

#### 原型继承

```javascript
function Foo(name) {
      this.name = name;
    }
    Foo.prototype.myName = function () {
      return this.name
    }
    function Bar(name, label) {
      Foo.call(this, name)
      this.label = label;
    }
    // Bar.prototype = Object.create(Foo.prototype)
    Object.setPrototypeOf(Bar.prototype, Foo.prototype)
    // Bar.prototype = Foo.prototype;
    Bar.prototype.myLabel = function () {
      return this.label
    }
    Object.defineProperty(Bar.prototype, "constructor", {
      enumerable: false,
      writable: true,
      configurable: true,
      value: Bar
    })
    Bar.prototype.myName = function() {
      return `old value`
    }
    let b = new Bar('aaa', 'label aaa')
    b.name = 'bbb'
    let c = new Foo('ccc')
    c.name = 'ddd'
    console.log(b)
    console.log(c)
```

Bar.prototype = Object.create(Foo.prototype)

调用Object.create()会凭空创建一个新的对象并把新对象内部的__proto__关联到指定的对象(指Foo.prototype)

ES6开始可以直接修改现在的Bar.prototype

Object.setprototypeOf(Bar.prototype, Foo.prototype)

判断类的关系可以调用 a instanceof Foo

但此方法只能判断对象与函数之间的关系，判断两个对象(a,b)之间是否通过__proto__关联只用instanceof无法实现

可以使用反射的方法：Foo.prototype.isPrototypeOf(a); //true

// 非常简单：b 是否出现在 c 的 [[Prototype]] 链中？ 

b.isPrototypeOf( c );



#### Object.create的polyfill代码

```javascript
if(!Object.create) {
	Object.create = function(o) {
		function F() {}
		F,prototype = o;
		return new F()
	}
}
```

#### 直接获取一个对象的__proto__

Object.getPrototypeOf(a) === Foo.prototype

#### ES6中的class基本上只是现有__proto__（委托！）机制的一种语法糖。

### 字符串是不可变的，数组是可变的。所以字符串无法借用数组的可变更成员函数Array.prototype.reserve.call()方法，所以我们可以使用a.split('').reserve().join('')

#### join的实现方法

```javascript
function fakeJoin(arr, connector) {
      let str = '';
      for (let i = 0; i < arr.length; i++) {
        if (i > 0) {
          str += connector
        }
        if (arr[i] !== undefined) {
          str += arr[i]
        }
      }
      return str
    }
    let a = new Array(3)
    console.log(fakeJoin(a, '-'))
```

#### 永远不要创建空单元数组，Array.apply(null, {length: 3})这个方法相对可靠些。

#### vue可以使用split等监听数组变化，但不能利用索引值与修改数组长度修改数组，需要利用set方法。原因是因为Object.defineProperty不能监听到数组的变化。主要原因数组的length属性中configurable是false。

#### Vue的父组件和子组件生命周期执行顺序

- 加载渲染过程

  父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

- 子组件更新过程

  父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- 父组件更新过程

  父 beforeUpdate -> 父 updated

- 销毁过程

  父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

#### 父组件监听子组件的生命周期

- 子组件emit给父组件

```vue
// Parent.vue
<Child @mounted="doSomething"/>
    
// Child.vue
mounted() {
  this.$emit("mounted");
}
```

- 在父组件引用子组件时通过@hook来监听

  ```vue
  //  Parent.vue
  <Child @hook:mounted="doSomething" ></Child>
  
  doSomething() {
     console.log('父组件监听到 mounted 钩子函数 ...');
  },
      
  //  Child.vue
  mounted(){
     console.log('子组件触发 mounted 钩子函数 ...');
  },    
      
  // 以上输出顺序为：
  // 子组件触发 mounted 钩子函数 ...
  // 父组件监听到 mounted 钩子函数 ... 
  ```

#### watch高级用法

- watch最初绑定时不会执行，要等到监听的值第一次改变时才执行监听计算。可以使用immediate：true

  ```vue
  watch: {
    firstName: {
      handler(newName, oldName) {
        this.fullName = newName + ' ' + this.lastName;
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  }
  ```

- Vue 不能检测到对象属性的添加或删除,使用deep: true代表深度监听

  默认情况下 handler 只监听`obj`这个属性它的引用的变化，我们只有给`obj`赋值的时候它才会监听到，比如我们在 mounted事件钩子函数中对`obj`进行重新赋值：

  ```vue
  mounted: {
    this.obj = {
      a: '456'
    }
  }
  ```

  相反，如果我们需要监听`obj`里的属性`a`的值呢？这时候`deep`属性就派上用场了！

  ```
  watch: {
    obj: {
      handler(newName, oldName) {
        console.log('obj.a changed');
      },
      immediate: true,
      deep: true
    }
  ```

  deep监听器会一层层往下遍历，给对象所有属性加上这个监听器，但是性能开销会非常大，修改对象里任何一个属性都会触发这个监听器的handler方法。由此，我们可以使用字符串形式监听

  ```vue
  watch: {
    'obj.a': {
      handler(newName, oldName) {
        console.log('obj.a changed');
      },
      immediate: true,
      // deep: true
    }
  } 
  ```

#### Vue SSR

- 更好的SEO
- 首屏加载更快
- 更多的开发条件限制
- 更多的服务器负载

#### vue-router

- hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
- history : 依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
- abstract : 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

