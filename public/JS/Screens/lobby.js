// Variables
// Start with main group
// Keep track of when new groups get added
let NUM_GROUPS = 1;
const heightInit = 157;

// Movie Buddy group button position to be decided later
let movieBuddyButtonPos = null;

// BUTTONS

// Group creation button is first for simple access
lobbyScreen.addButton(new Button(0, heightInit+chatHeight, 390, chatHeight, SCREEN_GROUPSEL, null));

lobbyScreen.addButton(new Button(322, 7.5, 50.35, 57.49, OVERLAY_PROFILE, null));

// Leave Lobby Button
const leaveButton = 2;
lobbyScreen.addButton(new Button(0,782, 390, 64, OVERLAY_LEAVE, null));

// Back button is i = 3 (fourth button)
const lobBackButton = 3;
lobbyScreen.addButton(new Button(24, 34, 24, 24, SCREEN_HOME, null));

// Main chat button added last to order the addition of groups
// Main chat is i = 4 (5th button)
const mainPos = 4;
lobbyScreen.addButton(new Button(0, heightInit, 390, chatHeight, SCREEN_CHAT, "chat"));


function lobby(){
  lobbyScreen.draw();
  
  drawProfile();
  
  // RESPONSIVE: Will create a new button when notices a new group is added
  if (NUM_GROUPS != groupHolder.length){
    
    // Move create group button down
    lobbyScreen.buttons[0].y += chatHeight;

    // Move movie buddy group button down
    if (movieBuddy != null) {
      lobbyScreen.buttons[movieBuddyButtonPos].y += chatHeight;
      buddyGroup.y += chatHeight;
    }
    
    addGroupButton();
    NUM_GROUPS++;
  }
  
  // Draw groups
  for (let v of groupHolder){ v.drawPreview(); }

  // Draw movie buddy group
  if (buddyGroup != null) buddyGroup.drawPreview();

  // Draw add group button
  let center = lobbyScreen.buttons[0].y + chatHeight/2;
  fill(205);
  circle(43, center, 51);
  
  // Draw plus sign in middle
  push();
  strokeWeight(4);
  stroke(0);
  line(43, center - 15, 43, center + 15);
  line(43 - 15, center, 43 + 15, center);
  pop();
  
  // Draw text for group creation
  fill(205, 200);
  textFont(bodyFont);
  textAlign(LEFT);
  textSize(15);
  text("Create a new group", 85.71, center + 5);
  
  if (movieIsDone) {
    lobbyScreen.buttons[leaveButton].active = true;
    
    // Draw leave button
    push();
    rectMode(CORNER);
    noStroke();
    fill(75,80,185);
    rect(0,782, 390, 64);
    
    // Draw text
    fill(255);
    textFont(bodyFont);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Leave the Virtual Cinema", width/2, 814);
    pop();
    
    
    
  }
  else lobbyScreen.buttons[leaveButton].active = false;
  
  // Buttons pressed
  if (!overlayActive && touchPressed){
    
    let buttonAction = buttonSelect(lobbyScreen);
    
    // Assigns the chat the user selected to be shown
    if (typeof buttonAction === "number" && !isNaN(buttonAction)){
      
      if (buttonAction == movieBuddyButtonPos) currentGroup = buddyGroup;
      else {

        let shiftPos = 0;
        if (buttonAction > movieBuddyButtonPos && movieBuddyButtonPos != null) shiftPos = 1;
        let tarGroup = groupHolder[buttonAction - mainPos - shiftPos]
        let isInGroup = false;
        
        // Check if have access to group first
        for (let v of tarGroup.users){
          if (v.ID == thisUser.ID) {
            isInGroup = true;
            break;
          }
        }
        
        // Set chat group to target group
        if (isInGroup) currentGroup = tarGroup;
        else changeScreen(SCREEN_LOBBY);
      }
    }
  }
}

// Create new button for newly added group
function addGroupButton(){
  
  lobbyScreen.addButton(new Button(0, heightInit + chatHeight*NUM_GROUPS, 390, chatHeight, SCREEN_CHAT, "chat"));
  
}