$(document).ready(function(){
    $(".btn-en, .btn-slo").click(function(){
        var lang = $(this).data("lang");
        $("body").removeClass("lang-en lang-slo").addClass("lang-"+lang);

        $(this).parents(".dropdown").children("button").text($(this).text());

    });
    $(".btn-en").click();
});