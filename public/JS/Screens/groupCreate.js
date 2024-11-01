// Variables

let newGroupName = null;

// BUTTONS

groupCreateScreen.addButton(new Button(322, 7.5, 50.35, 57.49, OVERLAY_PROFILE, null));
groupCreateScreen.addButton(new Button(56, 609, 278, 56, SCREEN_LOBBY, "add"));
groupCreateScreen.addButton(new Button(24, 34, 24, 24, SCREEN_GROUPSEL, null));


function groupCreate(){
  groupCreateScreen.draw();
  
  // Draw text field
  inputField.position(30, 339);
  inputField.size(240, 40);
  inputField.attribute("placeholder", "Name your group...");
  inputField.attribute('maxlength', 13);
  inputField.show();
  
  // Assign group name from input field
  newGroupName = inputField.value();
  
  // When an overlay pops up, hide away DOM elements
  if (overlayActive){
    inputField.value("");
    inputField.hide();
    
  }
  
  drawProfile();
  
  // Button stuff
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(groupCreateScreen);
    
    // Create new group with new name
    if (buttonAction == "add") {
      if (newGroupName != null && newGroupName != '' && newGroupName[0] != ' ')
      { addGroup(); }
      else
        // stay on this screen
        changeScreen(SCREEN_GROUPCREATE);
      
      // draw out notification of invalid group name
    } 
    
    // Reset text bar if leave group creation screen
    if (CURRENT_SCREEN != SCREEN_GROUPCREATE) 
    { inputField.value(""); }
  }
}

// Upon creating a new group, will add said group to array
// And send invites to other users
function addGroup(){
  
  // Make new group
  let newH = mainGroup.y + mainGroup.h * groupHolder.length;
  let newGrp = new Group(newGroupName, newH, groupHolder.length);
  
  // Add this user to the group
  newGrp.users.push(thisUser);
   
  // Add group to group array
  groupHolder.push(newGrp);
  
  // Add group to user's collection of groups
  thisUser.groups.push(newGrp.ID);

  // Message Server: Send Group Creation
  var data = {
    n: newGrp.name,
    y: newGrp.y,
    g: newGrp.ID
  };

  socket.emit('addGroup', data);

  // Message Server: Add this user to the newly created group on the server

  var data2 = {
    u: thisUser.ID,
    g: newGrp.ID
  };

  socket.emit('addUser', data2);
  
  // Message Server: Send Invites

  var data3 = {
    i: [],
    g: newGrp.ID
  };

  for (let v of mainGroup.users){
    if (v == null) continue;
    if (v.ID == thisUser.ID) continue;

    if (v.isAdded) data3.i.push(v.ID);
  }

  socket.emit('sendInvites', data3);
  
  // Reset users for if want to make another group
  resetInvites();
}