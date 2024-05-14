//variable
let int = 10;
let double = 10.01;
let boolean = true;
let name = 'Paul';

//constant
const interestRate = 0.3;

//object (let || const)

let person = {
    name: 'Paul',
    age: 20,
    hobbies: ['Gaming', 'Coding'],
    address: {
        street: 'Burgos',
        city: 'Bacolod',
        province: 'Negros Occidental'
    }
};
person.name = 'David';
person[name] = 'David';

//array
let selectedColors = ['red', 'blue', 'green'];
selectedColors[3] = 'yellow';

//method || function
function greet(name){
    console.log('Hello ' + name);
}
greet('Xenhusk');