// Initialize
overlays[OVERLAY_PROFILE*-1] = new Overlay("Profile", "Assets/Overlay_Images/profill.png", canvasWidth, 0, SLIDE_LEFT, SLIDE_RIGHT, profile);


// BUTTONS

// Exit out of profile
overlays[OVERLAY_PROFILE*-1].addButton(new Button(0, 0, canvasWidth - 262, 844, null, "exit"));

// Go to tutorial
overlays[OVERLAY_PROFILE*-1].addButton(new Button(149, 346.5, 95, 25, SCREEN_TUTORIAL, "exit"));


function profile(){
  
  let overl = overlays[abs(OVERLAY_PROFILE)];
  
  overl.draw();
  
  // Draw this user's name
  push();
  fill(255);
  textSize(16);
  textFont(bodyFont);
  text(thisUser.name, overl.x + 149, overl.y + 144);
  pop();
  
  if (overl.active && touchPressed){
    let buttonAction = buttonSelect(overl);
    
    if (buttonAction == "exit") {
      overl.state = EXIT;
      overl.active = false;
    }
  }
}