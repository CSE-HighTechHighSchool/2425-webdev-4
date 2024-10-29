/*
File: script.js
Description: This file contains the JavaScript code for the rotating gif on index.html  
*/

document.addEventListener("DOMContentLoaded", function () { // Wait for the document to be fully loaded
  const gif = document.getElementById("bgGif");              
  const gifs = [                                            // Array of the GIFs to be used
    "img/1.gif",
    "img/2.gif",
    "img/3.gif",
    "img/4.gif",
    "img/5.gif",
    "img/6.gif",
    "img/7.gif",
    "img/8.gif",
  ];
  let gifIndex = 0;                                         // Index of the current GIF

  function showNextGif() {                                  // Function to rotate gifs
    gif.src = gifs[gifIndex];
    gifIndex = (gifIndex + 1) % gifs.length;
  }

  gif.addEventListener("load", function () {                // Waits for the GIF to be loaded, and then after a timeout, change the GIF 
    setTimeout(showNextGif, 6000);                          // Change GIF every 6 seconds
  });

  showNextGif();                                            // Run the function       
});
