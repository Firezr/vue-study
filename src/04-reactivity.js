const isObject = (obj) => {
  return typeof obj === 'object' && obj !== null
}

const toProxy = new WeakMap()  // { obj: observed }
const toRaw = new WeakMap()  // { observed: obj }

function reactive(obj) {
  if (!isObject(obj)) { return obj }

  // 查找缓存
  if (toProxy.has(obj)) return toProxy.get(obj)
  if (toRaw.has(obj)) return obj

  // Proxy相当于在对象外层加拦截 
  // http://es6.ruanyifeng.com/#docs/proxy 
  const observed = new Proxy(obj, {
    // target代理目标
    get(target, key, receiver) {
      // Reflect用于执行对象默认操作，更规范、更友好 
      // Proxy和Object的方法Reflect都有对应 
      // http://es6.ruanyifeng.com/#docs/reflect 
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      // 收集依赖
      track(target, key)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      trigger(target, key)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    }
  })

  // 缓存
  toProxy.set(obj, observed)
  toRaw.set(observed, obj)

  return observed
}

const effectStack = []

function effect(fn) {
  const rxEffect = function () {
    try {
      effectStack.push(rxEffect)
      // 执行函数触发getter -> track
      return fn()
    } catch (error) {
    } finally {
      effectStack.pop()
    }
  }
  rxEffect()
  return rxEffect
}

// 建立target/key和cb之间的映射关系
let targetMap = new WeakMap()
function track(target, key) {
  // 取出响应函数
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    // 获取依赖表
    let depsMap = targetMap.get(target)

    if (!depsMap) {
      // 初始化不存在，需要创建一个新的空的 Map
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }

    // 获取 key 对应的函数集合
    let deps = depsMap.get(key)
    if (!deps) {
      deps = new Set()
      depsMap.set(key, deps)
    }

    // 把当前effevt加入到 deps 中
    if (!deps.has(effect)) {
      deps.add(effect)
    }
  }
}

function trigger(target, key) {
  // 获取依赖的set
  const depsMap = targetMap.get(target)

  if (depsMap) {
    const deps = depsMap.get(key)
    deps && deps.forEach(effect => effect())
  }
}

const state = reactive({
  foo: 'foo',
  arr: [0, 1],
  bar: { a: 1 }
})

effect(()=>{
  console.log('effect1', state.foo);
})
effect(()=>{
  console.log('effect2', state.foo);
})
state.foo = 'fooooooo'

// // 1.获取 
// state.foo // ok
// // 2.设置已存在属性 
// state.foo = 'fooooooo' // ok 
// // 3.设置不存在属性 
// state.dong = 'dong' // ok 
// // 4.删除属性 
// delete state.dong // ok

// state.bar.a = 10
// state.arr[0] = 10


// console.log(reactive(state) === state);