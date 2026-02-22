$(document).ready(function() {
    const $BASE_URL = "https://mitek37.github.io/card_battle/image/index_";

    const $gallery = $('#gallery');
    const $overlay = $('#overlay');
    const $overlayImg = $('#overlay-img');
    const $buttons = $('.cs-btn');
    const $chbuttons = $('.ch-btn');
    const $evbuttons = $('.ev-btn');
    const $cobuttons = $('.co-btn');
    const $cibuttons = $('.ci-btn');
    let $chcate = 'chara';
    let $evcate = 'event';
    let $cocate = 'c0';
    let $coiden = 'all';

    function loadImages(cate) {
        $gallery.empty();

        let excludeJson = null;

        // cateがcharaならeventを除外対象にする
        if ($coiden === "chara") {
            excludeJson = "chara.json";
        }
        // cateがeventならcharaを除外対象にする
        else if ($coiden === "event") {
            excludeJson = "event.json";
        }

        // 除外が必要ない場合は普通に表示
        if (!excludeJson) {
            $.getJSON($BASE_URL + cate + '.json')
                .done(function(data) {
                    data.images.forEach(file => addImage(file));
                })
                .fail(function(jqxhr, textStatus, error) {
                    console.error("JSON読み込み失敗:", textStatus, error);
                });

            return;
        }

        // ① cate.json を読み込む
        $.getJSON($BASE_URL + cate + '.json')
            .done(function(data) {

                // ② 除外対象JSONを読み込む
                $.getJSON($BASE_URL + excludeJson)
                    .done(function(excludeData) {

                        const images = data.images;
                        const excludeImages = excludeData.images;

                        // 除外リストをSet化（高速）
                        const excludeSet = new Set(excludeImages);

                        // 除外して表示
                        images.forEach(file => {
                            if (excludeSet.has(file)) {
                                addImage(file);
                            }
                        });

                    })
                    .fail(function(jqxhr, textStatus, error) {
                        console.error("除外JSON読み込み失敗:", textStatus, error);
                    });

            })
            .fail(function(jqxhr, textStatus, error) {
                console.error("JSON読み込み失敗:", textStatus, error);
            });
    }

    function addImage(file) {
        const $img = $('<img>')
            .attr('src', 'image' + '/' + file)
            .attr('alt', file)
            .css('cursor', 'pointer')
            .on('click', function() {
                $overlayImg.attr('src', $(this).attr('src'));
                $overlay.stop(true,true).fadeIn(300);
            });

        $gallery.append($img);
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
            document.querySelector('.coidsort').style.display = 'flex';
            loadImages($cocate);
        } else {
            document.querySelector('.costsort').style.display = 'none';
            document.querySelector('.coidsort').style.display = 'none';
            $coiden = 'all'
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

    $cibuttons.on('click', function() {
        $cibuttons.removeClass('active');
        $(this).addClass('active');

        $coiden = $(this).data('folder');
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