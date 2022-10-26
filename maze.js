/*
  Team Passione - Maze
  Authors:
  Dianne Lopez  | diannel@csu.fullerton.edu
  Jimmy Phong   | JimmyPhong16@csu.fullerton.edu
  Jose Sanrindo | takashisk@csu.fullerton.edu
  Jose Muniz    | jmuniz900@csu.fullerton.edu

  This file contains the code to generate the maze and the bot to traverse
  through it. The algorithm used to generate the maze is Kruskal's.
*/

var rows, cols;
var w = 20;
var walls = [];
var cells = [];
var path = [];
var grid = [];

let bot;
let current;
let endOfMaze;
var ds = new disjointSet();
var reachedEnd = false;

//Create a stack class to implement stacks
class Stack{///////////////////////// I MIGHT NOT NEED THIS
  constructor(){
    this.items = [];
    this.count = 0;
  }
  push(element){
    this.items.push(element);
    this.count += 1;
  }
  pop(){
    if(this.count == 0){
      return "Nothing in the stack";
    }else{
      this.count -= 1;
      return this.items.pop();
    }
  }
  peek(){
    return this.items[this.items.length-1];
  }
  getSize(){
    return this.count;
  }

}//end of Stack class

var stack = new Stack();
var pathStack = new Stack();

function setup(){

  createCanvas(800, 800);
  cols = floor(width/w);
  rows = floor(height/w);
  n= floor(width/w);

  frameRate(30);

  for(var j = 0; j < rows; j+=2){
    for(var i = 0; i < cols; i+=2){

      cells.push(new Cell(i, j));
      path.push(new Cell(i,j));
    }
  }

  var n_rows = rows / 2 + 1;
  var n_cols = cols / 2 + 1;
  for(var r = 0; r < n_rows; r++){
    for(var c = 0; c < n_cols; c++){

      var current_cell = c + (r*n_rows);
      var right_neighbor = (c+1) + (r*n_rows);
      var bottom_neighbor = current_cell + cols/2;

      if(current_cell < cells.length){
        if(cells[current_cell].i != cols - 1 && cells[right_neighbor] != undefined && cells[current_cell].i < cols - 2){
            walls.push(new Wall(cells[current_cell].i, cells[current_cell].j, cells[right_neighbor].i, cells[right_neighbor].j));
        }
        if(cells[current_cell].j != rows - 1 && cells[bottom_neighbor] != undefined){
          walls.push(new Wall(cells[current_cell].i, cells[current_cell].j, cells[bottom_neighbor].i, cells[bottom_neighbor].j));
        }
      }
    }
  }//end of first Forloop

  walls.sort(function(a,b) {return (a.weight > b.weight) ? 1 : ((b.weight > a.weight) ? -1 : 0);} );

  var total_edges = 0;
  var counter = 0;

  ds.makeSet(cells);

    for(var i = 0; i < walls.length; i++){

        var c = (walls[i].i1/2) + ((rows/4)*walls[i].j1);
        var c2 = (walls[i].i2/2) + ((rows/4)*walls[i].j2);

        if(cells[c] != undefined && cells[c2] != undefined){

          var p1 = ds.find(c);
          var p2 = ds.find(c2);

        }
        if(p1 != p2 && cells[c] != undefined && cells[c2] != undefined){

          ds.union(c, c2);
          path.push(new Cell(walls[i].getx(), walls[i].gety()));
        }
      }//end of forloop()

      //sort the path array
      path.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );

      //convert this translate the path[] to grid[][]
      //create the grid for the path
      for(var j = 0; j < rows; j++ ){
        let col = [];
        for(var i = 0; i < cols; i++){
            col.push(undefined);
            }
             grid.push(col); //this pushes a row to a one D array

      }//end of for

       // //converting path to grid
       var pathIndex = 0;
       for(var j = 0; j < rows-1;j++){
         for(var i = 0;i < cols-1;i++){
           if(i == path[pathIndex].i && j == path[pathIndex].j ){
             grid[j][i] = path[pathIndex];
             pathIndex++;
           }
           else{
             grid[j][i] = undefined;
           }
         }
       }//end of forloop()
       // console.log(grid);
       bot = new Bot(0,0);
       endOfMaze = grid[cols-2][rows-2];
       // console.log(bot);
       current = grid[0][0];
       current.isVisited = true;
       current.inPath = true;

}//end of setup()

function draw(){
  background(255);
  for(var j = 0; j < rows - 1; j++){
    for(var i = 0; i < cols - 1; i++){
      if(grid[j][i] != undefined){
        grid[j][i].show();
      }
    }
  }

  //console.log(stack.peek());
  bot.show();
  //ai bot stuff below and recurive below
  if(current != endOfMaze && reachedEnd == false){
      stack.push(current);

      // console.log(current.i, current.j);

      // console.log("entering if statements");
      if(grid[current.j][current.i-1] != undefined && grid[current.j][current.i-1].isVisited == false ){//check the left
          // console.log("going left");
          grid[current.j][current.i-1].isVisited = true;
          pathStack.push(current);
          current.inPath = true;
          stack.push(grid[current.j][current.i-1]);
          current = stack.peek();

      }
      else if(grid[current.j+1][current.i] != undefined && grid[current.j+1][current.i].isVisited == false ){// checks for bottom
          // console.log("going bottom");
          grid[current.j+1][current.i].isVisited = true;
          pathStack.push(current);
          current.inPath = true;
          stack.push(grid[current.j+1][current.i]);
          current = stack.peek();

      }
      else if(grid[current.j][current.i+1] != undefined && grid[current.j][current.i+1].isVisited == false ){// checks for right
          // console.log("going right");
          grid[current.j][current.i+1].isVisited = true;
          pathStack.push(current);
          current.inPath = true;
          stack.push(grid[current.j][current.i+1]);
          current = stack.peek();

      }
      else if(current.j != 0 && grid[current.j-1][current.i] != undefined && grid[current.j-1][current.i].isVisited == false){// checks for up
          // console.log("going up");
          grid[current.j-1][current.i].isVisited = true;
          pathStack.push(current);
          current.inPath = true;
          stack.push(grid[current.j-1][current.i]);
          current = stack.peek();

      }
      else {//run this if NO other options
          pathStack.push(current);
          current.inPath = false;
          pathStack.pop();
          current = pathStack.peek();

          if(current.isVisited == true){
            pathStack.pop();
          }

      }//end of else

  }//end of big if()
  else{
    // console.log("Make it to the end of the maze. CONGRATZ")
    reachedEnd = true;
    current.inPath = true;
    if(current != grid[0][0]){
      pathStack.pop();
      current = pathStack.peek();
    }

  }

  bot.i = current.i;
  bot.j = current.j;

}//end of draw()

function disjointSet() {
  this.parent = {};

  this.makeSet = function(set){
    for(var i = 0; i < set.length; i++){
      this.parent[i] = i;
    }
  }

  this.find = function(k){
    if(this.parent[k] === k){
      return k;
    }
    return this.find(this.parent[k]);
  }

  this.union = function(a, b){
    this.x = this.find(a);
    this.y = this.find(b);
    this.parent[this.x] = this.y;
  }
}//end of disjointSet()

function Cell(i, j){

  this.i = i;
  this.j = j;
  this.id = this.i + this.j*rows;
  this.isVisited = false;
  this.inPath = false;

  this.show = function(){
    var x = this.i*w;
    var y = this.j*w;
    if(this.inPath != false){

      fill('green');

      rect(x, y, w, w);
    }
    else{
      fill('black');

      rect(x, y, w, w);
    }
  }
}
function Bot(i, j){
  this.i = i;
  this.j = j;

  this.show = function(){

    var x = this.i*w+(w/2);
    var y = this.j*w+(w/2);

    fill('red');
    circle(x, y, w/1.5);
  }

}
function Wall(i1, j1, i2, j2){
  this.i1 = i1;
  this.j1 = j1;
  this.i2 = i2;
  this.j2 = j2;
  this.weight = Math.round(random()*1000);

  this.getx = function(){
    //vertical walls
    if(i1 - i2 == 0){
      return i1;
    }
    //horizontal walls
    else{
      return i1+1;
    }
  }

  this.gety = function(){
    if(i1 - i2 == 0){
      return j1 + 1;
    }
    else{
      return j1;
    }
  }

}
