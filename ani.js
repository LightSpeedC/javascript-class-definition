'use strict';

// 互換性対応のおまじない。主に IE。

// Object.prototype.__defineGetter__ 定義
if (!Object.prototype.__defineGetter__ && Object.defineProperty)
  Object.defineProperty(Object.prototype, '__defineGetter__', {
    value: function (name, func) {
      Object.defineProperty(this, name,
        {get: func, enumerable: true, configurable: true});
    }, enumerable: false, configurable: true});

// Object.prototype.__defineSetter__ 定義
if (!Object.prototype.__defineSetter__ && Object.defineProperty)
  Object.defineProperty(Object.prototype, '__defineSetter__', {
    value: function (name, func) {
      Object.defineProperty(this, name,
        {set: func, enumerable: true, configurable: true});
    }, enumerable: false, configurable: true});

// Function.prototype.name 定義
if (!('name' in Function.prototype))
  Function.prototype.__defineGetter__('name', function () {
    return ('' + this).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
  });


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

console.log(obj1.constructor === Object);  // -> true
console.log(obj2.constructor === Object);  // -> true
console.log(obj3.constructor === Array);   // -> true
console.log(obj4.constructor === Array);   // -> true

console.log(obj1 instanceof Array);  // -> false
console.log(obj2 instanceof Array);  // -> false
console.log(obj3 instanceof Array);  // -> true
console.log(obj4 instanceof Array);  // -> true

console.log(obj1.constructor.name);  // -> Object
console.log(obj2.constructor.name);  // -> Object
console.log(obj3.constructor.name);  // -> Array
console.log(obj4.constructor.name);  // -> Array



var x1 = {w: 10, h: 20, calc: function () { return this.w * this.h; }};
var x2 = {w: 20, h: 30, calc: function () { return this.w * this.h; }};

console.log(x1.calc());            // -> 200
console.log(x2.calc());            // -> 600
console.log(x1.calc === x2.calc);  // -> false
console.log(x1.calc.toString() === x2.calc.toString());  // -> true


function calc() {
  return this.w * this.h;
}

var x3 = {w: 10, h: 20, calc: calc};
var x4 = {w: 20, h: 30, calc: calc};

console.log(x3.calc());            // -> 200
console.log(x4.calc());            // -> 600
console.log(x3.calc === x4.calc);  // -> true


var x5 = {w: 10, h: 20, get area() { return this.w * this.h; }};
var x6 = {w: 20, h: 30, get area() { return this.w * this.h; }};

console.log(x5.area);            // -> 200
console.log(x6.area);            // -> 600



console.log('---- Animal ----');

// Animal クラス定義
function Animal(name) {
  this.name = name;
}

// Animal クラスのメソッド定義
Animal.prototype.introduce = function introduce() {
  console.log('私は ' + this.constructor.name + ' の ' + this.name + ' です。');
};

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
function verifyClassObject(obj, expected, keysExpected) {
  var name       = expected[0];
  var Class      = expected[1];
  var SuperClass = expected[2];

  var keys = [];
  for (var i in obj)
    keys.push(i);
  var keysActual = keys.join(',');
  if (keysActual === keysExpected)
    console.log(GREEN + 'Success: keys = ' + keysActual + NORMAL);
  else
    console.log(RED + 'Error: keys = ' + keysActual + ', ' + NORMAL +
      YELLOW + 'Expected: keys ' + keysExpected + NORMAL);

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
verifyClassObject(a1, ['a1', Animal, Object], 'name,introduce');
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
verifyClassObject(b1, ['b1', Bear, Animal, Object], 'name,introduce');
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
verifyClassObject(c1, ['c1', Cat, Animal, Object], 'name,introduce');
// -> c1 >> Animal >> Animal >> Object


console.log('---- Dog ----');

// Dog クラス定義
function Dog(name) {
  this.name = name;
}

// 無理やり constructor と __proto__ を使って prototype オブジェクトを上書きする
Dog.prototype = {
  constructor: Dog,
  __proto__: Animal.prototype
};

// Dog クラスのインスタンスオブジェクトの作成と利用
var d1 = new Dog('Hachi');
d1.introduce();  // -> 私は Object の Hachi です。

// d1 >> Dog >> Animal >> Object かどうか検証してみる
verifyClassObject(d1, ['d1', Dog, Animal, Object], 'name,introduce');
// -> d1 >> Dog >> Animal >> Object



console.log('---- Elephant ----');

// Elephant クラス定義
function Elephant(name) {
  Animal.call(this, name);
}

// 結果は正しいけど互換性が無い継承
Elephant.prototype.__proto__ = Animal.prototype;

// Elephant クラスのインスタンスオブジェクトの作成と利用
var e1 = new Elephant('Dumbo');
e1.introduce();  // -> 私は Elephant の Dumbo です。

// e1 >> Elephant >> Animal >> Object かどうか検証してみる
verifyClassObject(e1, ['e1', Elephant, Animal, Object], 'name,introduce');
// -> e1 >> Elephant >> Animal >> Object


console.log('---- Fox ----');

// Fox クラス定義
function Fox(name) {
  Animal.call(this, name);
}

// 正しい継承
Fox.prototype = Object.create(Animal.prototype);
Fox.prototype.constructor = Fox;

// Fox クラスのインスタンスオブジェクトの作成と利用
var f1 = new Fox('Gon');
f1.introduce();  // -> 私は Fox の Gon です。

// f1 >> Fox >> Animal >> Object かどうか検証してみる
verifyClassObject(f1, ['f1', Fox, Animal, Object], 'name,introduce');
// -> f1 >> Fox >> Animal >> Object

// console.log(Object.keys(f1));


console.log('---- Gorilla ----');

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

// 正しい継承
inherits(Gorilla, Animal);

// Gorilla クラスのインスタンスオブジェクトの作成と利用
var g1 = new Gorilla('Kong');
g1.introduce();
// -> 私は Gorilla の Kong です。

// g1 >> Gorilla >> Animal >> Object かどうか検証してみる
verifyClassObject(g1, ['g1', Gorilla, Animal, Object], 'name,introduce');
// -> g1 >> Gorilla >> Animal >> Object


var a1 = new Animal('Annie');
a1.introduce();        // -> 私は Animal の Annie です。
console.log(a1.name);  // -> Annie
a1.name = 'Aho';
a1.introduce();        // -> 私は Animal の Aho です。
console.log(a1.name);  // -> Aho


// Animal2 クラス定義
function Animal2(name) {
  this.introduce = function introduce() {
    console.log('私は ' + this.constructor.name + ' の ' + name + ' です。');
  };
}


var a1 = new Animal2('Annie');
a1.introduce();        // -> 私は Animal2 の Annie です。
console.log(a1.name);  // -> undefined
a1.name = 'Aho';
a1.introduce();        // -> 私は Animal2 の Annie です。
console.log(a1.name);  // -> Aho



function Animal3(name) {
  this.name = name;
  this.animalProp = 123;
}

Animal3.prototype.animalCommonProp = 'abc';

var a1 = new Animal3('Annie');
console.log(a1.animalProp + ' ' + a1.animalCommonProp);
// -> 123 abc
a1.animalProp = 456;
a1.animalCommonProp = 'xyz';
console.log(a1.animalProp + ' ' + a1.animalCommonProp);
// -> 456 xyz
delete a1.animalProp;
delete a1.animalCommonProp;
console.log(a1.animalProp + ' ' + a1.animalCommonProp);
// -> undefined abc


  // http://news.mynavi.jp/articles/2010/09/09/ie9-ie8-getter-setter-javascript/
  // emulate legacy getter/setter API using ES5 APIs
  if (!Object.prototype.__defineGetter__ && Object.defineProperty)
    Object.defineProperty(Object.prototype, '__defineGetter__', {
      value: function (name, func) {
        Object.defineProperty(this, name,
          {get: func, enumerable: true, configurable: true});
      }, enumerable: false, configurable: true});
  if (!Object.prototype.__defineSetter__ && Object.defineProperty)
    Object.defineProperty(Object.prototype, '__defineSetter__', {
      value: function (name, func) {
        Object.defineProperty(this, name,
          {set: func, enumerable: true, configurable: true});
      }, enumerable: false, configurable: true});

  // http://subtech.g.hatena.ne.jp/mayuki/20131212/1386864073
  if (!Object.prototype.__defineGetter__ && Object.defineProperty)
    Object.defineProperty(Object.prototype, '__defineGetter__', {
      value: function (name, func) {
        var propDesc = Object.getOwnPropertyDescriptor(this) || {};
        propDesc.configurable = true;
        propDesc.get = func;
        Object.defineProperty(this, name, propDesc);
      }, enumerable: false, configurable: true});
  if (!Object.prototype.__defineSetter__ && Object.defineProperty)
    Object.defineProperty(Object.prototype, '__defineSetter__', {
      value: function (name, func) {
        var propDesc = Object.getOwnPropertyDescriptor(this) || {};
        propDesc.configurable = true;
        propDesc.set = func;
        Object.defineProperty(this, name, propDesc);
      }, enumerable: false, configurable: true});
