const myAmazingGraph = {
  n: (xs) => xs.length,
  m: (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
  m2: (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
  v: (m, m2) => m*m - m2,
  xs: () => [1, 2, 3]
}

//cycled graph
const myAmazingGraph2 = {
  a: (b, c, g) => b*g+c+1,
  b: (c,  d) => c+d+1,
  c: (d,e) => d*e+1,
  d: (e) => 25 - e,
  e: (f) => f+1,
  f: () => 10,
  g: (a) => a-1,
}



/* get all info needed to work with in format:
dependencies = {
 "xs": {"calculated": false, "value": undefined, "dep": []},
 "n": {"calculated": false, "value": undefined, "dep": [myAmazingGraph.xs]},
 "m": {"calculated": false, "value": undefined, "dep": [myAmazingGraph.xs, myAmazingGraph.n]},
 "m2": {"calculated": false, "value": undefined, "dep": [myAmazingGraph.xs, myAmazingGraph.n]},
 "v": {"calculated": false, "value": undefined, "dep": [myAmazingGraph.m, myAmazingGraph.m2]},
};
*/
function create_dependencies(InputGraph) {
  let dependencies = {};
  dependencies.InputGraph=InputGraph;   //save initial graph
  //get depndencies
  for (var element in InputGraph) {
    let name=InputGraph[element].name;
    let expression=InputGraph[element].toString();
    var re = new RegExp("\(.(.*?).\) =>")
    myArr=re.exec(expression);
    if(myArr[2]=="") dep_arr=[];
    else dep_arr=myArr[2].split(/[\s,]+/);
  
    // Saving dependencies info
    dependencies[name]={};
    dependencies[name].calculated = false; //not calculated yet
    dependencies[name].value = undefined;    
    dependencies[name].visited = false;   //to find cycles in graph 
    dependencies[name].dep = dep_arr;     //dependent nodes
  }

  return dependencies;  
}

//calculate all dependent nodes
function get_vertex_dependencies(dependencies, vertex) {
  if(dependencies[vertex.name].visited==true) {
    //cycle is detected - can't find vertex
    console.log("Cycle detected in vertex " + vertex.name);
    return undefined;
  }
  dependencies[vertex.name].visited = true;  //mark to find cycle 

  let values = [];
  let args = dependencies[vertex.name];   //dependent nodes array
  console.log("Finding " + vertex.name + " in array");
  console.log(args.dep);
  //calculating dependent nodes
  for(let i=0; i<args.dep.length; i++) {
    let cur_arg;
    let cur_vertex = args.dep[i];
    if(dependencies[cur_vertex].calculated==true) cur_arg= dependencies[cur_vertex].value;  //use already calculated value
    else {
      cur_arg=f(dependencies.InputGraph[cur_vertex]);   //calculate dependent node
      if(cur_arg==undefined) return undefined;
    }
    values.push(cur_arg);
  }

  dependencies[vertex.name].visited = false;  //calculated, unmark 

  return values;
}

//lazy calculation
function f(vertex) {
  let result;
  //calculate all dependent nodes
  let values=get_vertex_dependencies(f.dep_context, vertex);
  if(values==undefined) return undefined; //cycle detected
  if(values.length==0) result = vertex();
  else result = vertex(...values);

  //save calculated vertex value 
  f.dep_context[vertex.name].value=result;
  f.dep_context[vertex.name].calculated=true;

  return result;
}


//---------- calculations -------------------


console.log("Start");

//1. non-cycled graph

//create dependencies (myAmazingGraph)
let dependencies=create_dependencies(myAmazingGraph);
//save context
f.dep_context=dependencies;
//calculate
var a=f(myAmazingGraph.n);
console.log("Vertex = " + a);

a=f(myAmazingGraph.v);
console.log("Vertex = " + a);


//2. cycled graph

//create dependencies (myAmazingGraph2)
let dependencies2=create_dependencies(myAmazingGraph2);
//save context
f.dep_context=dependencies2;
//calculate

//2.1 non-cycled branch
a=f(myAmazingGraph2.b);
console.log("Vertex = " + a);

//2.2 cycled branch
a=f(myAmazingGraph2.a);
console.log("Vertex = " + a);

console.log("Finish");
