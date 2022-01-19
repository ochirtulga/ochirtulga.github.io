x = 1;
var a = 5;
var b = 10;
var c = function(a, b, c) {
    var x = 10;
    console.log(x);
    console.log(a);
    var f = function(a, b, c) {
        b = a;
        console.log(b);
        b = c;
        var x = 5;
    }
    f(a,b,c);
    console.log(b);
}
c(8,9,10);
console.log(b);
console.log(x);




//8
var obj = {
	name : "fred",
	major : "music",
	textFunc : function(a, b) { 
		if(a == b) return a * b;
		if(a < b) return a;
		return b;
	} 
};

//9
class Employee {
    constructor(name, salary, position){
        this.name = name;
        this.salary = salary;
        this.position = position;
    }
}

Emp1 = new Employee();
Emp2 = new Employee("a",100,1);
Emp3 = new Employee("b",200,2);

//10
function testFunc() {
    for(let i = 0; i < arguments.length; i++){
        console.log(arguments[i].product);
    }
}

//11
((a,b,c) => {
    return Math.max(a,b,c);
})();
