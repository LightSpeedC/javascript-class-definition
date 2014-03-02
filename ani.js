'use strict';

console.log('---- Object ----');

var obj1 = {x: 12, y: "ab"};
var obj2 = new Object;  // または new Object()
obj2.x = 34;
obj2.y = "cd";

var obj3 = [12, "ab"];
var obj4 = new Array(34, "cd");

console.log(obj1 instanceof Object);  // -> true
console.log(obj2 instanceof Object);  // -> true
console.log(obj3 instanceof Object);  // -> true
console.log(obj4 instanceof Object);  // -> true

console.log(obj1.constructor.name);  // -> Object
console.log(obj2.constructor.name);  // -> Object
console.log(obj3.constructor.name);  // -> Array
console.log(obj4.constructor.name);  // -> Array

console.log(obj1.constructor === Object);  // -> true
console.log(obj2.constructor === Object);  // -> true
console.log(obj3.constructor === Array);   // -> true
console.log(obj4.constructor === Array);   // -> true

console.log(obj1 instanceof Array);  // -> false
console.log(obj2 instanceof Array);  // -> false
console.log(obj3 instanceof Array);  // -> true
console.log(obj4 instanceof Array);  // -> true



console.log('---- Animal ----');

// Animal クラス定義
function Animal(name) {
  this.name = name;
}

// Animal クラスのメソッド定義
Animal.prototype.introduce = introduce;

// 自己紹介
function introduce() {
  console.log('私は ' + this.constructor.name + ' の ' + this.name + ' です。');
}

// Animal クラスのインスタンスオブジェクトの作成と利用
var a1 = new Animal('Annie');
a1.introduce();  // -> 私は Animal の Annie です。


var CSI    = '\u001b[';  // ANSI Control Sequence Introducer
var NORMAL = typeof window !== 'undefined' ? '' : CSI + 'm';
var GREEN  = typeof window !== 'undefined' ? '' : CSI + '32m';
var RED    = typeof window !== 'undefined' ? '' : CSI + '31m';
var YELLOW = typeof window !== 'undefined' ? '' : CSI + '33m';

// assertTrue: true であればOK、false の時はエラーメッセージを表示する
function assertTrue(bool, msg) {
  if (!bool) console.log(RED + 'Error: ' + msg + NORMAL);
}

// verifyClassObject: オブジェクトの検証
function verifyClassObject(obj, expected) {
  var name       = expected[0];
  var Class      = expected[1];
  var SuperClass = expected[2];

  // obj は Class のインスタンスだ (new Class で作成したからね)
  assertTrue(obj instanceof Class,
    name + ' は ' + Class.name + ' のインスタンスではない。');

  // obj は SuperClass のインスタンスでもある
  assertTrue(obj instanceof SuperClass,
    name + ' は ' + SuperClass.name + ' のインスタンスではない。');

  // obj は Object のインスタンスでもある
  assertTrue(obj instanceof Object,
    name + ' は ' + Object.name + ' のインスタンスではない。');

  // obj のコンストラクタは Class だ
  assertTrue(obj.constructor === Class,
    name + ' のコンストラクタは ' + obj.constructor.name + ' で、 ' +
    Class.name + ' ではない。');

  // Class のプロトタイプオブジェクトのコンストラクタは Class だ
  assertTrue(Class.prototype.constructor === Class,
    Class.name + ' のプロトタイプは ' + Class.prototype.constructor.name + ' で、 ' +
    Class.name + ' ではない。');

  // obj の __proto__ を見てみると... (互換性が無いので本当は使っちゃいけないキーワードだよ)
  assertTrue(obj.__proto__.constructor === Class,
    name + ' の __proto__ は ' + obj.__proto__.constructor.name + ' で、 ' +
    Class.name + ' ではない。');

  // Class は SuperClass を継承しているんだね
  assertTrue(obj.__proto__.__proto__ === SuperClass.prototype &&
    obj.__proto__.__proto__.constructor === SuperClass &&
    Class.prototype.__proto__.constructor === SuperClass,
    name + ' の __proto__ の __proto__ は ' +
    obj.__proto__.__proto__.constructor.name + ' で、 ' +
    SuperClass.name + ' ではない。');

  // obj の先祖を辿ってみる...
  var expectedString = expected.map(function (fn) {
    return typeof fn === 'function' ? fn.name : fn;
  }).join(' >> ');

  var ancestors = [name];
  for (var obj = obj.__proto__; obj; obj = obj.__proto__)
    ancestors.push(obj.constructor.name);

  var actualString = ancestors.join(' >> ');
  if (actualString === expectedString)
    console.log(GREEN + 'Success: ' + actualString + NORMAL);
  else
    console.log(RED + 'Error: ' + actualString + ', ' + NORMAL +
      YELLOW + 'Expected: ' + expectedString + NORMAL);
  // -> name >> Class >> SuperClass >> Object
}

// a1 >> Animal >> Object かどうか検証してみる
verifyClassObject(a1, ['a1', Animal, Object]);
// -> a1 >> Animal >> Object


console.log('---- Bear ----');

// Bear クラス定義
function Bear(name) {
  Animal.call(this, name);
}

// やっちゃいけない継承、その1
Bear.prototype = Animal.prototype;

// Bear クラスのインスタンスオブジェクトの作成と利用
var b1 = new Bear('Pooh');
b1.introduce();  // -> 私は Animal の Pooh です。

// b1 >> Bear >> Animal >> Object かどうか検証してみる
verifyClassObject(b1, ['b1', Bear, Animal, Object]);
// -> b1 >> Animal >> Object


console.log('---- Cat ----');

// Cat クラス定義
function Cat(name) {
  Animal.call(this, name);
}

// やっちゃいけない継承、その2
Cat.prototype = new Animal;

// Cat クラスのインスタンスオブジェクトの作成と利用
var c1 = new Cat('Kitty');
c1.introduce();  // -> 私は Animal の Kitty です。

// c1 >> Cat >> Animal >> Object かどうか検証してみる
verifyClassObject(c1, ['c1', Cat, Animal, Object]);
// -> c1 >> Animal >> Animal >> Object


console.log('---- Dog ----');

// Dog クラス定義
function Dog(name) {
  this.name = name;
}

// ところで prototype オブジェクトを上書きしていいの?
Dog.prototype = { introduce: introduce };

// Dog クラスのインスタンスオブジェクトの作成と利用
var d1 = new Dog('Hachi');
d1.introduce();  // -> 私は Object の Hachi です。

// d1 >> Dog >> Animal >> Object かどうか検証してみる
verifyClassObject(d1, ['d1', Dog, Object]);
// -> d1 >> Object >> Object



console.log('---- Elephant ----');

// 結果は正しいけど互換性が無い継承
Elephant.prototype.__proto__ = Animal.prototype;

// Elephant クラス定義
function Elephant(name) {
  Animal.call(this, name);
}

// Elephant クラスのインスタンスオブジェクトの作成と利用
var e1 = new Elephant('Dumbo');
e1.introduce();  // -> 私は Elephant の Dumbo です。

// e1 >> Elephant >> Animal >> Object かどうか検証してみる
verifyClassObject(e1, ['e1', Elephant, Animal, Object]);
// -> e1 >> Elephant >> Animal >> Object


console.log('---- Fox ----');

// 正しい継承
Fox.prototype = Object.create(Animal.prototype);
Fox.prototype.constructor = Fox;

// Fox クラス定義
function Fox(name) {
  Animal.call(this, name);
}

// Fox クラスのインスタンスオブジェクトの作成と利用
var f1 = new Fox('Gon');
f1.introduce();  // -> 私は Fox の Gon です。

// f1 >> Fox >> Animal >> Object かどうか検証してみる
verifyClassObject(f1, ['f1', Fox, Animal, Object]);
// -> f1 >> Fox >> Animal >> Object

// console.log(Object.keys(f1));


console.log('---- Gorilla ----');

// 正しい継承
inherits(Gorilla, Animal);

// Gorilla クラス定義
function Gorilla(name) {
  Animal.call(this, name);
}

// console.log(require('util').inherits.toString()); より
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

// Gorilla クラスのインスタンスオブジェクトの作成と利用
var g1 = new Gorilla('Kong');
g1.introduce();
// -> 私は Gorilla の Kong です。

// g1 >> Gorilla >> Animal >> Object かどうか検証してみる
verifyClassObject(g1, ['g1', Gorilla, Animal, Object]);
// -> g1 >> Gorilla >> Animal >> Object


function getFunctionName(fn) {
  return !fn ? fn : 'name' in fn ? fn.name :
    fn.name = ('' + fn).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
}

//Object.defineProperty(Function.prototype, "name", {});
