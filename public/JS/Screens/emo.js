// Variables




// BUTTONS

emoScreen.addButton(new Button(322, 7.5, 50.35, 57.49, OVERLAY_PROFILE, null));
emoScreen.addButton(new Button(56, 631, 478, 56, OVERLAY_SAVED, null));
emoScreen.addButton(new Button(56, 723, 478, 56, SCREEN_LOBBY, null));

function emo(){
  emoScreen.draw();
  
  // Measures for emo graph
  let x = 34;
  let y = 235;
  let w = 341;
  let h = 255;
  
  // Draw Graph based on just this user
  let a = [];
  a.push(thisUser);
  
  graphing(a,x,y,w,h);
  
  drawProfile();
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(emoScreen);
    
    
  }
  
}