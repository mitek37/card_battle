$(function () {

    // MENUボタンクリックで表示/非表示
    $(".menu-button").on("click", function (e) {
        e.stopPropagation();  // クリックが外側判定されないように
        $(".dropdown-menu").slideToggle(200);
    });

    // ドロップダウンメニュー内クリックは閉じない
    $(".dropdown-menu").on("click", function (e) {
        e.stopPropagation();
    });

    // MENUボタン・メニュー以外をクリックしたら閉じる
    $(document).on("click", function () {
        $(".dropdown-menu").slideUp(200);
    });

});
