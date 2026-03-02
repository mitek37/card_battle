$(document).ready(function() {
    const $BASE_URL = "https://mitek37.github.io/card_battle/image/index_";
    const $JSON_URL = "https://mitek37.github.io/card_battle/json/";

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
    let $cocate = '0';
    let $coiden = 'all';
    let $seleValue = 'alpha'

    function loadImages(cate) {
        $gallery.empty();

        let excludeJson = null;

        let results = [];

        // cateがcharaならeventを除外対象にする
        if ($coiden === "chara") {
            excludeJson = "chara.json";
        }
        // cateがeventならcharaを除外対象にする
        else if ($coiden === "event") {
            excludeJson = "event.json";
        }

        $.getJSON($JSON_URL + 'card_search.json')
            .done(function(data) {
                let cards = data.card;

            // 除外が必要ない場合は普通に表示
            if (!excludeJson) {
                $.getJSON($BASE_URL + cate + '.json')
                    .done(function(data) {
                        results = applySort(data.images, cards, $seleValue);
                        results.forEach(file => addImage(file));
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

                            results = applySort(images, cards, $seleValue);

                            // 除外して表示
                            results.forEach(file => {
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
            })

            .fail(function(jqxhr, textStatus, error) {
                console.error("card_search.json 読み込み失敗:", textStatus, error);
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

    function searchCards(keywords,searchtype = "detail") {
        $gallery.empty();

        $.getJSON($JSON_URL + 'card_search.json')
            .done(function(data) {
                let cards = data.card;
                let results = [];

                // cardの中を全探索
                for (let file in cards) {
                    let info = cards[file];

                    let name = info.name || "";
                    let cost = info.cost || "";
                    let add_version = info.add_version || "";
                    let dps = info.dps || "";
                    let dfs = info.dfs || "";
                    let life = info.life || "";
                    let effect = info.effect || "";
                    let flavor = info.flavor || "";

                    // どれかのキーワードが含まれていたらヒット
                    if (searchtype === 'detail') {
                        const hit = keywords.every(word =>
                            name.includes(word) ||
                            effect.includes(word) ||
                            flavor.includes(word)
                        );

                        if (hit) {
                            results.push(file);
                        }
                    }

                    if (searchtype === 'cost') {
                        const hit = keywords.some(word => {
                            // wordが"12"のときは12以上で判定
                            if (word === "12") {
                                return Number(cost) >= 12;
                            }

                            // それ以外は完全一致
                            return cost === word;
                        });

                        if (hit) {
                            results.push(file);
                        }
                    }
                }

                let excludeJson = null;

                // cateがcharaならeventを除外対象にする
                if ($coiden === "chara") {
                    excludeJson = "chara.json";
                }
                // cateがeventならcharaを除外対象にする
                else if ($coiden === "event") {
                    excludeJson = "event.json";
                }

                results = applySort(results, cards, $seleValue);
                
                // 除外が必要ない場合は普通に表示
                if (!excludeJson) {
                    results.forEach(file => addImage(file));
                } else {

                    // ② 除外対象JSONを読み込む
                    $.getJSON($BASE_URL + excludeJson)
                        .done(function(excludeData) {
                            const excludeImages = excludeData.images;

                            // 除外リストをSet化（高速）
                            const excludeSet = new Set(excludeImages);

                            // 除外して表示
                            results.forEach(file => {
                                if (excludeSet.has(file)) {
                                    addImage(file);
                                }
                            });

                        })
                        .fail(function(jqxhr, textStatus, error) {
                            console.error("除外JSON読み込み失敗:", textStatus, error);
                        });
                }

            })

            .fail(function(jqxhr, textStatus, error) {
                console.error("card_search.json 読み込み失敗:", textStatus, error);
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

        if ($(this).data('folder') === 'cost') {
            document.querySelector('.costsort').style.display = 'flex';
            document.querySelector('.coidsort').style.display = 'flex';
            const keywords = $cocate.split("、").map(s => s.trim()).filter(s => s !== "");
            searchCards(keywords,'cost');
        } else {
            document.querySelector('.costsort').style.display = 'none';
            document.querySelector('.coidsort').style.display = 'none';
            $coiden = 'all';
            $cibuttons.removeClass('active');
            $('.ci-btn[data-folder="all"]').addClass('active');
        }

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

        if ($(this).data('folder') === 'search') {
            document.querySelector('.searchsort').style.display = 'flex';
            document.querySelector('.searchtext').style.display = 'flex';
            searchCards([""],'detail');
        } else {
            document.querySelector('.searchsort').style.display = 'none';
            document.querySelector('.searchtext').style.display = 'none';
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

        $cocate = String($(this).data('folder'));
        if ($cocate === "12") {
            $cocate = $cocate + "、?"
        }
        const keywords = $cocate.split("、").map(s => s.trim()).filter(s => s !== "");
        searchCards(keywords,'cost');
    });

    $cibuttons.on('click', function() {
        $cibuttons.removeClass('active');
        $(this).addClass('active');

        $coiden = $(this).data('folder');

        const keywords = $cocate.split("、").map(s => s.trim()).filter(s => s !== "");
        searchCards(keywords,'cost');
    });

    $("#searchBtn").on("click", function() {
        const text = $("#searchBox").val().trim();

        if (text === "") {
            alert("検索ワードを入力してください");
            return;
        }

        const keywords = text.split("、").map(s => s.trim()).filter(s => s !== "");

        searchCards(keywords,'detail');
    });

    $("#sortselect").on("change", function() {

        $seleValue = $(this).val();

        const keywords = $cocate.split("、").map(s => s.trim()).filter(s => s !== "");

        if ($(".cs-btn.active").data("folder") === "all") {
            loadImages('all');
        }

        if ($(".cs-btn.active").data("folder") === "chara") {
            loadImages($chcate);
        }

        if ($(".cs-btn.active").data("folder") === "event") {
            loadImages($evcate);
        }
        
        if ($(".cs-btn.active").data("folder") === "cost") {
            searchCards(keywords, "cost");
        }

        if ($(".cs-btn.active").data("folder") === "search") {
            const text = $("#searchBox").val().trim();
            const words = text.split("、").map(s => s.trim()).filter(s => s !== "");
            searchCards(words, "detail");
        }
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





