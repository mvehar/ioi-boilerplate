var inactivityTimer;

$(document).ready(function(){

    $(".btn-en, .btn-slo").click(function(){
        var lang = $(this).data("lang");
        console.log(lang);
        localStorage.setItem("lang",lang);
        $("body").removeClass("lang-en lang-slo").addClass("lang-"+lang);

        $(this).parents(".dropdown").children("button").text($(this).text());


    });

    if(localStorage.getItem("lang")){
        $(".btn-"+localStorage.getItem("lang")).click();
    }else{
        $(".btn-en").click();
    }
    $(this).on("click mousemove mousedown keypress touchstart", resetTimer);


});

function resetTimer() {
    console.log("reset");
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(inactivity, 1000*60*2);
}

function inactivity(){
    window.location.href = "index.html";
}