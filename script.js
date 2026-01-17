$(function () {
    $(".menu-button").on("click", function (e) {
        e.stopPropagation(); 
        $(".dropdown-menu").slideToggle(200);
    });

    $(".dropdown-menu").on("click", function (e) {
        e.stopPropagation();
    });

    $(document).on("click", function () {
        $(".dropdown-menu").slideUp(200);
    });

    $("#gotop").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 400);
    });

});

