document.addEventListener("DOMContentLoaded", function () {
    const gif = document.getElementById("bgGif");
    const gifs = [
        "https://media3.giphy.com/media/c76IJLufpNwSULPk77/giphy.gif?cid=6c09b952eefdi88tf7evj3m9jo67c1644ndd04ooh32xo7q4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g",
        "https://media.tenor.com/-Y2YOay3_JoAAAAM/its-friday-dancing.gif",
    ];
    let gifIndex = 0;

    function showNextGif() {
        gif.src = gifs[gifIndex];
        gifIndex = (gifIndex + 1) % gifs.length;
    }

    gif.addEventListener("load", function() {
        setTimeout(showNextGif, 7000); // Change GIF every 5 seconds
    });

    showNextGif();
});
