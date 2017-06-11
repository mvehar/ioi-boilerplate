var inactivityTimer;
var nextSceneTimer;
var scenes = {};
var trackActivity = false;
var drugiPoskus = false;
$(document).ready(function(){
    console.log("Loaded");
    $(".btn-en, .btn-slo").click(function(){
        var lang = $(this).data("lang");
        localStorage.setItem("lang",lang);
        document.l10n.requestLanguages([lang]);

        $("body").removeClass("lang-en lang-slo").addClass("lang-"+lang);

        $(this).parents(".dropdown").children("button").text($(this).text());
    });

    if(localStorage.getItem("lang")){
        $(".btn-"+localStorage.getItem("lang")).click();
    }else{
        $(".btn-en").click();
    }

    $(this).on("click mousemove mousedown keypress touchstart", resetTimer);

    prepareGotoButtons();
    registerScenes();

    $(window).on("hashchange", hashChangedListener);
    hashChangedListener();

    $('.selectpicker').selectpicker({
           iconBase: 'fa',
            tickIcon: 'fa-check',
    });

    $(".checkAns").click(checkAns);

});

function prepareGotoButtons(){
    $(".btn").click(function(){
        if(this.dataset.goto){
            goTo(this.dataset.goto);
        }
    });
}


function goTo(nextScene){
    window.location.hash = nextScene;
}

function hashChangedListener() { 
    var nextScene = parseInt(window.location.hash.substring(1));

    if(isNaN(nextScene) || nextScene<=0) return;

    $(".scene").fadeOut(200);
    var nextSceneobj = $(".scene"+nextScene).fadeIn(500);

    if (typeof scenes[nextScene] === "function") { 
    setTimeout(scenes[nextScene], 500);
    }
}

function resetTimer() {
    if(inactivityTimer)   clearTimeout(inactivityTimer);
    //console.log("Activity");
    if(trackActivity){
        inactivityTimer = setTimeout(inactivity, 1000*60*3);
    }
}

function inactivity(){
    scheduleNextScene(function(){
        window.location.hash = "1";
        window.location.reload(); 
    },100);  
}


function registerScenes(){
    scenes[2] = scene2;
    scenes[3] = scene3;
    scenes[4] = scene4;
    scenes[5] = scene5;
    scenes[6] = scene6;
    scenes[7] = scene7;
}

function scene2(){
    console.log('Scene 2');
    var scene = $(".scene2");
    scene.removeClass('go go2');
    scene.addClass('go');
    animateScene(scene);

    setTimeout(function(){
        scene.addClass('go2');
    }, 4000);

    scheduleNextScene(function(){
        goTo(3);

    }, 5500);

    //Ponastavi drugi poskus
    drugiPoskus = false;


}

function scene3(){
    console.log('Scene 3');
    var scene = $(".scene3");
    $(".scene2").removeClass('go go2');
    scene.removeClass('go go2');
    scene.addClass('go');
    animateScene(scene);

    var graf = senzorGraf(document.getElementById("senzorCanvas"));
    graf.initSample();
    // Start animation
    animate(200);
    // drawLines(200, ctx2);

    document.addEventListener("firstEnergyDone",function(){
        setTimeout(graf.hit1, 1);
    })

    document.addEventListener("secondEnergyDone",function(){
        setTimeout(graf.hit2, 1);
    })

    document.addEventListener('secondEnergyDone', function(){
        scheduleNextScene(function(){
            goTo(4);
            scene.removeClass('go');
        }, 3000);
    })
}

function scene4(){
    //Graphs

    console.log('Scene 4');
    var scene = $(".scene4");
    scene.removeClass('go go2');
    scene.addClass('go');
    animateScene(scene);

    scheduleNextScene(function(){
        goTo(5);
        scene.removeClass('go');
    }, 10000)

}
function scene5(){
    //Graphs
    console.log('Scene 5');
    var scene = $(".scene5");
    scene.removeClass('go go2');
    scene.addClass('go');
    animateScene(scene);

    scheduleNextScene(function(){
        goTo(6);
        scene.removeClass('go');
    }, 3000)

}
function scene6(){
    //Graphs
    console.log('Scene 6');
    var scene = $(".scene6");
    scene.removeClass('go go2');
    scene.addClass('go');
    animateScene(scene);
    $('input:checkbox').prop('checked', false);
    $('table tr').removeClass("selected wrong correct");


    var graf = senzorGraf(document.getElementById("senzorCanvasTest"));
    graf.initTest();

    if (!drugiPoskus) {
        scene.find("table tr").click(function(){
            var row = $(this);
            var ok_ans = $(".checkAns").data('ans').split(',');
            var selected_element = row.find("input")[0];
            if (row.hasClass("correct") || row.hasClass("wrong")){
                row.removeClass("wrong correct");
            } else {
                if($.inArray(selected_element.value, ok_ans) > -1){
                    $(this).addClass("correct");
                } else {
                    $(this).addClass("wrong");
                }
            }
            var cls =  'selected';
            row.toggleClass(cls);
            var checkBoxes = row.find("input[type=checkbox]");
            checkBoxes.prop("checked", row.hasClass(cls));
        });
    }
    trackActivity = true;
}
function scene7(){
    //Graphs
    console.log('Scene 7');
    var scene = $(".scene7");
    scene.removeClass('go go2');
    scene.addClass('go');
    animateScene(scene);

    var retryBtn = scene.find("a.retry");

    if(drugiPoskus){
        retryBtn.hide(0);
    }else{
        retryBtn.show(0);
    }

    retryBtn.click(function(){
        drugiPoskus = true;
    });
}

function checkAns(e){
    var parent = $(this).parent();

    var selected = parent.find("[name=element]:checked");

    var answers = [];
    selected.each(function(){answers.push(this.value)});

    var ok_ans = $(this).data('ans').split(',');

    var ok = ok_ans.length === answers.length;

    console.log("CHECK ASN:", ok_ans, answers)

    $.each(ok_ans, function(i, el){
        if(0>$.inArray(el, answers)){
            ok = false;
        }
        console.log("not same:",ok, el, answers);
    });
    //
    console.log(ok);
    var html = $("html");
    html.removeClass("ans_ok ans_nok");
    if(ok){
        html.addClass("ans_ok");
    }else{
        html.addClass("ans_nok");
    }

    scheduleNextScene(function(){
        goTo(7);
    },1)
}

function scheduleNextScene(fun, time){
    if(nextSceneTimer){ 
        clearTimeout(nextSceneTimer);
    }

    console.log("Next scene", time);
    nextSceneTimer = setTimeout(fun, time);
}

function animateScene(scene){
    var items = scene.find(".inout");

    items.each(function(){
        var item = $(this);
        var inMs = parseInt(item.data("in"));
        var outMs = parseInt(item.data("out"));

        // console.log("Animate: ",item,  inMs, outMs);

        if(inMs){
            item.hide(0);
            setTimeout(function(){item.delay(200).fadeIn(400)},inMs);
        }
        if(outMs){
            setTimeout(function(){item.fadeOut(200)},outMs);
        }

        var inEvent = item.data('inevent');
        var outEvent = item.data('outevent');

        if(inEvent){
            $(document).one(inEvent, function(){
                item.delay(200).fadeIn(500);
            });
        }
        if(outEvent){
            $(document).one(outEvent, function(){
                item.fadeOut(200);
            });
        }

    });
}
