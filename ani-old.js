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

function introduce() {
  console.log('こんにちは。私の名前は ' + this.name + ' です。私は ' + this.constructor.name + ' です。');
}

// Animal クラスのインスタンスオブジェクトの作成と利用
var a1 = new Animal('Annie');
a1.introduce();
// -> Hello, My name is Annie


// true であればOK、false の時はエラーメッセージを表示する
function assertTrue(bool, msg) {
  if (!bool) console.log('\u001b[31mError: ' + msg + '\u001b[m');
}

function verifyClassObject(obj, name, Class, SuperClass) {
  // obj は Class のインスタンスだ (new Class で作成したからね)
  assertTrue(obj instanceof Class, name + ' is not instance of ' + Class.name);

  // obj は SuperClass のインスタンスでもある
  assertTrue(obj instanceof SuperClass, name + ' is not instance of ' + SuperClass.name);

  // obj は Object のインスタンスでもある
  assertTrue(obj instanceof Object, name + ' is not instance of ' + Object.name);

  // obj のコンストラクタは Class だ
  assertTrue(obj.constructor === Class,
    'constructor of ' + name + ' is ' + obj.constructor.name + ', not ' + Class.name);

  // Class のプロトタイプオブジェクトのコンストラクタは Class だ
  assertTrue(Class.prototype.constructor === Class,
    'prototype of ' + Class.name + ' is ' + Class.prototype.constructor.name + ', not ' + Class.name);

  // obj の __proto__ を見てみると... (互換性が無いので本当は使っちゃいけないキーワードだよ)
  //assertTrue(obj.__proto__ === Class.prototype,
  //  'xxx __proto__ of ' + name + ' is ' + obj.__proto__.constructor.name + ', not ' + Class.prototype.constructor.name);
  assertTrue(obj.__proto__.constructor === Class,
    '__proto__ of ' + name + ' is ' + obj.__proto__.constructor.name + ', not ' + Class.name);

  // Class は SuperClass を継承しているんだね
  assertTrue(obj.__proto__.__proto__ === SuperClass.prototype &&
    obj.__proto__.__proto__.constructor === SuperClass &&
    Class.prototype.__proto__.constructor === SuperClass,
    '__proto__ of __proto__ of ' + name + ' is ' + obj.__proto__.__proto__.constructor.name +
    ', not ' + SuperClass.name);
}

function verifyAncestors(obj, name, expected) {
  // obj の先祖を辿ってみる...
  var ancestors = [name];
  var expectedArray = expected.map(function (f) { return f.name; });
  expectedArray.unshift(name);
  var expectedString = expectedArray.join(' >> ');
  for (var obj = obj.__proto__; obj; obj = obj.__proto__)
    ancestors.push(obj.constructor.name);
  var actualString = ancestors.join(' >> ');
  if (actualString === expectedString)
    console.log('\u001b[32mSuccess: ' + actualString + '\u001b[m');
  else
    console.log('\u001b[31mError: ' + actualString + ', \u001b[m' +
      '\u001b[33mExpected: ' + expectedString + '\u001b[m');
  // name >> Class >> SuperClass >> Object
}

// a1 が Animal, Object かどうか検証してみる
verifyClassObject(a1, 'a1', Animal, Object);

// a1 の先祖を辿ってみる...
verifyAncestors(a1, 'a1', [Animal, Object]);
// a1 -> Animal -> Object





console.log('---- Bear ----');

// Bear クラス定義
function Bear(name) {
  Animal.call(this, name);
}

// やっちゃいけない継承、その1
Bear.prototype = Animal.prototype;

// Bear クラスのインスタンスオブジェクトの作成と利用
var b1 = new Bear('Pooh');
b1.introduce();
// -> Hello, My name is Pooh

// b1 が Bear, Animal かどうか検証してみる
verifyClassObject(b1, 'b1', Bear, Animal);

// b1 の先祖を辿ってみる...
verifyAncestors(b1, 'b1', [Bear, Animal, Object]);
// b1 -> Animal -> Object


console.log('---- Cat ----');

// Cat クラス定義
function Cat(name) {
  Animal.call(this, name);
}

// やっちゃいけない継承、その2
Cat.prototype = new Animal;

// Cat クラスのインスタンスオブジェクトの作成と利用
var c1 = new Cat('Kitty');
c1.introduce();
// -> Hello, My name is Kitty

// c1 が Cat, Animal かどうか検証してみる
verifyClassObject(c1, 'c1', Cat, Animal);

// c1 の先祖を辿ってみる...
verifyAncestors(c1, 'c1', [Cat, Animal, Object]);
// c1 -> Animal -> Animal -> Object


console.log('---- Dog ----');

// Dog クラス定義
function Dog(name) {
  this.name = name;
}

// ところで prototype オブジェクトを上書きしていいの?
Dog.prototype = { introduce: introduce };

// Dog クラスのインスタンスオブジェクトの作成と利用
var d1 = new Dog('Hachi');
d1.introduce();
// -> Hello, My name is Hachi

// d1 が Dog, Animal かどうか検証してみる
verifyClassObject(d1, 'd1', Dog, Object);

// d1 の先祖を辿ってみる...
verifyAncestors(d1, 'd1', [Dog, Object]);
// d1 -> Dog -> Animal -> Object



console.log('---- Elephant ----');

// 結果は正しいけど互換性が無い継承
Elephant.prototype.__proto__ = Animal.prototype;

// Elephant クラス定義
function Elephant(name) {
  Animal.call(this, name);
}

// Elephant クラスのインスタンスオブジェクトの作成と利用
var e1 = new Elephant('Dumbo');
e1.introduce();
// -> Hello, My name is Dumbo


// e1 が Elephant, Animal かどうか検証してみる
verifyClassObject(e1, 'e1', Elephant, Animal);

// e1 の先祖を辿ってみる...
verifyAncestors(e1, 'e1', [Elephant, Animal, Object]);
// e1 -> Object -> Object


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
f1.introduce();
// -> Hello, My name is Gon

// f1 が Fox, Animal かどうか検証してみる
verifyClassObject(f1, 'f1', Fox, Animal);

// f1 の先祖を辿ってみる...
verifyAncestors(f1, 'f1', [Fox, Animal, Object]);
// f1 -> Fox -> Animal -> Object


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
// -> Hello, My name is Gon

// g1 が Fox, Animal かどうか検証してみる
verifyClassObject(g1, 'g1', Gorilla, Animal);

// g1 の先祖を辿ってみる...
verifyAncestors(g1, 'g1', [Gorilla, Animal, Object]);
// g1 -> Gorilla -> Animal -> Object

