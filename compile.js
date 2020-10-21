// 编译器
// 递归遍历dom树
// 判断节点类型，如果是文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性判断是否是指令或事件，然后递归子元素
class Compiler {
  // el是宿主元素
  // vm是KVue实例
  constructor(el, vm) {
    // 保存kVue实例
    this.$vm = vm
    this.$el = document.querySelector(el)

    if (this.$el) {
      // 执行编译
      this.compile(this.$el)
    }
  }

  compile(el) {
    // 遍历el树
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 判断是否是元素
      if (this.isElement(node)) {
        // console.log('编译元素'+node.nodeName);
        this.compileElement(node)
      } else if (this.isInter(node)) {
        // console.log('编译插值绑定'+node.textContent);
        this.compileText(node)

      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }


  isElement(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    // 首先是文本标签，其次内容是{{xxx}}
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  compileText(node) {

    this.update(node, RegExp.$1, 'text')
  }

  // 元素编译
  compileElement(node) {
    // 节点是元素
    // 遍历其属性列表
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      // 规定：指令以k-xx="oo"定义 k-text="counter"
      const attrName = attr.name // k-xx k-text
      const exp = attr.value // oo counter
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2) // xx text
        // 执行指令
        this[dir] && this[dir](node, exp)
      }
      // 事件处理
      if (this.isEvent(attrName)) {
        // @click="onClick"
        const dir = attrName.substring(1) // click
        // exp onClick
        // 事件监听
        this.eventHandler(node, exp, dir)
      }
    })
  }

  isDirective(attr) {
    return attr.indexOf('k-') === 0
  }

  // 更新函数作用：
  // 1.初始化
  // 2.创建Watcher实例
  update(node, exp, dir) {
    // 初始化
    // 指令对应更新函数xxUpdater
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])

    // 更新处理，封装一个更新函数，可以更新对应dom元素
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
  }

  textUpdater(node, value) {
    node.textContent = value
  }

  // k-text
  text(node, exp) {
    this.update(node, exp, 'text')
  }

  // k-html
  html(node, exp) {
    this.update(node, exp, 'html')
  }

  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  isEvent(dir) {
    return dir.indexOf('@') == 0
  }

  eventHandler(node, exp, dir) {
    // methods: {onClick:function(){}}
    const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp]
    node.addEventListener(dir, fn.bind(this.$vm))
  }

  // k-model="xx"
  model(node, exp) {
    // update方法只完成赋值和更新
    this.update(node, exp, 'model')

    // 事件监听
    node.addEventListener('input', e => {
      // 新的值赋值给数据即可
      this.$vm[exp] = e.target.value
    })
  }

  modelUpdater(node, value) {
    // 表单元素赋值
    node.value = value
  }
}