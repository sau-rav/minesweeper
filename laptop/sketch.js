var mineList, rectSize, boxList, beta, images = [], numbers = [], faces = [], faceSize, flagLeft, counter, numWidth, flagMode, start, mineIdxList, mineOverRide, end, explored, tempSec; 
var loader = ['imgInit', 'one', 'two', 'three', 'four', 'flag', 'mineNew', 'none', 'redMine'];
var faceLoader = ['smile', 'compFace', 'mineface'];
var di = [-1, -1, -1,  0,  1,  1,  1,  0];
var dj = [-1,  0,  1,  1,  1,  0, -1, -1];

function preload() {
  images = []; numbers = []; faces = [];
  for(let i = 0; i < loader.length; i++){
    images[i] = loadImage('https://raw.githubusercontent.com/sau-rav/minesweeper/master/image_data/'+loader[i]+'.jpg');
  }
  for(let i = 0; i < 10; i++){
    numbers.push(loadImage('https://raw.githubusercontent.com/sau-rav/minesweeper/master/image_data/'+i+'.png'));
  }
  for(let i = 0; i < 3; i++){
    faces[i] = loadImage('https://raw.githubusercontent.com/sau-rav/minesweeper/master/image_data/'+faceLoader[i]+'.png');
  }
}

function inMineList(x, y){
  for(let i = 0; i < mineIdxList.length; i++){
    if(mineIdxList[i][0] == x && mineIdxList[i][1] == y) return true;
  }
  return false;
}

function plotMines(){
  while(mineIdxList.length < 10){
    let x = int(random()*9), y = int(random()*9);
    if(!inMineList(x, y)){
      mineIdxList.push([x,y]);
      boxList[x][y].mine = true;
    }
  }
}

function setNumbers(){
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      if(boxList[i][j].mine == true){
        for(let k = 0; k < 8; k++){
          if(i+di[k] >= 0 && i+di[k] < 9 && j+dj[k] >= 0 && j+dj[k] < 9){
            if(boxList[i+di[k]][j+dj[k]].mine == false){
              boxList[i+di[k]][j+dj[k]].number += 1;
              if(boxList[i+di[k]][j+dj[k]].number > 4){
                //console.log('yes i have been through this');
                return false;
              }
            }
          }
        }
        //console.log(boxList);
      }
    }
  }
  return true;
}

function setup() {
  var beta = 280;
  size = 280;
  beta = beta/size; size = size*beta;
  rectSize = 30*beta;
  menu = 45*beta; faceSize = 40*beta; numWidth = 25*beta; faceX = 120*beta;
  offset = 5*beta; flagLeft = 10; counter = 0; explored = 0;
  flagMode = false; start = false; mineOverRide = false; end = false; 
  createCanvas(size, size+menu);
  boxList = []; mineIdxList = [];
  for(let i = 0; i < 9; i++)
    boxList.push([]);
  for(let i = offset; i < size-rectSize; i += rectSize){
    for(let j = menu+offset; j < size+rectSize; j += rectSize){
      boxList[(j-menu-offset)/rectSize].push(new Box(i, j, 0));
    }
  }
  plotMines();
  if(!setNumbers()) setup();
  //console.log(boxList);
  //console.clear();
  //console.log(mineIdxList);
  //boxList[0][0].number = 3;
  //console.log(checkConfig());
  //console.log(mineIdxList);
}

class Box{
  constructor(x, y, val){
    this.state = val;
    this.x = x;
    this.y = y;
    this.mine = false;
    this.number = 0;
    this.showNumber = false;
    this.showEmpty = false;
    this.visited = false;
  }
  show(){
    if(this.showEmpty) this.state = 7;
    if(this.number > 0 && this.showNumber) this.state = this.number;
    if(mineOverRide && this.mine == true){
      if(this.visited == true) this.state = 8;
      else this.state = 6;
    }
    push();
    image(images[this.state], this.x, this.y, rectSize, rectSize);
    pop();
  }
  isClicked(valx, valy, check){
    if(valx >= this.x && valx <= this.x+rectSize && valy >= this.y && valy <= this.y+rectSize){
      if(check == 1) start = true;
      else{
        if(this.state == 5){
          this.state = 0;
          flagLeft += 1;
        }
        else if(this.state == 0){
          this.state = 5;
          flagLeft -= 1;
        }
      }
      if(this.mine == true && check == 1){
        mineOverRide = true;
        this.visited = true;
        end = true;
      }
      return true;
    }
    return false;
  }
}

function showBoxes(){
  for(let i = 0; i < boxList.length; i++){
    for(let j = 0; j < boxList.length; j++){
      boxList[i][j].show();
    }
  }
}

function numLeft(){
  var x, y;
  if(flagLeft >= 0){
    x = flagLeft/10; x = int(x);
    y = flagLeft%10;
  }
  else{
    x = 0; y = 0;
  }
  image(numbers[0], offset, offset, numWidth, faceSize);
  image(numbers[x], offset+numWidth, offset, numWidth, faceSize);
  image(numbers[y], offset+2*numWidth, offset, numWidth, faceSize);
}

function time(){
  var t = counter;
  if(t > 999){
    setup();
  }
  var y = int(t%10); t = t/10;
  var x = int(t%10); t = t/10;
  var z = int(t%10);
  image(numbers[z], size-offset-3*numWidth, offset, numWidth, faceSize);
  image(numbers[x], size-offset-2*numWidth, offset, numWidth, faceSize);
  image(numbers[y], size-offset-numWidth, offset, numWidth, faceSize);
}

function showMenu(){
  if(explored == 71){
    image(faces[1], faceX, offset, faceSize, faceSize);
    end = true;
  }
  else if(mineOverRide) image(faces[2], faceX, offset, faceSize, faceSize);
  else image(faces[0], faceX, offset, faceSize, faceSize);
  numLeft();
  time();
}

function calcExplored(){
  explored = 0;
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      if(boxList[i][j].visited == true)
        explored += 1;
    }
  }
}
// added extra
function calcNearMines(i, j){
  //console.log("here");
  let ans = 0;
  for(let k = 0; k < 8; k++){
    if(i+di[k] >= 0 && i+di[k] < 9 && j+dj[k] >= 0 && j+dj[k] < 9){
      //console.log(i+di[k] + " "+j+dj[k]);
      if(boxList[i+di[k]][j+dj[k]].mine == true) ans += 1;
    }
  }
  return ans;
}

function checkConfig(){
  let flagg = true;
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      if(boxList[i][j].number > 0){
        if(calcNearMines(i, j) == boxList[i][j].number){
          flagg = flagg & true;
        }
        else flagg = flagg & false;
      }
    }
  }
  return flagg;
}
// added 2 extra above

function draw() {
  background(193);
  showBoxes();
  if(start && !end){
    if(tempSec != second()){
      counter += 1;
      tempSec = second();
    }
  }
  showMenu();
  
}

function showConnectedComponents(i, j){
  if(boxList[i][j].number > 0){
    boxList[i][j].showNumber = true;
    if(boxList[i][j].visited == false){
      explored += 1;
      boxList[i][j].visited = true;
    }
    return; 
  }
  var queue = [], quePtr = 0;
  queue.push([i,j]);
  boxList[i][j].visited = true;
  explored += 1;
  boxList[i][j].showEmpty = true;
  while(quePtr != queue.length){
    for(let k = 0; k < 8; k++){
      let iNew = queue[quePtr][0]+di[k], jNew = queue[quePtr][1]+dj[k];
      if(iNew >= 0 && iNew < 9 && jNew >= 0 && jNew < 9 && boxList[iNew][jNew].visited == false){
        explored += 1;
        if(boxList[iNew][jNew].number == 0){
          queue.push([iNew, jNew]);
          boxList[iNew][jNew].showEmpty = true;
          boxList[iNew][jNew].visited = true;
        }
        else{
          boxList[iNew][jNew].showNumber = true;
          boxList[iNew][jNew].visited = true;
        }
      }
    }
    quePtr += 1;
  }
}

function mousePressed(){
  if(mouseButton === RIGHT && !end){
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        boxList[i][j].isClicked(mouseX, mouseY, 0);
      }
    }
  }
  else if(mouseButton === LEFT){
    if(mouseX >= faceX && mouseX <= faceX+faceSize && mouseY >= offset && mouseY <= offset+faceSize) setup();
    if(!end){
      for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
          if(boxList[i][j].isClicked(mouseX, mouseY, 1)){
            if(!end && boxList[i][j].visited == false){
              showConnectedComponents(i, j);
            }
          }
        }
      }
      //calcExplored();
      //console.log(explored);
    }
  }
}

document.oncontextmenu = function() {
  return false;
}

