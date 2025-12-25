$(document).ready(function() {
    const $BASE_URL = location.origin + "/card_battle/";

    const $gallery = $('#gallery');
    const $overlay = $('#overlay');
    const $overlayImg = $('#overlay-img');

    function loadImages(folder) {
        $gallery.empty();

        $.getJSON($BASE_URL + folder + '/index_new.json')
            .done(function(data) {
                const images = data.images;

                images.forEach(file => {
                    const $img = $('<img>')
                        .attr('src', folder + '/' + file)
                        .attr('alt', file)
                        .css('cursor', 'pointer')
                        .on('click', function() {
                            $overlayImg.attr('src', $(this).attr('src'));
                            $overlay.stop(true,true).fadeIn(300);
                        });

                    $gallery.append($img);
                });
            })
            .fail(function(jqxhr, textStatus, error) {
                console.error("JSON読み込み失敗:", textStatus, error);
            });
    }

    $overlay.on('click', function(e) {
        if (e.target === this) {
            $overlay.stop(true,true).fadeOut(300);
        }
    });

    loadImages('image');
    $overlay.stop(true,true).fadeOut(300);

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






