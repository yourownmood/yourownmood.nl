$( document ).ready(function() {

    $(".lazy").lazyload({
        effect : "fadeIn"
    });

    new WOW().init();

    $('.card__profile, .card__project').on("touchstart", function (e) {

    });

});