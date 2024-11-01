// BUTTONS


matchScreen.addButton(new Button(322, 7.5, 50.35, 57.49, OVERLAY_PROFILE, null));
matchScreen.addButton(new Button(54, 659, 278, 56, SCREEN_EMOTION, null));

function matchBud(){
  matchScreen.draw();
  
  // Draw left person
  
  push();
  
  fill(255);
  translate(100, 457);
  rotate(radians(-15));
  textFont(bodyFont);
  textSize(20);
  textAlign(CENTER, CENTER);
  
  // draw the angled text
  text(thisUser.name, 0, 0);
  
  
  // Draw Avatar
  let thisEmojis = getCharacter(thisUser.n);
  let thisFace = thisEmojis[0];
  imageMode(CENTER);
  
  let thisW = thisFace.width;
  let thisH = thisFace.height;
  
  image(thisFace, 0, -70, thisW, thisH);
  
  pop();
  
  // Draw right person
  push();
  fill(255);
  translate(280, 457);
  rotate(radians(15));
  textFont(bodyFont);
  textSize(20);
  textAlign(CENTER, CENTER);
  
  
  if(movieBuddy == null) console.log("ERROR: Failed to find a movie buddy!");
  
  // draw the angled text
  text(movieBuddy.name, 0, 0);
  
  // Draw Avatar
  let budEmojis = getCharacter(movieBuddy.n);
  let budFace = budEmojis[0];
  imageMode(CENTER);
  
  let budW = budFace.width;
  let budH = budFace.height;
  
  image(budFace, 0, -70, budW, budH);
  pop();
  
  push();
  // Display sync %
  
  // Convert to percentage
  let percentage = Math.round(syncNum * 100).toString() + "%";
  fill(199, 35, 62);
  textFont(syncFont);
  textAlign(CENTER, CENTER);
  textSize(36);
  
  text(percentage, width/2, height/2);
  pop();

  drawProfile();
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(matchScreen);
    
    
  }
  
}