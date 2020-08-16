// 响应式


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

  Object.keys(obj).forEach(key=> {
    defineReactive(obj, key, obj[key])
  })
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