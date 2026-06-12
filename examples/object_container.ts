/**
 * ObjectContainer example — demonstrates add, del, get, clean, and reset
 * operations with debug output to the console.
 *
 * Open the browser DevTools console to see the results.
 */
import { ObjectContainer } from "../src/util/ObjectContainer.js";

const box = new ObjectContainer<string>();
box.add("a");
box.add("b");
box.add("c");
box.add("d");
box.debug();
box.del(2);
box.debug();
box.add("e");
box.add("f");
box.add("g");
box.debug();
box.del(0);
box.del(4);
box.debug();
console.log(box.getCount());
console.log(box.getObject(1));
console.log(box.getObject(0));
console.log(box.getAll());
box.clean();
box.debug();
box.reset();
box.debug();
