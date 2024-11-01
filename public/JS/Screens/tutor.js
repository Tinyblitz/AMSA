// Variables
let firstTimeTutorial = true;
let tutorialTracker = 0;

// BUTTONS

tutorialScreen.addButton(new Button(48, 671, 294, 56, null, "next"));
tutorialScreen.addButton(new Button(177, 745, 37, 23, null, "exit"));


function Tutorial(){
  
  tutorialScreen.draw();
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(tutorialScreen);
    
    if (buttonAction == "next") nextTutorial();
    if (buttonAction == "exit") exitTutorial();
    
  }
  
}

// Move through each tutorial screen
function nextTutorial(){

  tutorialScreen.pngImage = tutHolder[++tutorialTracker];
  
  // Change destination of continue button on last screen
  if (tutorialTracker >= numTutorials - 1) {
    
    tutorialScreen.buttons[0].action = "exit";
      
    // Deactivate skip button
    tutorialScreen.buttons[1].active = false;  
  }
}

// Reset tutorial on exit and redirect welcome screen
function exitTutorial(){
  
  // Reset tutorial to first screen
  tutorialTracker = 0;
  tutorialScreen.pngImage = tutHolder[0];
  
  if (firstTimeTutorial) { 
    
    changeScreen(SCREEN_TOA);
    
    // Redirect welcome screen 
    homeScreen.buttons[0].destination = SCREEN_TOA; 
    
    firstTimeTutorial = false;
  }
  else changeScreen(PREVIOUS_SCREEN);
  
  // Reset continue button
  tutorialScreen.buttons[0].action = "next";
  
  // Reactivate skip button
  tutorialScreen.buttons[1].active = true;
}