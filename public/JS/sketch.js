// Width and Height - 390 x 844
const canvasWidth = 390;
const canvasHeight = 844;

// Websocket
var socket;

// Fonts
let nameFont;
let bodyFont;
let timerFont;
let syncFont;

// Avatars
const Avatars = [];

// Miscellanious variables
let touchPressed = false;
let touchStart = false;
const chatHeight = 77.14;
const chatFieldHeight = canvasHeight-75;

// Variables for after movie
let table = null;
let movieIsDone = false;

// Define the different screens for the app
const SCREEN_HOME = 0;
const SCREEN_TOA = 1;
const SCREEN_CHAT = 2;
const SCREEN_GROUPSEL = 3;
const SCREEN_GROUPCREATE = 4;
const SCREEN_INVITED = 5;
const SCREEN_WATCH = 6;
const SCREEN_MATCH = 7;
const SCREEN_LOBBY = 8;
const SCREEN_EMOTION = 9;
const SCREEN_GONE = 10;
const SCREEN_TUTORIAL = 11;

// Define the different Nys for the app
// Using negatives to differentiate from screens but allow for the use of the same functions
// !!! Rememeber to abs() when calling from the overlays array !!!
const OVERLAY_PROFILE = -1;
const OVERLAY_LEAVE = -2;
const OVERLAY_ADDFRIEND = -3;
const OVERLAY_INVITATION = -4;
const OVERLAY_SAVED = -5;

// Transitions
// Direction
const ENTRANCE = 0;
const EXIT = 1;

// Types
const SLIDE_LEFT = 0;
const SLIDE_RIGHT = 1;
const SLIDE_DOWN = 2;
const SLIDE_UP = 3;
const FADE_IN = 4;
const FADE_OUT = 5;

/////////////////////////~~~ CLASSES ~~~//////////////////////
class Screen {
  constructor(name, pngPath) {
    this.name = name;
    this.buttons = [];
    this.pngPath = pngPath;
    this.pngImage = null;
  }

  // If need to move button
  // Such as the create group button in lobby
  moveButton(buttonPos, newX, newY){
    this.buttons[buttonPos].x = newX;
    this.buttons[buttonPos].x = newY;
  }
  
  // Adds new button to end of button array
  addButton(button) {
    this.buttons.push(button);
  }

  preload() {
    // Load the PNG image for the screen
    this.pngImage = loadImage(this.pngPath);
  }
  
  draw() {

    // Draw the PNG image
    if (this.pngImage) {
      image(this.pngImage, canvasWidth / 2 - this.pngImage.width / 2, canvasHeight / 2 - this.pngImage.height / 2);
    }

    
  }
}
//________________________________________________________________________

class Overlay {
  constructor(name, pngPath, initx, inity, itr, otr, f) {
    this.name = name;
    this.buttons = [];
    this.pngPath = pngPath;
    this.pngImage = null;
    this.iTrans = itr;
    this.oTrans = otr;
    
    this.initX = initx;
    this.initY = inity;
    this.x = initx;
    this.y = inity;
    
    this.state = ENTRANCE;
    this.active = false;
    this.showing = false;
    
    this.func = f;
  }
  
  addButton(button) {
    this.buttons.push(button);
  }
  
  
  transition(OI, x, y){
    
    // Refer to transitions.js
    let trans = transitions;
    
    if (OI == ENTRANCE && this.iTrans != null){
      trans[this.iTrans](this, x, y);
    }
    else if (OI == EXIT && this.oTrans != null){
      trans[this.oTrans](this, x, y);
      if (this.state == null) {
        this.showing = false;
        this.state = ENTRANCE;
      }
    }
  }

  preload() {
    // Load the PNG image for the screen
    this.pngImage = loadImage(this.pngPath);
  }
  
  draw() {
    
    // Draw the PNG image
    if (this.pngImage) {
      image(this.pngImage, this.x, this.y);
    }
  }
}

//________________________________________________________________________
// Used as hotspots - not displayed
class Button {
  constructor(x, y, w, h, d, a) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.destination = d;
    this.action = a;
    this.active = true;
  }
}
//___________________________________________________________________________

// Created by users to chat
class Group {
  constructor(name, y, id) {
    this.x = 0;
    this.y = y;
    
    this.w = canvasWidth;
    this.h = chatHeight;
    
    this.name = name;
    this.letter = name[0];
    this.ID = id;
    
    this.users = [];
    this.messages = [];
    
  }
  
  // Add new user to group
  addUser(user){
    
    this.users.push(user);
    
  }
  
  // Add new message
  addMessage(msg){
    
    this.messages.push(msg);
    
  }
  
  // Draws the preview of the group in lobby
  drawPreview() {
    
    push();
    // Draw profile of group
    fill(205);
    circle(43, this.y + this.h/2, 51);

    // Draw movie buddy group a bit differently
    if (this.ID == -1){

      // Draw this user's avatar
      let thisEmojis = getCharacter(thisUser.n);
      let thisFace = thisEmojis[0];
      imageMode(CENTER);
      
      let thisW = thisFace.width/4;
      let thisH = thisFace.height/4;
      
      image(thisFace, 33, this.y + this.h/2, thisW, thisH);

      // Draw Movie buddy avatar
      let budEmojis = getCharacter(movieBuddy.n);
      let budFace = budEmojis[0];
      imageMode(CENTER);
      
      let budW = budFace.width/4;
      let budH = budFace.height/4;
      
      image(budFace, 53, this.y + this.h/2, budW, budH);
    }
    else{
    
      fill(0);
      textFont(bodyFont);
      textSize(40);
      textAlign(CENTER);
      text(this.name[0], 43, this.y + this.h/2 + 15);
    }
    
    // Draw name of group
    fill(255);
    textFont(bodyFont);
    textSize(18);
    textAlign(LEFT);
    text(this.name, 85.71, this.y + 32);
    
    // Draw last message
    let lastMSG = "No messages yet...";
    if (this.messages.length != 0) {
      lastMSG = this.messages[this.messages.length - 1].Text;
      
      // Truncate text to fit
      let maxTextWidth = 300;
      let truncatedText = lastMSG; 
      let textW = textWidth(truncatedText);

      // keep shortening the text until it fits within the maximum width
      while (textW > maxTextWidth) {
        truncatedText = truncatedText.slice(0, -1);
        textW = textWidth(truncatedText);
      }
      
      // Don't change if the text didn't need to be truncated
      if (truncatedText != lastMSG) {
        truncatedText += "…"; // add an ellipsis to the end
        lastMSG = truncatedText;
      }
    }
    fill(205, 200);
    textFont(bodyFont);
    textSize(15);
    textAlign(LEFT);
    text(lastMSG, 85.71, this.y + 60);

    pop();
  }
  
  // Draws the correspondence of the chat room
  drawChat(){
    
    let chatLog = this.messages;
    // display chat messages
    let bubbleY = chatFieldHeight - 20; // start at bottom of screen
    let lastMsgUser = null;
    let nextMsgUser = null;
    for (let i = chatLog.length - 1; i >= 0; i--) {
      let msg = chatLog[i];

      if (i != 0) lastMsgUser = chatLog[i - 1].userID;

      // When a user leaves lobby, all their data is erased
      // so cannot access their messages

      // Find User
      let userPos = -1;
      for (let k = 0; k < mainGroup.users.length; k++){
        if (mainGroup.users[k].ID == msg.userID) userPos = k;
      }
      if (userPos == -1) continue;

      if (msg != null){
        let nameX = null;
        let picX = null;
        let msgName = null;
        
        // move up by message height + spacing
        if (msg.userID == thisUser.ID) {
          nameX = msg.rightX - textWidth(thisUser.name) + 20;
          picX = msg.rightX + 20;
          msgName = thisUser.name;
        }
        else {
          nameX = msg.leftX;
          picX = msg.leftX - 60;
          msgName = mainGroup.users[userPos].name;
        }
        
        // If prior msg and current msg are from same user, don't leave space
        // and don't draw name again
        if (msg.userID == nextMsgUser) bubbleY -= msg.h + 10;
        else bubbleY -= msg.h + 45;
        
        // Might need to remove lastMsgUser != null if chat at bottom not showing
        if (i == 0 || msg.userID != lastMsgUser) {
          push();
          fill(220);
          textSize(15);
          textFont(bodyFont);
          text(msgName, nameX, bubbleY - 10);
          pop();
          
          // Draw Avatar
          let array = getCharacter(mainGroup.users[userPos].n);
          let emoji = array[0];
          push();
          imageMode(CORNER);
          image(emoji, picX, bubbleY - 10, emoji.width/2.5, emoji.height/2.5);
          pop();
        }
        
        nextMsgUser = msg.userID;
        
        msg.draw(bubbleY);
      }
    }
  }
}
//___________________________________________________________________________

// Represent all the users in the cinema
class User {
  constructor(name, c, id) {
    
    this.n = name;
    this.color = getColor(c);
    this.name = Colors[c] + ' ' + Names[name];
    this.ID = id;
    
    // For adding to a group
    this.isAdded = false;
    
    // Hold a list of IDs for all the groups the user is in
    this.groups = [];
    
    // Push in main group
    this.groups.push(0);
    
    // Holds invites from other users - IDs of the group invited to
    this.invites = [];
    
    // Holds emotions after movie finishes
    this.emotions = null;
    
    
  }
  
}



//___________________________________________________________________________

class Message {
  constructor(ID, _text, w, h){
    this.Text = _text;
    
    this.userID = ID;
    
    this.w = w;
    this.h = h;
    
    this.leftX = 69;
    this.rightX = 301;
    
    //this.Time = _time;
  }
  
  // Draw the message bubble
  draw(y) {
    
    push();
    let x;
    
    textSize(15);
    textFont(bodyFont);
    textAlign(LEFT, TOP);
    
    // +20 is padding
    let bubbleWidth = this.w + 20;
    let bubbleHeight = this.h;
    
    // If user of the message matches this user then text displayed on right side
    if (this.userID == thisUser.ID) {
      x = this.rightX - bubbleWidth;
    } 
    else {
      x = this.leftX;
    }
    
    let bH = bubbleHeight;
  
    if (this.w != textWidth(this.Text))
      { bubbleHeight += 10;}
    else bubbleHeight += 20;
    
    // draw bubble
    stroke(0);
    strokeWeight(2);
    fill(0);
    rect(x, y, bubbleWidth + 20, bubbleHeight, 10);

    if (this.w != textWidth(this.Text))
      { bubbleHeight += 20;}
    
    // draw message text
    noStroke();
    fill(255);
    text(this.Text, x + 10, y + 10, bubbleWidth, bubbleHeight - 20);
    pop();
  }
}


///////////~~~ INITIALIZATION ~~~///////////////////////////

// Define the screens for the app
const homeScreen = new Screen("Home Screen", "Assets/Screen_Images/welcome.png");
const toaScreen = new Screen("TOA Screen", "Assets/Screen_Images/toa.png");
const chatScreen = new Screen("Chat Screen", "Assets/Screen_Images/chat.png");
const groupSelScreen = new Screen("Group Select Screen", "Assets/Screen_Images/groupSelect.png");
const groupCreateScreen = new Screen("Group Create Screen", "Assets/Screen_Images/groupCreate.png");
const invitedScreen = new Screen("Invited Screen", "Assets/Screen_Images/inviteReceive.png");
const watchScreen = new Screen("Watch Screen", "Assets/Screen_Images/watch.png");
const matchScreen = new Screen("Match Screen", "Assets/Screen_Images/match.png");
const lobbyScreen = new Screen("Lobby Screen", "Assets/Screen_Images/lobby.png");
const emoScreen = new Screen("Emotion Screen", "Assets/Screen_Images/emotion.png");
const tutorialScreen = new Screen("Tutorial Screen", "Assets/Screen_Images/Tut0.png");

// Define Overlays for the app

let overlays = [];
overlays.push(null);


// Define Main Group
let currentGroup = null;
let groupHolder = [];
let mainGroup;

// Characters
let Characters = [];
const numEmotions = 7;

// Other Elements
let profPic;
let chatHUD;
let movieScenes = [];
let numMovieScenes = 2;

// Holds tutorial screens
let tutHolder = [];
const numTutorials = 3;

// HTML inputs
let inputField; // input field for typing new messages
let sendButton;
const sidePad = 20;



// Variable to hold user after their avatar is created
let thisUser = null;
let movieBuddy = null;
let buddyGroup = null;

///////////////~~~ HELPER FUNCTIONS ~~~//////////////////////////////////////////

function changeScreen(destination){
  
  PREVIOUS_SCREEN = CURRENT_SCREEN;
  CURRENT_SCREEN = destination;
  
  // For testing
  //console.log(CURRENT_SCREEN);
}

function activateOverlay(destination){
  
  overlays[abs(destination)].active = true;
  overlays[abs(destination)].showing = true;
  
  if (destination == OVERLAY_SAVED) return;
  
  // Close other overlays if they are open
  for (let v of overlays){
    if (v == null) continue;
    if (v ==  overlays[abs(destination)]) continue;
    
    v.active = false;
    v.state = EXIT;
  }
}

function buttonSelect(screen){
  
  let buttonPushed = false;
  let buttonPos = -1;
  
  // Determine if a button was pushed
  for (let i = 0; i < screen.buttons.length; i++) {
      
    //x, y, w, h
    let x = screen.buttons[i].x;
    let y = screen.buttons[i].y;
    let w = screen.buttons[i].w;
    let h = screen.buttons[i].h;
      
    //Booleans
    let minX = mouseX >= x; 
    let maxX = mouseX <= x + w;
    let minY = mouseY >= y; 
    let maxY = mouseY <= y + h;
          
    if (minX && maxX && minY && maxY){
      buttonPushed = true;
      buttonPos = i;
      break;
    }
  }
  
  // If button is only for navigation then return null
  let buttonAction = null;
  
  // Nothing happens if touch does not happen on a button
  if (buttonPos != -1){
    
    let pushedButton = screen.buttons[buttonPos];
    
    // If button is not active, do nothing
    if (!pushedButton.active) return null;
    
    // Change Screens when navigation button is pushed
    if (pushedButton.destination != null) {
      if (pushedButton.destination >= 0)
      {changeScreen(pushedButton.destination);}
      
      // Or activate overlay with corresponding button
      else {activateOverlay(pushedButton.destination);}
    }
    
    // Perform action if an action is associated with button
    if (pushedButton.action != null)
    {buttonAction = pushedButton.action;}
  }
  
  // For lobby screen: open up target group chat
  if (buttonAction == "chat" && buttonPos != -1) return buttonPos;
  
  // For Group Select Screen: return the button pressed
  if (buttonAction == "status" && buttonPos != -1) return buttonPos;
  
  // Return action of a buttion if there is one
  return buttonAction;
}

// Resets invites for groupSelScreen
function resetInvites(){
  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;
    v.isAdded = false;
  }
}

// Catches Invites
function openInvites(){
  
  let testGroupID = groupHolder[thisUser.invites[0]].ID;
  
  if (thisUser.invites[0] >= groupHolder.length) console.log("ERROR: Invitation to invalid group");
  
  // Set group name on invitation
  invitGroupID = testGroupID;
  
  activateOverlay(OVERLAY_INVITATION);
  
  // Remove invitation
  thisUser.invites.shift();
  
}

// Draw profile picture in top right corner
function drawProfile() {
  push();
  imageMode(CORNER);
  image(profPic, 322, 7.5);
  pop();
}

// Returns an array of character images
function getCharacter(n){
  
  let c = Characters[n];
  
  return c;
}

// Returns a color
function getColor(n) {
  
  let c = null;

  switch(n){
    case RED:
      c = color(255,0,0);
      break;
    case GREEN:
      c = color(0,255,0);
      break;
    case VIOLET:
      c = color(143,0,255);
      break;
    case ORANGE:
      c = color(255,165,0);
    default:
      console.log("ERROR: no color assigned");
  }
  
  return c;
  
}

////////~~~ STARTING SETUP ~~~////////////////

// Define the current screen that is being displayed
let CURRENT_SCREEN = SCREEN_HOME;
let PREVIOUS_SCREEN = null;

// No overlays active at start
let overlayActive = false;




//___________________________________________________________________________
function preload() {
  
  // Load Fonts
  nameFont = loadFont("Assets/Fonts/Supermercado.ttf");
  bodyFont = loadFont("Assets/Fonts/Avenir.otf");
  timerFont = loadFont("Assets/Fonts/DigitalNumbers.ttf");
  syncFont = loadFont("Assets/Fonts/Lato-ExtraBold.ttf");
  
  // Load the PNG images for each screen
  homeScreen.preload();
  toaScreen.preload();
  chatScreen.preload();
  groupSelScreen.preload();
  groupCreateScreen.preload();
  invitedScreen.preload();
  watchScreen.preload();
  matchScreen.preload();
  lobbyScreen.preload();
  emoScreen.preload();
  tutorialScreen.preload();
  
  
  // Load Tutorial screens
  for (let i = 0; i < numTutorials; i++){
    tutHolder[i] = loadImage("Assets/Screen_Images/Tut" + nf(i) + ".png")
  }
  
  // Load the PNG images for each overlay
  for (let v of overlays){ 
    if (v == null) continue;
    v.preload(); 
  }
  
  // Load Characters
  let arr = [];
  
  // Load first character
  for (let i = 0; i < numEmotions + 1; i++){
    arr[i] = loadImage('Assets/Emotions/b/b' + nf(i) + '.png');
  }
  
  Characters.push(arr);
  arr = [];
  
  // Load Second character
  for (let i = 0; i < numEmotions + 1; i++){
    arr[i] = loadImage('Assets/Emotions/m/m' + nf(i) + '.png');
  }
  
  Characters.push(arr);
  arr = [];
  
  // Load Third character
  for (let i = 0; i < numEmotions + 1; i++){
    arr[i] = loadImage('Assets/Emotions/p/p' + nf(i) + '.png');
  }
  
  Characters.push(arr);
  arr = [];
  
  // Load Fourth character
  for (let i = 0; i < numEmotions + 1; i++){
    arr[i] = loadImage('Assets/Emotions/c/c' + nf(i) + '.png');
  }
  
  Characters.push(arr);
  arr = [];
  
  // Load Firth character
  for (let i = 0; i < numEmotions + 1; i++){
    arr[i] = loadImage('Assets/Emotions/t/t' + nf(i) + '.png');
  }
  
  Characters.push(arr);
  arr = [];
  
  // Load Sixth character
  for (let i = 0; i < numEmotions + 1; i++){
    arr[i] = loadImage('Assets/Emotions/o/o' + nf(i) + '.png');
  }
  
  Characters.push(arr);

  
  // Load movie scenes for emotion graph
  for (let i = 0; i < numMovieScenes; i++){
    movieScenes[i] = loadImage('Assets/Elements/tim' + nf(i) + '.png');
  }
  
  
  // Load other elements
  profPic = loadImage('Assets/Elements/profCircle.png');
  chatHUD = loadImage('Assets/Elements/chatop.png');
}

function setup() {
  // Create the canvas

  createCanvas(canvasWidth, canvasHeight);
  
  // Declare Socket
  // Local host for testing
  //socket = io.connect('http://localhost:3000');

  // May need to replace IP address
  socket = io.connect('http://192.168.1.23:3000');
  socket.on('load', loadUp);
  socket.on('message', newMessage);
  socket.on('addUser', addUsertoGroup);
  socket.on('changeName', changeUserName);
  socket.on('addGroup', addNewGroup);
  socket.on('sendInvites', readInvite);
  socket.on('movieDone', afterMovie);
  socket.on('otherEmotions', otherEmotions);
  
  // create input field
  inputField = createInput();
  inputField.style('font-family', bodyFont);
  inputField.style('font-size', '20px');
  inputField.style("border-radius", "20px");
  inputField.style("padding-left", "20px");
  inputField.style("padding-right", "65px");
  inputField.hide();
  
  // create the send button
  sendButton = createButton("Send");
  sendButton.style("border-radius", "20px");
  sendButton.hide();
  
}

//constructor(ID, _text, w, h)

/////////////////~~~ SOCKET FUNCTIONS ~~~///////////////////
// Upload all data on server
function loadUp(data){

  // Convert groupHolder from server to client
  for (let i = 0; i < data.length; i++){
    let curGroup = data[i];
    let newGroup = new Group(curGroup.name, curGroup.y, curGroup.ID);

    // Add messages of group
    for (let v of curGroup.messages){
      let newMSG = new Message(v.userID, v.Text, v.w, v.h);
      newGroup.messages.push(newMSG);
    }

    // Add main group first to be referenced from
    if (i == 0){
      for (let v of curGroup.users){
        let newUser = new User(v.n, v.c, v.ID);      
        newUser.groups = v.groups;
        newGroup.users.push(newUser);
      }

      // Set main group reference
      mainGroup = newGroup;
      groupHolder.push(mainGroup);
    }

    // Reference the user within the main group to add to other groups
    else {
      for (let v of curGroup.users){
        let tarUser = null;
        for (let i = 0; i < mainGroup.users.length; i++){
          if (mainGroup.users[i].ID == v.ID) {
            tarUser = mainGroup.users[i];
            break;
          }
        }
        if (tarUser == null) console.log("ERROR: could not find user");
        
        newGroup.users.push(tarUser);
      }

      groupHolder.push(newGroup);
    }
  }

  randomize();
}

function newMessage(data){
  
  let newMSG = new Message(data.u, data.t, data.w, data.h);
  
  // add message to chat log
  if (data.g == -1){
    if (data.u == thisUser.ID || data.u == movieBuddy.ID)
    buddyGroup.messages.push(newMSG);
  }
  else groupHolder[data.g].messages.push(newMSG);

}

function addUsertoGroup(data){

  // Add new user to main group
  if (data.g == 0) {

    let newUser = new User(data.n, data.c, data.u);

    groupHolder[0].users.push(newUser);    
  }

   // Add reference of user to target group
   else {

    let tarUser = null;
    for (let v of groupHolder[0].users){
      if (v.ID == data.u) tarUser = v;
    }

    // Push user into target group
    groupHolder[data.g].users.push(tarUser);
  }
}

function changeUserName(data){
    
  let tarUser = null;
  for (let v of groupHolder[0].users){
    if (v.ID == data.u) tarUser = v;
  }

  tarUser.n = data.n;
  tarUser.color = getColor(data.c);

  tarUser.name = Colors[data.c] + ' ' + Names[data.n];

}

function addNewGroup(data){
  
  let newGroup = new Group(data.n, data.y, data.g);

  groupHolder.push(newGroup); 

}

function readInvite(data){

  let invited = false;
  for (let v of data.i){
    if (v == thisUser.ID){
      invited = true;
      break;
    }
  }

  if (invited) thisUser.invites.push(data.g);

}

// What happens after movie finishes - send emotion data to server
function afterMovie(){

  movieIsDone = true;

  if (thisUser == null) return;
  changeScreen(SCREEN_WATCH);
  

  // Cheating the emotion recording by having preset emotions
  for (let i = 0; i < mainGroup.users.length; i++){
    
    if (mainGroup.users[i].ID == thisUser.ID){

      // Calculate emotions and input into user
      loadTable('Data/csv' + nf(i) + '.csv', 'csv', 'header', function(tablet) {
        table = tablet;
        
        calcEmo();
      });

      break;
    }
  }

  if (thisUser.emotions == null) console.log("uh oh");
  else console.log(thisUser.emotions);
      
  // Send Emotions to Server

  var data = {
    a: thisUser.emotions,
    u: thisUser.ID
  };

  socket.emit('emotionRecord', data);
      
  // Change lobby back button to go to emotion graph
  lobbyScreen.buttons[lobBackButton].destination = SCREEN_EMOTION;
}

// Record other users' emotions
function otherEmotions(data){

  let tarUser = null;

  // Find User through ID
  for (let v of mainGroup.users){
    if (v.ID == data.u){
      tarUser = v;
      break;
    }
  }

  if (tarUser == null) console.log("ERROR: Emotion data did not transfer properly!");

  tarUser.emotions = data.a;
}

/////////////////~~~ DRAW FUNCTION ~~~//////////////////////

function draw() {

  // Clear the canvas
  background(255);
  
  // Hide DOM elements when not used
  inputField.hide();
  sendButton.hide();
  
  switch(CURRENT_SCREEN) {
    case SCREEN_HOME:
      welcomeScreen();
      break;
    case SCREEN_TOA:
      toa();
      break;
    case SCREEN_CHAT:
      chat();
      break;
    case SCREEN_GROUPSEL:
      groupSel();
      break;
    case SCREEN_GROUPCREATE:
      groupCreate();
      break;
    case SCREEN_INVITED:
      //CURRENT_SCREEN = invitedScreen;
      break;
    case SCREEN_WATCH:
      watchMovie();
      break;
    case SCREEN_MATCH:
      matchBud();
      break;
    case SCREEN_LOBBY:
      lobby();
      break;
    case SCREEN_EMOTION:
      emo();
      break;
    case SCREEN_GONE:
      gone();
      break;
    case SCREEN_TUTORIAL:
      Tutorial();
      break;
    default:
      console.log("Error: dead screen link");
      break;
  }
  
  // Check if any overlays are active
  overlayActive = false;
  for (let v of overlays){
    if (v == null) continue;
    if (v.name == "Saved") continue;
    if (v.active) {
      overlayActive = true;
      break;
    }
  }
  
  // Dim background if an overlay is active
  if (overlayActive){
    
    fill(0,0,0, 200);
    rect(0, 0, canvasWidth, canvasHeight);
  }
  
  // Check for invites - will not show another invite if already viewing one
  if (thisUser != null){
    if (thisUser.invites.length != 0 
        && !overlays[OVERLAY_INVITATION*-1].showing) 
    { openInvites(); }
  }
  
  // Draw overlays
  for (let v of overlays){
    if (v == null) continue;
    if (v.showing) {
      v.func();
      if (v.state == ENTRANCE) v.transition(v.state, 0, 0);
    }
    if (v.state == EXIT) v.transition(v.state, v.initX, v.initY);
  }
  
  
  
  // Reset Touch Press
  touchStart = false;
  touchPressed = false;
}

// Dev control to avoid accidental progression
let touchCounter = 0;

function touchStarted() {
  touchStart = true;

  // Change to SCREEN_TOA for testing
  if (!movieIsDone && CURRENT_SCREEN == SCREEN_TOA && mouseY < 10){

    if (touchCounter == 3){
      // Tell server movie is done
      socket.emit('movieDone');
    }

    touchCounter++;
  }

  //fullscreen(true);
}

function touchEnded(){
  touchPressed = true;
  //fullscreen(true);
}

// Needed for touch functionality on mobile
document.ontouchmove = function(event) {
    event.preventDefault();
};

// Temporary way to end movie
function keyPressed(){
  if (key == '='){
    
    if (!movieIsDone){

      // Tell server movie is done
      socket.emit('movieDone');
    }
  }
}