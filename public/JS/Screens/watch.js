// Variables
// Length of film
let timer = 1; // in seconds
let minutes, seconds;
let timerInterval;

let syncNum = 0.75

let movieStart = true;

// BUTTONS

const resultsButton = 0;
watchScreen.addButton(new Button(48, 671, 294, 56, SCREEN_MATCH, null));


function watchMovie(){

  // Setup
  if (movieStart){
    minutes = floor(timer / 60);
    seconds = timer % 60;
    timerInterval = setInterval(updateTimer, 1000);
    movieStart = false;
  }
  
  watchScreen.draw();

  // display the timer in format xx:xx
  push();
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  textFont(timerFont);
  text(`${nf(minutes,2)}:${nf(seconds,2)}`, width/2, 170);
  pop();
  
  if (timer <= 0){
    watchScreen.buttons[resultsButton].active = true;
    
    // Display results button when movie done
    push();
    fill(199, 35, 62);
    rect(48, 671, 294, 56, 30);

    fill(255);
    textFont(bodyFont);
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text("See Results", 195, 700);

    pop();
    
    // Find person to be movie buddy
    if (movieBuddy == null) findMatch();
  }
  else watchScreen.buttons[resultsButton].active = false;
  
  if (!overlayActive && touchPressed){
  
    let buttonAction = buttonSelect(watchScreen);
    
  }
  
}

// Determines who movie buddy is
// For testing - assignment is fixed
function findMatch(){
  
  let mUsers = mainGroup.users;
  let tUser = null;

  for (let i = 0; i< mUsers.length; i++){
    if (mUsers[i].ID == thisUser.ID){
      tUser = i;
      break;
    }
  }
  
  // Assign opposite person in queue from you
  // Won't work with an odd number of people
  movieBuddy = mUsers[mUsers.length - 1 - tUser];


  // Create movie buddy group
  // Will be seperate from the groupholder so only user and movie buddy can see it
  // Don't need to send to server 
  let newH = mainGroup.y + mainGroup.h * groupHolder.length;
  let buddyGroupName = "Movie Buddy: " + movieBuddy.name;

  buddyGroup = new Group(buddyGroupName, newH, -1);

  // Add this user and movie buddy to the group
  buddyGroup.users.push(thisUser);
  buddyGroup.users.push(movieBuddy);

  // Create Button
  movieBuddyButtonPos = groupHolder.length + mainPos;
  addGroupButton();

  // Move create group button down
  // Buddy Group chat will be second from bottom
  lobbyScreen.buttons[0].y += chatHeight;

}

// Updates visual timer of movie
function updateTimer() {
  timer--;
  if (timer < 0) {
    clearInterval(timerInterval);
    // do something when timer reaches 0
  } else {
    minutes = floor(timer / 60);
    seconds = timer % 60;
  }
}