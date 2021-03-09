// okay, so yeah closures. when we talk about closures, we're almost always talking about the closure _scope_.

// so let's look at something that is NOT a closure:

var lynda = 'phan';

function printFoo() {
  console.log(lynda);
}

// it's not in a closure scope because foo is globally accessible:

console.log(lynda); // 'phan'

// so when we talk about closure scope, it's important for 'encapsulation.' encapsulation is a fancy term we use to
// describe variables that are privately scoped and not accessible for just any ol' code to change. so closure scope === private

// so how do we 'encapsulate'? one way to think about it is having an outer function's scope encapsulate everything inside of it.

// for example, if you just look at function scope:

function printPhan() {
  var foo = 'foo';
  
  console.log(foo);
}

console.log(foo) // TypeError: foo is not undefined

// so here we see that anything inside the function is inaccessible to the global scope. cool. but this is still not a closure scope.
// this is just a function scope. the reason is that foo only lives as long as the function is run--it is created within the function
// when the function is called, logged to the console, and that's it. the other part of a closure is that it remains accessible to everything
// inside of it after the function is returned. so in the previous example, imagine if we could call another function that had access to the
// variable foo. oooooooooo. and it was the only thing that had access to it. with me this far? any questions?

// with you so far!

// okay great. so, we can create a closure by returning a _new_ function from the outer function (:mindblown:). remember that functions are
// first class entities in javascript and so they can be returned from other functions, passed as arguments to functions, etc. it's a little
// tough to wrap your head around at first, but because of that they make great interview questions. so let's do that:

const makePrintBarFn = function() {
  // outer function, here we are 'encapsulating' this new variable bar that we're defining
  var bar = 'bar';
  
  return function() {
    // inner function
    console.log(bar);
  }
};
  
// question: do we always need to return the function?

// great question. yes, you do. let's see why as we go through this.

// okay, so first let's look at our outer function, which we've assigned to the geniusly-named makePrintBarFn. what is its function
// signature? By function signature I mean what it does accept as a parameter, and what (type) does it return?

// it doesn't look like it accepts a parameter, and it returns a function :)
// AWESOME! that is really important to be able to analyze. A+

// okay so then if we wanted to print 'bar' to the console, how would we actually do that with our makePrintBarFn?

// can't we just invoke makePrintBarFn()?
// so let's try that given what we know about the function's signature:
const printBarFn = makePrintBarFn(); 
// what is printBarFn?

// it's a function

// yep, it's a function. remember that closures have an inner and outer function. the inner function allows us to defer execution even
// though the outer function has returned (returned meaning it has completed/run all the way through/we have its return value). so now
// because it retruns a function, we can call the _inner_ function wherever and whenver we want. check it out:

printBarFn(); // 'bar'
printBarFn(); // 'bar'
printBarFn(); // 'bar'

// global scope
console.log(bar); // TypeError: bar is not defined

// wow!! so bar is perfectly encapsulated within printBarFn, always accessible to it, but totally inaccessible anywhere outside it.
// with me so far? do you see why we have to return the function?

// I think I do, but it seems like you would only use it if you need access to a small amount of information. Right now, I don't see why you would need to call
// printBarFn() INSTEAD of makePrintBarFn()

// right, this example is stupid and contrived, so that's a reasonable confusion. let's say we don't return the function:
  
const makePrintBarFn = function() {
  var bar = 'bar';
  
  // FYI: console.log returns undefined
  return console.log(bar);
};

// here nothing is deferred. you have no private scope that gets deferred for later execution
makePrintBarFn(); // 'bar'  
// in this stupid contrived example, that's fine because bar is just a constant value. but let's do something more interesting:

function add(x) {
  return function(y) {
    return x + y;
  }
}

// our signature has changed a little bit because we're now accepting parameters. but the usage is the same. before we created 'bar'
// in our outer scope, but 'x' is now our 'bar'. even though it's a parameter, it is technically created as a variable in the outer function.
// let's see how we use this:

const add2 = add(2);  // returns a NEW function
add2(5) // 7
const add4 = add(4); 
add4(5) // 9

add(6)(7) // 13. does this syntax look funny? it might, it's kinda weird. but why does it work?

// add(6) // this returns a function, let's call it add6. but instead of assigning it to a variable, let's just imagine its return value:
// add(6)(7) -> newFnThatAdds6(7) -> 13. the two functions get invoked left to right. so it just skips the intermediate variable assignment.

// anywho, certainly we could have just done this:
function addImmediately(x, y) {
  return x + y;
}

// but there are two disadvantages here:
// 1. in the previous case, we didn't actually know y right away. we knew x, and we were able to wait until we knew what y was to make the calculation.
//    this is called partial invocation, or 'currying.' we actually use it a lot in the frontend! i'll give a real life react example later
// 2. we don't this nice reusable add2 function, which we can use all over the place to add 2 to something without having to use both variables.

// still contrived, i know, but hopefully it makes a little more sense.

// so this basically covers the essense of what a closure is and a couple of pitfalls that i saw a lot while asking about them in interviews:
// 1. thinking that simple 'outer function scope' or global scope is the same as closure scope, which we clearly see it isn't.
// 2. not returning a function and so not benefiting from deferred access to the closure scope!

// okay so last two things:

// 1. real life react example:

var myFamily = ['lucas', 'katie', 'teddy', 'emily'],
    logFamilyMember = (child) => () => console.log(child);

return (
  <ul>
    {myFamily.map((child) => (
      <li onClick={logFamilyMember(child)}>{child}</li>
    ))}
  </ul>
);

// so here the content is contrived but the functionality is very real--we have a list of items and are binding a click handler to each one
// but we want each click handler to be bound to the item in the list. logFmailyMember is an outer function that returns a new function that
// has deferred access to the 'child' variable. in this case, 'deferred' means whenever the <li> element is clicked!

// there are other variations but they ultimately do the same thing: create a new function for deferred access to private variable scope.
// in underscore, the helper library, it would be with a _.partial method:

var myFamily = ['lucas', 'katie', 'teddy', 'emily'],
    // okay here we are no longer returning a function, we execute it directly
    logFamilyMember = (child) => console.log(child);

return (
  <ul>
    {myFamily.map((child) => (
      {/* but here we're not invoking the 'outer' function of logFamilyMember the way we invoked it above (because of the invocation parentheses () */}
      {/* instead we invoke this _.partial method, which takes a function as an argument, and then the functions parameters as the other arguments */}
      {/* so _.partial(fn, ...args) just returns, again, a new fn, which you can think of as: */}
      {/*               partial(fn, args) => () => fn(...args)                  */}
      {/* same thing as we did above! an outer function defining variables in a private scope and returning a new function that has access to it. that's a closure! */}
      <li onClick={_.partial(logFamilyMember, child)}>{child}</li>
    ))}
  </ul>
);


// okay so to finish off this 'lesson', here's the example i have from my interview q's doc, you can do it yourself now:
// using the notion of closure, how can we create a `once` method that only invokes a function at most one time:

const sayHi = console.log('hi, emily!');
const sayHiOnce = once(sayHi);

sayHiOnce(); // hi, emily!
sayHiOnce(); // undefined
sayHiOnce(); // undefined

// your task is to define once:
function once() {
}

// (first step as a hint: give the example on line 181, what is once's signature?)