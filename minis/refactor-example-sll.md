# An Example of Refactoring

I was going through my code for the exercise on singly linked list, and realized I was a cleaning up a decent number of lines of code. Instead of just showing you guys the end product, let's take the opportunity to demo the importance and value of refactoring.

Let's start with `SinglyLinkedList.__valid`.

## Input Validation & Extracting Common Functionality

I found myself doing a lot of the same kind of input validation in the methods that take `index` as input. After the 2nd or 3rd time I wrote `if (index < 0 || index >= this.length)`, I figured index validation should be broken out into a helper.

Eventually, I ended up with a validator that cleaned input to `index` based on the following criteria.

### Valid Input for an Index

1. Unless we want to support counting from the back, index should be `>= 0`.
1. It should be less than the current length of the list.
   1. Length is not zero indexed, and our positional indexes are.
   1. The last item in the list will always have an index value equal to `list.length - 1`.
   1. You may think that we will want to accept zero if our list is of length zero, but actually I'd argue we still want this to fail. We only accept index input for functions that are intended to access or modify nodes within the list. If our list has no length, and therefore no nodes, it doesn't make any sense to allow the user to try and access or modify nodes that do not exist.
1. It should always be a number.

### Version 1.0

Originally, I named the function `SinglyLinkedList.prototype.inBounds`:

```js
SinglyLinkedList.prototype.inBounds = function (index) {
  return index < this.length && index >= 0;
};
```

As you may already notice, this is a bit different than the conditional I was using before. When I decided to name the function `inBounds`, I decided to have the logic fit the name of the function. Thus, rather than checking that `index` is _out of bounds_, the newer version now returns `true` if the index is _in bounds_.

Now, I eventually ended up with a function called `__valid` and this one is called `inBounds`, so spoiler alert, it's not quite finished yet. However, at this point I had something I could use in the other methods that took `index` as an argument:

```diff
SinglyLinkedList.prototype.__getNodeAt = function(index) {
-  if (index >= this.length || index < 0) { return undefined; }
+  if (!this.inBounds(index)) { return undefined; }

};
```

Later on, I realized that I should also make sure that `index` is passed as a number. Now that the method would be validating the inputs type as well as its value, a name change was in order. Semantically, `inBounds` communicates that the numerical value of `index` is valid for the list. However, `inBounds` doesn't communicate that the method will now also do a type check. To more effectively express this difference I changed the name to `valid`, and then to `__valid` to adhere to the coding style established with `__getNodeAt`.

I feel a little pedantic even writing about this tiny change, but the difference is important. Always attempt to write your code as expressively as you can. If you use descriptive and informative identifiers, it makes your code much easier to understand for yourself and other programmers.

## Brevity is Clarity

I'm sure this isn't a new or groundbreaking idea. Conciseness is a crucial component of clear communication. That's why nobody can read legal documents. When a sentence is 36 lines long and has 6 semi-colons, by the time you've gotten to the end you're lost. Source code is the same in this regard. By removing lines of code that have no function or are unnecessarily repetitive, what remains is easier to grasp.

This kind of refactoring can be taken too far. Remember that the goal is not brevity for brevity's sake, but in service of _clarity_. If performance becomes an issue, then do what you must to optimize, but don't solve a problem like that until it's actually a problem.

### Case Study: `.remove`

My first iteration of `remove` passed all the tests and seemed to function just fine. When I looked at it though, I got a strong whiff of code smell, which must be exterminated :fire:.

#### First Version

```js
SinglyLinkedList.prototype.remove = function(index) {
  let result;
  if (this.length === 0 || !this.inBounds(index)) { return null; }
  if (index === 0 && this.length === 1) {
    result = this.head.val;
    this.clear();
  }
  else {
    let target = this.__getNodeAt(index);
    let previous = this.__getNodeAt(index - 1);
    previous.next = target.next;
    result = target.val;
    --this.length;
  }
  return result;
};
```

Yuck. I don't know what I was thinking. To start cleaning up, I worked on removing that `else` statement. This is a common pattern. Inside of a function, you will often see a trailing `else` is left out, while `return` is used to exit the function early if necessary. Lets apply that to my naive version of `remove`:

```js
  /* above unchanged */
    return result;
  } // ends the if

  let target = this.__getNodeAt(index);
  let previous = this.__getNodeAt(index - 1);
  previous.next = target.next;
  result = target.val;
  --this.length;

  return result;
};
```

That's a little better, but I still have an issue with `result`. It's a little gross that it is mutated in 2 different places, and by the time it returns at the end of the function you forget where `result` came from. We can clean that up though. The function of the 2nd `if` statement is to deal with the edge case where we are removing index `0` from a `SinglyLinkedList` of only one node. In this case, we don't want to do any fancy reassignment of pointers. We just want to grab the node, cache it's value to return, and then clear out the list. Rather than declaring `result` at the top of the function, we can just move it into the relevant `if`.

```js
SinglyLinkedList.prototype.remove = function(index) {
  // let result;
  if (this.length === 0 || !this.inBounds(index)) { return null; }
  if (index === 0 && this.length === 1) {
    // result = this.head.val;
    let result = this.head.val;
    this.clear();
    return result;
  }
```

Starting to shape up a little bit, but right now the tests will fail because `result` only exists within that `if` block. Conveniently enough, we don't actually need `result` outside of that block anymore. If the list has more than 1 node, we can't clear it out to remove one, but this also means that we don't need to create a variable to cache the value that we want to return.

```js
  /* above unchanged */
  } // ends the if

  let target = this.__getNodeAt(index);
  let previous = this.__getNodeAt(index - 1);
  previous.next = target.next;
  // result = target.val;
  --this.length;

  // return result;
  return target.val;
};
```

Nice. Looking much better now. Now let's make the change to using `__valid` over `.inBounds` to clean our input, and get rid of the redundant `this.length === 0` check.

```js
SinglyLinkedList.prototype.remove = function(index) {
  if (!this.__valid(index)) { return null; }
  /* ... */
```

Finally, we can remove `index === 0` from the 2nd `if`. We already validate `index` with `__valid`. We don't need to recheck it again. With that, we arrive at my final revision of `remove`:

```js
// Remove a Node by index and return its value
SinglyLinkedList.prototype.remove = function(index) {
  if (!this.__valid(index)) { return null; }
  if (this.length === 1) {
    let result = this.head.val;
    this.clear();
    return result;
  }
  let target = this.__getNodeAt(index);        // Node to remove
  let previous = this.__getNodeAt(index - 1);  // the one before target
  previous.next = target.next;                 // jump target
  --this.length;

  return target.val;
};
```
