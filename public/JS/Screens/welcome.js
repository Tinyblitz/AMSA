// Limit number of users = 5x5 = 25
// Variables

let nameNoAvail = false;

let numNames = 6;
let Names = ["Jake", "Neytiri", "Mo'at", "Kiri", "Ronal", "Neteyam"];
const JAKE = 0;
const NEYTIRI = 1;
const MOAT = 2;
const KIRI = 3;
const RONAL = 4;
const NETEYAM = 5;
// leftover names: "Kiri", "Ronal",
/*let Names = {
  JAKE: 0,
  NEYTIRI: 1,
  KIRI: 2,
  RONAL: 3,
  MOAT: 4
};*/

// Colors.RED = 0
// Leftover colors "Blue", "Orange",
let numColors = 4;
let Colors = ["Red", "Green", "Violet", "Orange"];
const RED = 0;
const GREEN = 1;
const VIOLET = 2;
const ORANGE = 3;

/*let Colors = {
  BLUE: 0,
  RED: 1,
  GREEN: 2,
  ORANGE: 3,
  VIOLET: 4
};*/

let avatar = {
  Name: null,
  Color: null
};
let username = null;


// BUTTONS

homeScreen.addButton(new Button(48, 671, 294, 56, SCREEN_TUTORIAL, "addYou"));
homeScreen.addButton(new Button(140, 745, 111, 23, null, "randomize"));


function welcomeScreen(){
  homeScreen.draw();
  
  push();
  fill(255);
  textSize(40);
  textAlign(CENTER);
  textFont(nameFont);
  if (username != null) text(username, width/2, 570);
  pop();

  // Inform user that name is already taken
  if (nameNoAvail){

    push();
    fill(255);
    textSize(20);
    textAlign(CENTER);
    textFont(bodyFont);
    text("Name is taken!", width/2, 655);
    pop();

  }
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(homeScreen);
    
    if (buttonAction == "randomize") randomize();
    if (buttonAction == "addYou") addYou();
    
  }
}

// See if name is available to be used
function checkAvailableName(n){

  for (let v of mainGroup.users){
    if (v == null) continue;
    if(thisUser != null && v.ID == thisUser.ID) continue;
    if (n == v.name){
      return false;
      break;
    }
  }

  return true;
}

function randomize(){

  nameNoAvail = false;

  let newColor = null;
  let newName = null;
  let newAva = null;
  

  // Prevent the rare case of no name being available
  let nameCount = 0;
  
  while (newAva == null && nameCount < 1000){
    nameCount++;

    newColor = Math.floor(Math.random() * numColors);
    newName = Math.floor(Math.random() * numNames);
    
    let newTry = Colors[newColor] + ' ' + Names[newName];
    let noMatch = true;

    noMatch = checkAvailableName(newTry);
    
    if (noMatch) newAva = newTry;
  }
  
  username = newAva;
  avatar.Name = newName;
  avatar.Color = newColor;
}

function addYou(){

  let newName = Colors[avatar.Color] + ' ' + Names[avatar.Name];
  let nameIsAvail = checkAvailableName(newName);

  if (!nameIsAvail){
    changeScreen(SCREEN_HOME);
    nameNoAvail = true;
    return;
  }
  
  // When initially open app, add user to lobby
  // Assign user an ID based on how many users are already in the lobby
  if (thisUser == null) {

    // ID randomized for unique ID
    let rand = floor(random(0,10000));
    thisUser = new User(avatar.Name, avatar.Color, rand);
    mainGroup.users.push(thisUser);

    var data = {
      n: avatar.Name,
      c: avatar.Color,
      u: thisUser.ID,
      g: 0
    };

    socket.emit('addUser', data);

  }
  
  // When user wants to go back and change name
  else {
    thisUser.name = username;
    thisUser.n = avatar.Name;
    thisUser.color = getColor(avatar.Color);

    var data2 = {
      u: thisUser.ID,
      n: thisUser.n,
      c: avatar.Color
    };

    // Change for other clients as well
    socket.emit('changeName', data2);

  }
  
}