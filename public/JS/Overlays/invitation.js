// Initialize
overlays[OVERLAY_INVITATION*-1] = new Overlay("Invitation", "Assets/Overlay_Images/invitee.png", 0, -canvasHeight, SLIDE_DOWN, SLIDE_UP, invitation);

// Variables
let invitGroupID = null;

// BUTTONS

// Accept Invitation
overlays[OVERLAY_INVITATION*-1].addButton(new Button(214, 617, 144, 56, null, "add"));

// Decline Invitation
overlays[OVERLAY_INVITATION*-1].addButton(new Button(31, 617, 144, 56, null, "exit"));


function invitation(){
  
  let overl = overlays[abs(OVERLAY_INVITATION)];
  
  overl.draw();
  
  let invitGroupName = groupHolder[invitGroupID].name;
  
  // Draw Group Name
  push();
  fill(255);
  textSize(30);
  textFont(nameFont);
  textAlign(CENTER, CENTER);
  text(invitGroupName, overl.x + 195, overl.y + 285);
  pop();
  
  if (overl.active && touchPressed){
    let buttonAction = buttonSelect(overl);
    
    if (buttonAction == "add"){
      
      addToGroup();
      buttonAction = "exit";
    }
    
    if (buttonAction == "exit") {
      overl.state = EXIT;
      overl.active = false;
    }
  }
}

function addToGroup() {
  
  let tarGroup = groupHolder[invitGroupID];
  
  // Check if already in group first
  for (let v of tarGroup.users){ if (v.ID == thisUser.ID) return false; }
  
  // Add group to list of groups user is a part of
  thisUser.groups.push(tarGroup.ID);
  
  // Add user to target group
  tarGroup.users.push(thisUser);
  
  // Send message to server
  var data = {
    u: thisUser.ID,
    g: tarGroup.ID
  };

  socket.emit('addUser', data);
}