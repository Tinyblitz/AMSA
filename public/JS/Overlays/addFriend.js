// Initialize
overlays[OVERLAY_ADDFRIEND*-1] = new Overlay("Add Friend", "Assets/Overlay_Images/addF.png", 0, -canvasHeight, SLIDE_DOWN, SLIDE_UP, addFriend);

// Variables
const frPosH = 268;
const friendHeight = 56;

// Where to splice buttons array
const newFriendButtonsPos = 2;

// Distance of add circles from the right
const cirFW = canvasWidth - 80;


// BUTTONS

// Exit out of profile
overlays[OVERLAY_ADDFRIEND*-1].addButton(new Button(325, 89, 33, 33, null, "exit"));

overlays[OVERLAY_ADDFRIEND*-1].addButton(new Button(123, 672, 144, 56, null, "add"));



function addFriend(){
  
  let overl = overlays[abs(OVERLAY_ADDFRIEND)];
  
  overl.draw();
  
  let friendPosH = frPosH + overl.y;
  
  let numCurButtons = overl.buttons.length;
  if (numCurButtons < newFriendButtonsPos) console.log("ERROR: removed too many buttons from group select screen");
  
  // change to NUM_USERS > 1 after testing
  // Add buttons
  if (numCurButtons == newFriendButtonsPos && mainGroup.users.length > 1 && overl.state != EXIT){
    addFriendButtons();
  }
  
  // Draw available users - copied from groupSel
  let blockH = friendPosH;
  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;
    
    let centerH = blockH + friendHeight/2;
    
    // Check if user is already in group
    let alreadyAdded = false;
    
    for (let z of currentGroup.users){
      if (v.ID == z.ID){
        alreadyAdded = true;
        break;
      }
    }
    
    if (alreadyAdded) continue;
    
    
    // Draw Avatar
    let array = getCharacter(v.n);
    let emoji = array[0];
    push();
    imageMode(CENTER);
    image(emoji, 80, centerH, emoji.width/2.5, emoji.height/2.5);
    pop();
    
    // Draw Name of User
    push();
    fill(0);
    textSize(18);
    textFont(bodyFont);
    textAlign(LEFT, CENTER);
    text(v.name, 130, centerH);
    pop();
    
    // Draw Add button
    if (!v.isAdded){
      push();
      fill(230,230,250);
      circle(cirFW, centerH, 50);
      
      // Draw plus
      strokeWeight(4);
      stroke(0);
      line(cirFW, centerH - 15, cirFW, centerH + 15);
      line(cirFW - 15, centerH, cirFW + 15, centerH);
      pop();
    }
    else{
      push();
      fill(255,0,0);
      circle(cirFW, centerH, 50);
      
      // Draw minus
      strokeWeight(4);
      stroke(255);
      line(cirFW - 15, centerH, cirFW + 15, centerH);
      pop();
    }
    blockH += friendHeight;
  }
  
  
  if (overl.active && touchPressed){
    let buttonAction = buttonSelect(overl);
    
    // If a number is returned then update button status
    if (typeof buttonAction === "number" && !isNaN(buttonAction))
    { changeFriendButtonStatus(buttonAction); }
    else{
    
      if (buttonAction == "add"){

        addFriendtoGroup();
        buttonAction = "exit";

      }

      if (buttonAction == "exit") {
        overl.state = EXIT;
        overl.active = false;
        resetInvites();
        removeFriendButtons();
      }
    }
  }
}

// Self explanatory
function addFriendtoGroup(){

  // Message Server: Send Invites
  var data = {
    i: [],
    g: currentGroup.ID
  };

  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;

    if (v.isAdded) data.i.push(v.ID);
  }

  socket.emit('sendInvites', data);
  
}

// Functions below are same as Group Select Screen's - perhaps optimize later

// Adds/ removes potential users to group and changes their corresponding buttons from plus to minus or minus to plus
function changeFriendButtonStatus(butt){
  let u = butt - newFriendButtonsPos;
  
  let counter = 0;
  
  for (let i = 0; i < mainGroup.users.length; i++){
    
    if (mainGroup.users[i] == null) {
      counter++; 
      continue;
    }
    if (mainGroup.users[i].ID == thisUser.ID) {
      counter++; 
      continue;
    }
    
    for (let v of currentGroup.users){
      if (v.ID == mainGroup.users[i].ID){
        counter++;
        continue;
      }
    }
    
    if (u == i - counter){
      if (!mainGroup.users[i].isAdded)
      { mainGroup.users[i].isAdded = true; }
      else 
      { mainGroup.users[i].isAdded = false; }
      break;
    } 
  }
}

// Add buttons upon entering this screen
function addFriendButtons(){
  
  let blockH = frPosH;
  
  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;
    
    // Check if user is already in group
    let alreadyAdded = false;
    
    for (let z of currentGroup.users){
      if (v.ID == z.ID){
        alreadyAdded = true;
        break;
      }
    }
    
    if (alreadyAdded) continue;
    
    // Height of the button
    let cirH = blockH + friendHeight/2;
    
    // diamater of the button
    let bD = 50;
    
    overlays[OVERLAY_ADDFRIEND*-1].addButton(new Button(cirFW - bD/2, cirH - bD/2, bD, bD, null, "status"));
    blockH += friendHeight;
  }
}

// Remove buttons when leave this screen
function removeFriendButtons(){
  overlays[OVERLAY_ADDFRIEND*-1].buttons.splice(newFriendButtonsPos);
}