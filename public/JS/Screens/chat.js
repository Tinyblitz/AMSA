// MAIN BUTTONS

chatScreen.addButton(new Button(322, 7.5, 50.35, 57.49, OVERLAY_PROFILE, null));

// Open overlay to add a friend
const overFriendButt = 1;
chatScreen.addButton(new Button(70, 25, 240, 35, OVERLAY_ADDFRIEND, null));

chatScreen.addButton(new Button(24, 34, 24, 24, SCREEN_LOBBY, null));

function chat(){
  chatScreen.draw();
  
  // Draw all the messages stored so far
  currentGroup.drawChat();
  
  // Draw Emotion Graph
  // Won't display emotion graph on main chat
  if (movieIsDone && currentGroup.ID != 0){
    // Measures for emo graph
    let x = 34;
    let y = 90;
    let w = 341;
    let h = 150;

    graphing(currentGroup.users,x,y,w,h);
  }
  
  // Draw HUD to be able to hide chat that comes up that far
  image(chatHUD, 0, 0, width, chatHUD.height);
  
  // Draw text field
  inputField.position(sidePad, chatFieldHeight);
  inputField.size(303 - 2*sidePad, 30);
  inputField.attribute("placeholder", "Send your comments here...");
  inputField.removeAttribute('maxlength');
  inputField.show();
  
  // Draw send button
  sendButton.size(50, 30);
  sendButton.position(width - sidePad - 55, 775);
  sendButton.mousePressed(sendMessage);
  sendButton.show();
  
  // When an overlay pops up, hide away DOM elements
  if (overlayActive){
    inputField.value("");
    inputField.hide();
    sendButton.hide();
  }
  
  let arrowH = 0;
  
  // Draw Group name
  if (currentGroup == null) console.log("ERROR: Did not access an existing chat");
  else {
    push();
    fill(255);
    textFont(nameFont);
    textSize(30);
    textAlign(CENTER);
    let textH = textAscent() - textDescent();
    arrowH = chatHUD.height/2 + textH/2;
    if (currentGroup == buddyGroup) text("Movie Buddy", width/2, arrowH + 5);
    else text(currentGroup.name, width/2, arrowH + 5);
    pop();
  }
  
  if (currentGroup.ID == mainGroup.ID || currentGroup.ID == -1) chatScreen.buttons[overFriendButt].active = false;
  else {
    // Draw drop down for user add
    push();
    textSize(30);
    fill(0,200,0);
    let ts = 8;
    let arrowW = width/2 + textWidth(currentGroup.name)/2 + ts;
    triangle(arrowW, arrowH + ts, // bottom vertex
             arrowW - ts, arrowH - ts, // top left vertex
             arrowW + ts, arrowH - ts); // top right vertex

    pop();
    chatScreen.buttons[overFriendButt].active = true;
  }
  
  // Draw profile in top right corner
  drawProfile();
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(chatScreen);
    
    // Reset text bar if leave chat screen
    if (CURRENT_SCREEN != SCREEN_CHAT) 
    { inputField.value(""); }
    
  }
}

// Upon hitting send button, will add a new message to current group's chat
function addChatMessage(tex) {
  // create new chat message object
  
  textSize(15);
  textFont(bodyFont);
  textAlign(LEFT);
  
  let textW = textWidth(tex);
  let textH = textAscent() + textDescent();

  // calculate bubble size based on text width and height
  let maxWidth = width * 0.6;
  if (textW > maxWidth) {
    textW = maxWidth;
    textH = ceil(textWidth(tex) / maxWidth) * (textAscent() + textDescent()) + 20;
  }

  // Create Message to send to server
  var data = {
    u: thisUser.ID,
    t: tex,
    w: textW,
    h: textH,
    g: currentGroup.ID
  };

  // Send Message to server
  socket.emit('message', data);

  // clear input field
  inputField.value("");

  // scroll to bottom of chat
  window.scrollTo(0, document.body.scrollHeight);
}

// Function for send button
function sendMessage() {
  
  // Condition to prevent spamming of the send button
  if (inputField.value() != '') addChatMessage(inputField.value());
}