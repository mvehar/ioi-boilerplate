$(document).ready(function(){
    $(".btn-en, .btn-slo").click(function(){
        $("body").toggleClass("lang-en").toggleClass("lang-slo");
    });
});