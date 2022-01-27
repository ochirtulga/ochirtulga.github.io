var Module = (function() {
    theEmp = {
        name: "",
        salary: 0
    }

    var increaseSalary = function() {
        return salary;
    }

    theEmp.increaseSalary = increaseSalary;
    return theEmp;
})();



// x = 1;
// var a = 5;
// var b = 10;
// var c = function(a, b, c) {
//     var x = 10;
//     console.log(x);
//     console.log(a);
//     var f = function(a, b, c) {
//         b = a;
//         console.log(b);
//         b = c;
//         var x = 5;
//     }
//     f(a,b,c);
//     console.log(b);
// }
// c(8,9,10);
// console.log(b);
// console.log(x);

// x = 1;
// var a = 5;
// var b = 10;
// var c = function(a, b, c) {
//     console.log(x);
//     console.log(a);
//     var f = function(a, b, c) {
//         b = a;
//         console.log(b);
//         b = c;
//         var x = 5;
//     }
//     f(a,b,c);
//     console.log(b);
//     var x = 10;
// }
// c(8,9,10);
// console.log(b);
// console.log(x);


// var x = 9;
// function myFunction() {
// return x * x;
// }
// console.log(myFunction());
// x = 5;
// console.log(myFunction());

// var foo = 1;
// function bar() {
// if (!foo) {
// var foo = 10;
// }
// alert(foo);
// }
// bar();


// var count = (function () {
//     let counter = 0;
//     return  {
//         add: function() { 
//             if(arguments.length == 0) {
//                 return counter += 1; 
//             }
//             else {
//                 return counter += arguments[0];
//             }
//         }, 
//         reset: function() { return counter = 0; },
//         print: function() { return counter; } 
//     }
// })();
	
// function make_adder(inc) {
//     return function () {count.add(inc);}
// }

// count.add();
// console.log(count.print());
// count.add();
// console.log(count.print());
// count.add();
// console.log(count.print());
// count.reset();
// console.log(count.print());

// var add5 =  make_adder(5);
// var add7 = make_adder(7);

// add5(); add5(); add5();
// console.log(count.print());

// count.reset();

// add7(); add7(); add7();
// console.log(count.print());


// // const promise = new Promise((resolve, reject) => {
// //     resolve("Hattori");
// //     setTimeout(()=> reject("Yoshi"), 500);
// //     });
// //     promise.then(val => alert("Success: " + val))
// //      .catch(e => alert("Error: " + e));


// function job(state) {
//     return new Promise(function(resolve, reject) {
//         if (state) {
//             resolve('success');
//         } else {
//             reject('error');
//         }
//     });
// }
   
// let promise = job(true);
   
// promise.then(function(data) {
//     console.log(data);
//     return job(false);
// }).catch(function(error) {
//     console.log(error);
//     return 'Error caught';
// });


// //Revealing Module
// var Module = (function () {
//     let name = "";
//     let age = 0;
//     let salary = 0;
//     let getAge = function() { return age; };
//     let getSalary = function() { return salary; };
//     let getName = function() { return name; };
//     let setAge = function(newAge) { this.age = newAge };
//     let setSalary = function(newSalary) { this.salary = newSalary };
//     let setName = function(newName) { this.name = newName };
//     let increaseSalary = function(percentage) {
//             let currentSalary = getSalary();
//             this.setSalary(currentSalary *= percentage);
//         };
//     let incrementAge = function() {
//             let currentAge = getAge();
//             this.setAge(currentAge += 1);
//         };
//     return {
//         setAge: setAge,
//         setSalary: setSalary,
//         setName: setName,
//         increaseSalary: increaseSalary,
//         incrementAge: incrementAge
//     }
// })();

// Module.setName("Ochirtulga");
// Module.setAge(23);
// Module.setSalary(100);

// console.log(Module.name);
// console.log(Module.age)
// console.log(Module.salary);


// //Anonymously scoped
// var Module1 = (function () {
//     let name = "";
//     let age = 0;
//     let salary = 0;
//     let getAge = function() { return age; };
//     let getSalary = function() { return salary; };
//     let getName = function() { return name; };
//     return {
//         setAge: function(newAge) { this.age = newAge },
//         setSalary: function(newSalary) { this.salary = newSalary },
//         setName: function(newName) { this.name = newName },
//         increaseSalary: function(percentage) {
//             let currentSalary = getSalary();
//             this.setSalary(currentSalary *= percentage);
//         },
//         incrementAge: function() {
//             let currentAge = getAge();
//             this.setAge(currentAge += 1);
//         }
//     }
// })();


// Module1.setName("Biki");
// Module1.setAge(24);
// Module1.setSalary(150);


// console.log(Module1.name);
// console.log(Module1.age)
// console.log(Module1.salary);


// //Locally scoped
// var Module2 = (function () {
//     var name = "";
//     var age = 0;
//     var salary = 0;

//     var emp = {};

//     let getAge = function() { return emp.age; };
//     let getSalary = function() { return emp.salary; };
//     let getName = function() { return emp.name; };

//     emp.setAge = function(newAge) { this.age = newAge };
//     emp.setSalary = function(newSalary) { this.salary = newSalary };
//     emp.setName = function(newName) { this.name = newName };
//     emp.increaseSalary = function(percentage) {
//             let currentSalary = getSalary();
//             this.setSalary(currentSalary *= percentage);
//         };
//         emp.incrementAge = function() {
//             let currentAge = getAge();
//             this.setAge(currentAge += 1);
//         };
//     return emp;
// })();


// /* */
// // function Employee(name, age, salary) {
// //     this.name = name;
// //     this.age = age;
// //     this.salary = salary;
// // }

// Module2.setName("Nasa");
// Module2.setAge(24);
// Module2.setSalary(130);

// Module.extension() = function () { 
//     let address;
//     let getAddress = function () { return address; };
//     return {
//         setAddress: function(newAddress) {
//             this.address = newAddress;
//         }
//     }
// };


// console.log(Module2.name);
// console.log(Module2.age)
// console.log(Module2.salary);


// var Module = (function () {
//     let name = "";
//     let age = 0;
//     let salary = 0;
//     let getAge = function() { return age; };
//     let getSalary = function() { return salary; };
//     let getName = function() { return name; };
//     return {
//         setAge: function(newAge) { this.age = newAge },
//         setSalary: function(newSalary) { this.salary = newSalary },
//         setName: function(newName) { this.name = newName },
//         increaseSalary: function(percentage) {
//             let currentSalary = getSalary();
//             this.setSalary(currentSalary *= percentage);
//         },
//         incrementAge: function() {
//             let currentAge = getAge();
//             this.setAge(currentAge += 1);
//         }
//     }
// })();

// //8
// var obj = {
// 	name : "fred",
// 	major : "music",
// 	textFunc : function(a, b) { 
// 		if(a == b) return a * b;
// 		if(a < b) return a;
// 		return b;
// 	} 
// };



// //9
// // class Employee {
// //     constructor(name, salary, position){
// //         this.name = name;
// //         this.salary = salary;
// //         this.position = position;
// //     }
// // }

// Emp1 = new Employee();
// Emp2 = new Employee("a",100,1);
// Emp3 = new Employee("b",200,2);

// //10
// function testFunc() {
//     for(let i = 0; i < arguments.length; i++){
//         console.log(arguments[i].product);
//     }
// }

// //11
// ((a,b,c) => {
//     return Math.max(a,b,c);
// })();


