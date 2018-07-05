// ############# Ihr Paketstatus
// howLongBox: Check Status
const $howLongBox = $('#howLongBox');
const $howLongBoxNum = $howLongBox.find('.num');
const $howLongBoxSub = $howLongBox.find('.subtext');

$howLongBox.click(() => {

    $howLongBox.addClass('glow');

    setTimeout(function() {
        $howLongBox.removeClass('glow');
    }, 2500);

    console.log('TEST')

})



// ############# Ihre Erinnerung
// Erinnerungsbox
const $erinnerungsBox = $('#erinnerungBox');
const $erinnerungsBoxNum = $erinnerungsBox.find('.num');
const $erinnerungsBoxSub = $erinnerungsBox.find('.subtext');
const erinnerungsBoxData = {
    nums: JSON.parse($erinnerungsBox.attr('data-nums')),
    subs: JSON.parse($erinnerungsBox.attr('data-subs').replace(/'/g, '"')),
};
let erinnerungsBoxInterval = null;

const isInViewPort = function(element) {
    if (!element) {
        return false;
    }

    if (!element.getBoundingClientRect) {
        element = element.get(0);
    }

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const startErinnerungsBox = function() {
    $erinnerungsBox.addClass('glow');

    setTimeout(function() {
        $erinnerungsBox.removeClass('glow');
    }, 2500);

    const currentIndex = erinnerungsBoxData.nums.indexOf(parseInt($erinnerungsBoxNum.html(), 10));

    if (currentIndex === -1) {
        $erinnerungsBoxNum.html(erinnerungsBoxData.nums[0]);
        $erinnerungsBoxSub.html(erinnerungsBoxData.subs[0]);
    } else {
        const nextIndex = currentIndex === erinnerungsBoxData.nums.length - 1
            ? 0
            : currentIndex + 1;

        $erinnerungsBoxNum.html(erinnerungsBoxData.nums[nextIndex]);
        $erinnerungsBoxSub.html(erinnerungsBoxData.subs[nextIndex]);
    }

    if (!erinnerungsBoxInterval) {
        erinnerungsBoxInterval = setInterval(startErinnerungsBox, 3500);
    }
};

$(window).on('scroll', function() {
    if (isInViewPort($erinnerungsBox) && !erinnerungsBoxInterval) {
        startErinnerungsBox();
    }
});

/*
let howLongBox = document.getElementById('howLongBox');
let howLongBoxNum = document.getElementById('howLongBoxNum');
let howLongBoxSub = document.getElementById('howLongBoxSub');

var timerId = 0;
var startTime = 60;
$("#erinnerungBoxNum").html(startTime);

function erinnerungBoxon(){

}

function erinnerungBoxoff(){

}

$('#erinnerungBox').click(() => {

    if(timerId == 0){
        timerId = window.setInterval(function() {

            startTime = startTime - 10;
            
            $("#erinnerungBoxNum").html(startTime);

            if(startTime <= 0){
                startTime = 1;
                $("#erinnerungBoxNum").html(startTime);
                $("#erinnerungBoxSub").html("Minute");
                clearTimeout(timerId);
            }
        }, 1000);
    }

})
*/

// ############# Ihre Zeit

// ############# Ihr Ort
let selectedTarget;

$("input[type='radio']").click(function(){
    selectedTarget = $('input[name=target]:checked').val();
    console.log(selectedTarget);

    if(selectedTarget == "home"){
        $('#targetIcon').fadeOut(100, function() {
            $('#targetIcon').attr('src','./src/img/homewhite.svg')
        }).fadeIn(1000);
    }else if(selectedTarget == "work"){
        $('#targetIcon').fadeOut(100, function() {
            $('#targetIcon').attr('src','./src/img/arbeitwhite.svg')
        }).fadeIn(1000);
    }else{
        // Uni
        $('#targetIcon').fadeOut(100, function() {
            $('#targetIcon').attr('src','./src/img/uniwhite.svg')
        }).fadeIn(1000);
    }
})

window.isInViewPort = isInViewPort;