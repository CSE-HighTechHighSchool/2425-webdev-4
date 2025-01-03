// Function to check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem('user') !== null || sessionStorage.getItem('user') !== null;
}

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the button element
    const specialButton = document.getElementById('dataViewer');

    // Show or hide the button based on login status
    if (isLoggedIn()) {
        specialButton.style.display = 'block';
    } else {
        specialButton.style.display = 'none';
    }

    // Create a new instance of the modal
    var myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
    // Show the modal
    myModal.show();
});