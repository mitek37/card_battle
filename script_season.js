$(document).ready(function() {
    const $BASE_URL = "https://mitek37.github.io/card_battle/image/index_";
    const $JSON_URL = "https://mitek37.github.io/card_battle/json/";

    const $gallerymust = $('#gallery-must');
    const $galleryopti = $('#gallery-opti');
    const $overlay = $('#overlay');
    const $overlayImg = $('#overlay-img');
    const $buttons = $('.cs-btn');
    const mainDeck = mdecks
        .trim()
        .split("\n")
        .map(line => line.split(",")[0] + ".png");

    const subDeck = odecks
        .trim()
        .split("\n")
        .map(line => line.split(",")[0] + ".png")
    let currentCard = null;
    let $coiden = "all";

    function loadImages() {
        $gallerymust.empty();
        $galleryopti.empty();

        loadDeck(mainDeck, $gallerymust);
        loadDeck(subDeck, $galleryopti);
    }

    function loadDeck(deckArray, $target) {

        let excludeJson = null;

        if ($coiden === "chara") {
            excludeJson = "chara.json";
        }
        else if ($coiden === "event") {
            excludeJson = "event.json";
        }

        if (!excludeJson) {
            deckArray.forEach(file => {
                addImage(file, $target);
            });
            return;
        }

        $.getJSON($BASE_URL + excludeJson)
            .done(function(excludeData) {

                const excludeSet = new Set(excludeData.images);

                deckArray.forEach(file => {
                    if (excludeSet.has(file)) {
                        addImage(file, $target);
                    }
                });

            });
    }

    function addImage(file, $target) {

        const $img = $('<img>')
            .attr('src', 'image' + '/' + file)
            .attr('alt', file)
            .css('cursor', 'pointer')
            .on('click', function() {

                currentCard = file;

                $overlayImg.attr('src', $(this).attr('src'));
                $("#cardDetailPanel").hide();
                $("#cardDetailBtn").removeClass("disabled");

                $overlay.stop(true,true).fadeIn(300);
            });

        $target.append($img);
    }

    function applySort(results, cards, sortType) {

        if (!sortType) return results;

        if (sortType === "cost_asc") {
            function getLifeRank(value) {

                if (value === "?") return 98;   // 次

                return Number(value);             // 通常数値
            }

            return [...results].sort((a, b) =>
                getLifeRank(cards[a].cost) - getLifeRank(cards[b].cost)
            );
        }

        if (sortType === "cost_desc") {
            function getLifeRank(value) {

                if (value === "?") return -1;   // 次

                return Number(value);             // 通常数値
            }

            return [...results].sort((a, b) =>
                getLifeRank(cards[b].cost) - getLifeRank(cards[a].cost)
            );
        }

        if (sortType === "life_asc") {

            function getLifeRank(value) {

                if (value === "e") return 99;     // 最優先
                if (value === "?") return 98;   // 次

                return Number(value);             // 通常数値
            }

            return [...results].sort((a, b) =>
                getLifeRank(cards[a].life) - getLifeRank(cards[b].life)
            );
        }

        if (sortType === "life_desc") {

            function getLifeRank(value) {

                if (value === "e") return -2;     // 最優先
                if (value === "?") return -1;   // 次

                return Number(value);             // 通常数値
            }

            return [...results].sort((a, b) =>
                getLifeRank(cards[b].life) - getLifeRank(cards[a].life)
            );
        }

        if (sortType === "name") {

            return [...results].sort((a, b) => {
                const nameA = cards[a].name;
                const nameB = cards[b].name;

                return nameA.localeCompare(nameB, "ja", {
                    numeric: true,       // 数字を正しく比較（2 < 10）
                    sensitivity: "base"  // ひらがな・カタカナ差を無視
                });
            });
        }

        if (sortType === "add_version") {
            return results.sort((a, b) =>
                Number(cards[a].add_version) - Number(cards[b].add_version)
            );
        }

        if (sortType === "dps") {
            return results.sort((a, b) =>
                Number(cards[b].dps) - Number(cards[a].dps)
            );
        }

        if (sortType === "dfs") {
            return results.sort((a, b) =>
                Number(cards[b].dfs) - Number(cards[a].dfs)
            );
        }

        return results;
    }

    $overlay.on('click', function(e) {
        if (e.target === this) {

            $("#cardDetailPanel").hide();
            $("#cardDetailBtn").show();

            $overlay.stop(true,true).fadeOut(300);
            $("#cardDetailBtn").removeClass("disabled");
        }
    });

    // カテゴリーボタン
    $buttons.on('click', function() {
        $buttons.removeClass('active');
        $(this).addClass('active');

        if ($(this).data('folder') === 'chara') {
            $coiden = 'chara';
        }

        if ($(this).data('folder') === 'event') {
            $coiden = 'event';
        }

        if ($(this).data('folder') === 'all') {
            $coiden = 'all';
        }
        loadImages();
    });

    $("#cardDetailBtn").on("click", function(){

    if(!currentCard) return;

    $.getJSON($JSON_URL + 'card_search.json')
        .done(function(data){

            const card = data.card[currentCard];

            let version = card.add_version[0] + "." + card.add_version[1] + "." + card.add_version[2];

            let html = `
            <h2 style="color: orange;">${card.name}</h2>
            <p>実装バージョン：${version}</p>
            <p>最高ダメージ：${card.dps}</p>
            <p>最低保証ダメージ：${card.dfs}<br></p>
            <p>効果考案：${card.effecter}</p>
            <p>画像・イラスト：${card.illustrator}</p>
            `;

            $("#cardDetailContent").html(html);

            $("#cardDetailBtn").addClass("disabled");
            $("#cardDetailPanel").fadeIn(200);

        });

    });

    $("#cardDetailBack").on("click", function(){

        $("#cardDetailPanel").fadeOut(200);
        $("#cardDetailBtn").removeClass("disabled");

    });

    loadImages();
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





