// Variables
const blockPosH = 263;
const blockWidth = canvasWidth;
const blockHeight = 56;

// Where to splice buttons array
const newButtonsPos = 3;

// Distance of add circles from the right
const cirW = canvasWidth - 50;

// BUTTONS

// Currently resets invites if press on profile
groupSelScreen.addButton(new Button(322, 7.5, 50.35, 57.49, OVERLAY_PROFILE, "reset"));
groupSelScreen.addButton(new Button(123, 736, 144, 56, SCREEN_GROUPCREATE, null));
groupSelScreen.addButton(new Button(24, 34, 24, 24, SCREEN_LOBBY, "reset"));


function groupSel(){
  groupSelScreen.draw();
  
  let numCurButtons = groupSelScreen.buttons.length;

  if (numCurButtons < newButtonsPos) console.log("ERROR: removed too many buttons from group select screen");
  
  // change to NUM_USERS > 1 after testing
  // Add buttons
  if (numCurButtons - newButtonsPos != mainGroup.users.length - 1 && mainGroup.users.length > 1){
    addUserButtons();
  }
  
  // Draw available users
  let blockH = blockPosH;
  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;
    
    let centerH = blockH + blockHeight/2;
    
    // Draw Avatar
    let array = getCharacter(v.n);
    let emoji = array[0];
    push();
    imageMode(CENTER);
    image(emoji, 50, centerH, emoji.width/2.5, emoji.height/2.5);
    pop();
    
    // Draw Name of User
    push();
    fill(0);
    textSize(18);
    textFont(bodyFont);
    textAlign(LEFT, CENTER);
    text(v.name, 100, centerH);
    pop();
    
    // Draw Add button
    if (!v.isAdded){
      push();
      fill(230,230,250);
      circle(cirW, centerH, 50);
      
      // Draw plus
      strokeWeight(4);
      stroke(0);
      line(cirW, centerH - 15, cirW, centerH + 15);
      line(cirW - 15, centerH, cirW + 15, centerH);
      pop();
    }
    else{
      push();
      fill(255,0,0);
      circle(cirW, centerH, 50);
      
      // Draw minus
      strokeWeight(4);
      stroke(255);
      line(cirW - 15, centerH, cirW + 15, centerH);
      pop();
    }
    blockH += blockHeight;
  }
  
  drawProfile();
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(groupSelScreen);
    
    // Check if changed screens.  Remove buttons if so.
    if(CURRENT_SCREEN != SCREEN_GROUPSEL) removeButtons();
    
    // If a number is returned then update button status
    if (typeof buttonAction === "number" && !isNaN(buttonAction))
    { changeButtonStatus(buttonAction); 
    console.log("Button Pusshed!");}
    else{
      if (buttonAction == "reset") resetInvites();
    }
  }
}

// Adds/ removes potential users to group and changes their corresponding buttons from plus to minus or minus to plus
function changeButtonStatus(butt){
  let u = butt - newButtonsPos;
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
function addUserButtons(){
  
  let numCurButtons = groupSelScreen.buttons.length;
  let blockH = blockPosH;
  let counter = 0;
  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;
    
    // Height of the button
    let cirH = blockH + blockHeight/2;
    blockH += blockHeight;

    counter++;

    if (counter <= numCurButtons - newButtonsPos) continue;
    
    // diamater of the button
    let bD = 50;
    
    groupSelScreen.addButton(new Button(cirW - bD/2, cirH - bD/2, bD, bD, null, "status"));
  }
}

// Remove buttons when leave this screen
function removeButtons(){
  groupSelScreen.buttons.splice(newButtonsPos);
}