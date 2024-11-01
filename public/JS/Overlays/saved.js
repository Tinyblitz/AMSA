// Initialize
overlays[OVERLAY_SAVED*-1] = new Overlay("Saved", "Assets/Overlay_Images/sav.png", 0, 0, FADE_IN, FADE_OUT, saved);

// Variables
const savedTime = 2000;

function saved(){
  
  let overl = overlays[abs(OVERLAY_SAVED)];
  
  // Fade in and out
  push();
  tint(255, tintVal); // Set the color filter to semi-transparent white

  overl.draw();
  pop();
  
  // Lasts on screen for ~2 seconds
  setTimeout(() => {
    overl.state = EXIT;
    overl.active = false;
  }, savedTime);
}