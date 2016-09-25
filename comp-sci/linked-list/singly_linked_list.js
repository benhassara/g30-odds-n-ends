'use strict'

function Node(val, next=null) {
  this.val = val;
  this.next = next;
}

function SinglyLinkedList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

// Helper to check whether an input is in the bounds of the list
SinglyLinkedList.prototype.__valid = function (index) {
  return (index < this.length) && (index >= 0) && (typeof index === 'number');
};

// Helper to return a Node at a given index
SinglyLinkedList.prototype.__getNodeAt = function(index) {
  // if arg is out of bounds, return undefined
  if (!this.__valid(index)) { return undefined; }

  // set starting node
  let current = this.head;
  // loop .next until we reach the passed index
  for (let i = 0; i < index; i++) {
    current = current.next;
  }

  return current;
};

// Add onto the tail
SinglyLinkedList.prototype.push = function(val) {
  let newNode = new Node(val);

  if (this.length === 0) {
    this.head = newNode;
  }
  else {
    this.tail.next = newNode;
  }
  this.tail = newNode;
  ++this.length;

  // make it chainable
  return this;
};

// Nuclear option
SinglyLinkedList.prototype.clear = function() {
  this.head = null;
  this.tail = null;
  this.length = 0;
};

// Remove from the tail, and return the removed Node's value
SinglyLinkedList.prototype.pop = function() {
  // check if its empty
  if (this.length === 0) { return null; }
  // assign val of tail node to result
  let result = this.tail.val;
  // deal with length 1
  if (this.length === 1) {
    this.clear();
    return result;
  }
  // get the currently 2nd to last node
  let newTail = this.__getNodeAt(this.length - 2);
  // reset its .next to null bc it will now be a tail
  newTail.next = null;
  // reset this.tail
  this.tail = newTail;
  // decrement length
  --this.length;

  return result;
};

// Add onto the head
SinglyLinkedList.prototype.unshift = function(val) {
  // create & set next to current head
  let newNode = new Node(val, this.head);
  // deal with empty
  if (this.length === 0) { this.tail = newNode; }
  // reset head pointer
  this.head = newNode;
  ++this.length;

  return this;
};

// Remove from head, and return removed Node's value
SinglyLinkedList.prototype.shift = function() {
  // check for empty
  if (this.length === 0) { return null; }
  let result = this.head.val;
  // clear if only 1 Node
  if (this.length === 1) {
    this.clear();
    return result;    // this keeps length from going to -1
  }
  // if more Nodes, reset head
  let newHead = this.__getNodeAt(1);
  this.head = newHead;
  --this.length;

  return result;
};

// Get a Node's value by index
SinglyLinkedList.prototype.get = function(index) {
  return this.__valid(index) ? this.__getNodeAt(index).val : null;
};

// Set a Node's value by index
SinglyLinkedList.prototype.set = function(index, val) {
  if (this.__valid(index)) {
    this.__getNodeAt(index).val = val;
  }
};

// Remove a Node by index and return its value
SinglyLinkedList.prototype.remove = function(index) {
  if (!this.__valid(index)) { return null; }
  if (this.length === 1) {
    let result = this.head.val;
    this.clear();
    return result;
  }
  let target = this.__getNodeAt(index);           // Node to remove
  let previous = this.__getNodeAt(index - 1);     // the one before target
  // make the chain jump over target
  previous.next = target.next;
  --this.length;

  return target.val;
};

// Reverse the order of the list
SinglyLinkedList.prototype.reverse = function () {
  /* Set up 3 pointers to traverse the list.
  ** If you think about the list geometrically, this makes sense because
  ** we'll need to deal with 3 nodes in order to reverse the 2 relationships
  ** that bind them together.
  **
  **    [A] -> [B] -> [C]
  **
  ** To reverse the list, we use the node's and their next pointers to reverse
  ** the arrows.
  **
  **    [A] <- [B] <- [C]
  **
  ** We don't actually have to swap things positionally. If we reverse the
  ** direction of the pointers, and the head and tail pointers then the list
  ** is effectively reversed.
  */
  let prev = null;
  let curr = this.head;
  let next = null;
  // Move the 3 pointers through the list until the middle (curr), is null.
  // That tells us that we've reached the end of the list. Remember, tail.next
  // in a singly linked list will always equal null.
  while (curr !== null) {
    next = curr.next;       // move next pointer up
    curr.next = prev;       // tell middle node to point other way
    prev = curr;            // move prev pointer up
    curr = next;            // move curr pointer up
  }
  /* Reset the head and tail. Since we traversed with the 3 pointers until
  ** nodes.curr was null, we know that end the end of the loop nodes.prev is
  ** equal to what used to be the tail before we reversed. With that, and the
  ** pointer still in this.head, we can do the swap. */
  this.tail = this.head;
  this.head = prev;
};

module.exports = SinglyLinkedList;
