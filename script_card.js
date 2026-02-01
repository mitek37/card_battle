$(document).ready(function() {
    const $BASE_URL = "https://mitek37.github.io/card_battle/image/index_";

    const $gallery = $('#gallery');
    const $overlay = $('#overlay');
    const $overlayImg = $('#overlay-img');
    const $buttons = $('.cs-btn');
    const $chbuttons = $('.ch-btn');
    const $evbuttons = $('.ev-btn');
    const $cobuttons = $('.co-btn');
    let $chcate = 'chara';
    let $evcate = 'event';
    let $cocate = 'event';

    function loadImages(cate) {
        $gallery.empty();

        $.getJSON($BASE_URL + cate + '.json')
            .done(function(data) {
                const images = data.images;

                images.forEach(file => {
                    const $img = $('<img>')
                        .attr('src', 'image' + '/' + file)
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

    // カテゴリーボタン
    $buttons.on('click', function() {
        $buttons.removeClass('active');
        $(this).addClass('active');

        if ($(this).data('folder') === 'chara') {
            document.querySelector('.charasort').style.display = 'flex';
            loadImages($chcate);
        } else {
            document.querySelector('.charasort').style.display = 'none';
        }

        if ($(this).data('folder') === 'event') {
            document.querySelector('.eventsort').style.display = 'flex';
            loadImages($evcate);
        } else {
            document.querySelector('.eventsort').style.display = 'none';
        }

        if ($(this).data('folder') === 'cost') {
            document.querySelector('.costsort').style.display = 'flex';
            loadImages($cocate);
        } else {
            document.querySelector('.costsort').style.display = 'none';
        }

        if ($(this).data('folder') === 'all') {
            loadImages('all');
        }
    });

    // キャラボタン
    $chbuttons.on('click', function() {
        $chbuttons.removeClass('active');
        $(this).addClass('active');

        $chcate = $(this).data('folder');
        loadImages($chcate);
    });

    // イベントボタン
    $evbuttons.on('click', function() {
        $evbuttons.removeClass('active');
        $(this).addClass('active');

        $evcate = $(this).data('folder');
        loadImages($evcate);
    });

    // コストボタン
    $cobuttons.on('click', function() {
        $cobuttons.removeClass('active');
        $(this).addClass('active');

        $cocate = $(this).data('folder');
        loadImages($cocate);
    });

    loadImages('all');
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





