// Initialize
overlays[OVERLAY_LEAVE*-1] = new Overlay("Leave", "Assets/Overlay_Images/lever.png", 0, canvasHeight, SLIDE_UP, SLIDE_DOWN, leave);

// BUTTONS

overlays[OVERLAY_LEAVE*-1].addButton(new Button(325, 89, 33, 33, null, "exit"));

overlays[OVERLAY_LEAVE*-1].addButton(new Button(57, 532, 278, 56, OVERLAY_SAVED, null));


function leave(){
  
  let overl = overlays[abs(OVERLAY_LEAVE)];
  
  overl.draw();
  
  // Measures for emo graph
  let x = overl.x + 34;
  let y = overl.y + 215;
  let w = 341;
  let h = 200;
  
  // Draw Graph based on just this user
  let a = [];
  a.push(thisUser);
  
  graphing(a,x,y,w,h);
  
  if (overl.active && touchPressed){

    let buttonAction = buttonSelect(overl);
    
    if (buttonAction == "exit") {
      overl.state = EXIT;
      overl.active = false;
    }
    
  }
}