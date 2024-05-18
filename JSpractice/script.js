//variable
let int = 10;
let double = 10.01;
let boolean = true;
let name = "Paul";

//constant
const interestRate = 0.3;

//object (let || const)
let person = {
  name: "Paul",
  age: 20,
  hobbies: ["Gaming", "Coding"],
  address: {
    street: "Burgos",
    city: "Bacolod",
    province: "Negros Occidental",
  },
};
person.name = "David";
person[name] = "David";

//array
let selectedColors = ["red", "blue", "green"];
selectedColors[3] = "yellow";

//method || function
function greet(name) {
  console.log("Hello " + name);
}
greet("Xenhusk");

let x = "2",
  y = 3,
  z = 5;

let fname = "kyrell";
let newname;
for (i = fname.length - 1; i >= 0; i--) {
  newname += fname.charAt(i);
  console.log(newname);
}
console.log(newname);
