// NOTE: Labeled as an overlay for convenience, but not an overlay
// Current Analysis: using neutral confidence points
// Variables

let graphTracker = 1;
let doneGraphing = false;
// Adjust line to fit within rect
const gw = 20;

let myEmo = {
  Emo: [],
  points: []
}

// Used for slider
let slider;

// Used to smooth out graph
const grouperSize = 2;

// Size of emotion Graph - arbitrary as will change
const graphHeight = 1000;
const graphWidth = 1000;

// Emotions
// Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
const ANGRY = 0;
const DISGUST = 1;
const FEAR = 2;
const HAPPY = 3;
const SAD = 4;
const SURPRISE = 5;
const NEUTRAL = 6;

// Take table of data and return array of user emotions
function calcEmo(){
  
  if (table == null) console.log("ERROR: Emotion Table Invalid");

  let spacing = graphWidth/table.getRowCount();
  let confidence = table.getColumn('Neutral');
  let expEmo = table.getColumn('Emotion');
  
  let grouper = [];
  let confiTracker = 0;
  let div = 0;
  
  while (confiTracker < confidence.length){
    
    // Invert since 100% neutral would be at the bottom
    let invert = map(confidence[confiTracker], 0, 1, graphHeight, 0);
    confiTracker++;
    
    grouper.push(invert);
    
    // Take average of group chunk
    if (grouper.length >= grouperSize || confiTracker >= confidence.length){
      let sum = 0;
      let curGroupSize = 0;
      
      while(grouper.length > 0){
        sum += grouper[0];
        grouper.shift();
        curGroupSize++;
      }
      
      // Push confidence values
      myEmo.points.push(createVector(div, sum/curGroupSize));
      div += spacing*curGroupSize;
      
      // Push emotion expressed
      let curEmo = null;
      
      if (expEmo[confiTracker - 1] == 'Angry') curEmo = ANGRY;
      if (expEmo[confiTracker - 1] == 'Disgust') curEmo = DISGUST;
      if (expEmo[confiTracker - 1] == 'Fear') curEmo = FEAR;
      if (expEmo[confiTracker - 1] == 'Happy') curEmo = HAPPY;
      if (expEmo[confiTracker - 1] == 'Sad') curEmo = SAD;
      if (expEmo[confiTracker - 1] == 'Surprise') curEmo = SURPRISE;
      if (expEmo[confiTracker - 1] == 'Neutral') curEmo = NEUTRAL;
      
      if (curEmo == null) console.log("ERROR: emotions not recorded properly");
      
      myEmo.Emo.push(curEmo);
    }
  }
  thisUser.emotions = myEmo;

  if (thisUser.emotions == null) console.log("uh oh");
      
  // Send Emotions to Server

  var data = {
    a: thisUser.emotions,
    u: thisUser.ID
  };

  socket.emit('emotionRecord', data);
}

function graphing(array, x,y,w,h){
  
  let fir = array[0];
  
  // Establish slider parameters
  let sliderX = x+gw;
  let sliderY = y + h + 50;
  let sliderW = w-x-gw;
  
  // Create slider if there is none
  if (slider == null) {
    
    let sliderH = 20;
    let maxVal = fir.emotions.points.length - 1;
    
    slider = new Slider(sliderX, sliderY, sliderW, sliderH, 0, maxVal, maxVal/2)
  }
  else{
    slider.x = sliderX;
    slider.y = sliderY;
    slider.w = sliderW;
  }
  
  let val = -1;
  let sliderVal = graphTracker - 1;
  
  // When graph is done drawing, allow slider control
  if (doneGraphing){
    
    if (touchStart) slider.pressed();
    if (touchPressed) slider.released();
    
    val = slider.getValue();
    
  }
  else slider.val = sliderVal;

  // Draw background
  push();
  fill(128,128,128, 240);
  rect(x-10,y,w,h+25,50);
  
  // Draw movie scenes
  tint(255, 100);
  imageMode(CENTER);
  image(movieScenes[0], x + 100, y + 40, movieScenes[0].width, movieScenes[0].height);
  
  image(movieScenes[1], x + 220, y + h - 20, movieScenes[1].width, movieScenes[1].height);
  pop();
  
  // Loop through each user
  for (let v of array){
    let tarGraph = v.emotions.points.slice(0,graphTracker);
    let avaGraph = v.emotions.Emo.slice(0,graphTracker);


    if (tarGraph.length < v.emotions.points.length)
    { graphTracker++; }
    else doneGraphing = true;

    displayEmo(avaGraph, tarGraph, x,y,w,h, v.n, v.color, val);
  }
  
  slider.update();
  slider.show();
}


// Displays emotion graph based on target specs
// eGraph is the specific user's array of emotions
function displayEmo(ava, eGraph, x,y,w,h, n, clr, Val){
  
  let c = clr;
  
  // Grab the array of images for corresponding character
  let emojis = getCharacter(n).slice(1);
  
  push();
  let newX = 0;
  let newY = 0;
  
  // Draw Emo Graph
  stroke(c);
  strokeWeight(2);
  noFill();
  beginShape();
  
  for (let v of eGraph) {
    newX = map(v.x, 0, 1000, x+gw, x+w-gw);
    newY = map(v.y, 0, 1000, y, y+h);
    vertex(newX, newY);
  }
  endShape();
  
  let emojiPic = emojis[ava[ava.length - 1]]
  
  // When slider is active
  if (Val != -1){
    newX =  map(eGraph[Val].x, 0, 1000, x+gw, x+w-gw);
    newY = map(eGraph[Val].y, 0, 1000, y, y+h);
    emojiPic = emojis[ava[Val]];
  }
  
  // Draw Avatar
  imageMode(CENTER);
  image(emojiPic, newX, newY, emojiPic.width, emojiPic.height);
  pop();
}

// Slider Class
class Slider {
  constructor(x, y, w, h, minVal, maxVal, defaultVal) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.val = defaultVal;
    this.thumbX = map(this.val, this.minVal, this.maxVal, this.x, this.x + this.w);
    this.dragging = false;
  }

  update() {
    if (this.dragging) {
      this.thumbX = constrain(mouseX, this.x, this.x + this.w);
      this.val = floor(map(this.thumbX, this.x, this.x + this.w, this.minVal, this.maxVal));
    }
    else {
      this.thumbX = map(this.val, this.minVal, this.maxVal, this.x, this.x + this.w);
    }
  }

  show() {
    push();
    strokeWeight(1);
    stroke('#888');
    fill('#eee');
    rect(this.x, this.y, this.w, this.h, 5);

    noStroke();
    fill('#444');
    ellipse(this.thumbX, this.y + this.h/2, 50, 50);
    pop();
  }

  getValue() {
    return this.val;
  }

  pressed() {
    let distance = dist(mouseX, mouseY, this.thumbX, this.y + this.h/2);
    if (distance < this.h/2) {
      this.dragging = true;
    }
  }

  released() {
    this.dragging = false;
  }
}