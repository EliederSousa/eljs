import { ObjectContainer } from "../src/util/ObjectContainer.js";

const box = new ObjectContainer();
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
console.log(box.getAll())
box.clean();
box.debug();
box.reset();
box.debug();

/*
---- OBJECTCONTAINER DEBUG ---- 
DELETED: 
OBJECTS: a,b,c,d 
COUNT  : 4 
------------------------------- 
---- OBJECTCONTAINER DEBUG ---- 
DELETED: 2 
OBJECTS: a,b,,d 
COUNT  : 3 
------------------------------- 
---- OBJECTCONTAINER DEBUG ---- 
DELETED: 
OBJECTS: a,b,e,d,f,g 
COUNT  : 6 
------------------------------- 
---- OBJECTCONTAINER DEBUG ---- 
DELETED: 0,4 
OBJECTS: ,b,e,d,,g 
COUNT  : 4 
------------------------------- 
4
b
null
Array(6) [ null, "b", "e", "d", null, "g" ]
---- OBJECTCONTAINER DEBUG ---- 
DELETED: 
OBJECTS: b,e,d,g 
COUNT  : 4 
------------------------------- 
---- OBJECTCONTAINER DEBUG ---- 
DELETED: 
OBJECTS: 
COUNT  : 0 
------------------------------- 
*/