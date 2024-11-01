let transSpeed = 22;

// For fades
let tintVal = 0;
const tintSpeed = 3;
let tintChange = tintSpeed;

// Array for transitions for easy indexing
let transitions = [
  
  // SLIDE LEFT
  function slideLeft(obj, tarX, tarY) {
    
    obj.x -= transSpeed;
    
    if (obj.x <= tarX) {
      obj.x = tarX;
      obj.state = null;
    }
  },
  
//___________________________________________________________________
  // SLIDE RIGHT
  function slideRight(obj, tarX, tarY) {
    
    obj.x += transSpeed;
    
    if (obj.x >= tarX) {
      obj.x = tarX;
      obj.state = null;
    }
    
  },
  
//___________________________________________________________________
  // SLIDE DOWN
  function slideDown(obj, tarX, tarY) {
    
    obj.y += transSpeed;
    
    if (obj.y >= tarY) {
      obj.y = tarY;
      obj.state = null;
    }
    
  },

//___________________________________________________________________
  // SLIDE UP
  function slideUp(obj, tarX, tarY) {
    
    obj.y -= transSpeed;
    
    if (obj.y <= tarY) {
      obj.y = tarY;
      obj.state = null;
    }
    
  },
  
//___________________________________________________________________
  // FADE IN
  function fadeIn(obj, tarX, tarY) {
    
    tintVal += tintChange;
  
    if (tintVal >= 255) {
      tintVal = 255;
      obj.state = null;
    }
  },
  
//___________________________________________________________________
  // FADE OUT
  function fadeOut(obj, tarX, tarY) {
    
    tintVal -= tintChange;
    
    if (tintVal <= 0) {
      tintVal = 0;
      obj.state = null;
    }
  }
]