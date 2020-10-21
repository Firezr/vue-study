class A {
  m = {
    add(m,n) {
      return m+n
    }
  }
  n = 'n' 
  constructor() {

  }

  // 静态属性
  static util = {
    add(m,n) {
      return m+n
    }
  }
}


let a = new A()

console.log(A.util.add(1,2));
console.log(a.n);