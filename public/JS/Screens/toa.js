// BUTTONS

toaScreen.addButton(new Button(48, 753, 294, 56, SCREEN_LOBBY, "exit"));
toaScreen.addButton(new Button(24, 34, 24, 24, SCREEN_HOME, null));

function toa(){
  
  toaScreen.draw();
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(toaScreen);
    
    if (buttonAction == "exit") exitTOA();
    
  }
  
}

// Redirect welcome screen
function exitTOA(){
  
  // Redirect welcome screen 
  homeScreen.buttons[0].destination = SCREEN_LOBBY;
}