// 数组响应式
// 1.替换数组原型中7个方法
const orginalProto = Array.prototype;
// 备份一份，修改备份
const arrayProto = Object.create(orginalProto);
['push', 'pop', 'shift', 'unshift'].forEach(method => {
  arrayProto[method] = function () {
    // 原始操作
    orginalProto[method].apply(this, arguments)
    // 覆盖操作：通知更新
    console.log('数组执行' + method + '操作');
  }
})

// 对象响应式
function defineReactive(obj, key, val) {
  //递归
  observe(val)

  // 对传入obj进行访问拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key, val);
      return val
    },
    set(newVal) {
      if (newVal === val) return

      console.log('set', key, newVal);
      //如果set的值也是obj，需要先做响应式
      observe(newVal)
      val = newVal
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj === null) return

  // for (const key in obj) {
  //   defineReactive(obj, key, obj[key])
  // }

  // 判断传入obj类型
  if (Array.isArray(obj)) {
    // 覆盖原型，替换7个变更操作
    obj.__proto__ = arrayProto
    // 对数组内部元素执行响应化
    const keys = Object.keys(obj)
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i])
    }
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function $set(obj, key, val) {
  defineReactive(obj, key, obj[key])
}

// let obj = {}
// defineReactive(obj, 'foo', 'foo')
// obj.foo
// obj.foo = 'fooooooooooooooooo'
// obj.foo

const obj = { foo: 'foo', bar: 'bar', baz: { a: 1 }, arr: [1,2,3] }

// 遍历做响应化处理
observe(obj)

obj.foo
obj.foo = 'fooooooooooooooo'
obj.bar
obj.bar = 'barrrrrrrrrrrrrr'

// obj.baz.a = 10 // no ok
obj.baz = {a:100}
obj.baz.a = 100000

obj.dong = 'dong'
$set(obj, 'dong', 'dong')
obj.dong

// Object.defineProperty()对数组无效
// 分析：改变数组方法只有7个
// 解决方案：替换数组实例的原型方法，让他们在修改数组同时还可以通知更新
obj.arr.push(4)