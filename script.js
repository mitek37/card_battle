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

});

