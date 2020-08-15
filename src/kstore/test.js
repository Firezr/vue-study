class Test {
  constructor(){
    this.a = 1
  }

  get state(){
    console.log('get', this.a);
    return this.a
  }
  set state(a){
    this.a = a
    console.log('set', this.a);
  }

  setState(a){
    this.state++
    console.log('setState', this.a);
  }
}

const test = new Test();
// test.state = 2
test.setState(3)

console.log(test.a);