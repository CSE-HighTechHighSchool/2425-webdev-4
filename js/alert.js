// File: alert.js
// Description: This file contains the JavaScript code for the modal that pops off when loading the index.html

document.addEventListener("DOMContentLoaded", function () {
  // Wait for the document to be fully loaded
  var myModal = new bootstrap.Modal(document.getElementById("exampleModal")); // Create a new instance of the modal
  myModal.show(); // Show the modal

  // Remove the overlay when the modal is closed
  document.getElementById("exampleModal").addEventListener("hidden.bs.modal", function () {
    var modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  });
});