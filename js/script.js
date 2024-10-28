document.addEventListener("DOMContentLoaded", function () {
    const gif = document.getElementById("bgGif");
    const gifs = [
        "img/1.gif",
        "img/2.gif",
        "img/3.gif",
        "img/4.gif",
        "img/5.gif",
        "img/6.gif",
        "img/7.gif",
        "img/8.gif",
    ];
    let gifIndex = 0;

    function showNextGif() {
        gif.src = gifs[gifIndex];
        gifIndex = (gifIndex + 1) % gifs.length;
    }

    gif.addEventListener("load", function() {
        setTimeout(showNextGif, 6000); // Change GIF every 6 seconds
    });

    showNextGif();
});
