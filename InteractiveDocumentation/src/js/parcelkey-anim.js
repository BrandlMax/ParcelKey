// ############# Ihr Paketstatus
// howLongBox: Check Status
$('#erinnerungBox').click(() => {
    console.log('Erinnerungsbox')
})



// ############# Ihre Erinnerung
// Erinnerungsbox Hover to Countdown
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


// ############# Ihre Zeit

// ############# Ihr Ort
