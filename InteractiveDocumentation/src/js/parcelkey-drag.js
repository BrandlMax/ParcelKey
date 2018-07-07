
    const $parcelKey = document.querySelector('.parcelkey-front');
    const $dragLeft = document.querySelector('.parcelkey-front .pull-left');
    const $dragRight = document.querySelector('.parcelkey-front .pull-right');
    const $count = document.querySelector('.parcelkey-front .count');
    const $ihreZeitBoxSliderJS = document.getElementById('ihreZeitBoxSlider')
    const $ihreZeitBoxOnlyShadowJS = document.getElementById('ihreZeitBoxOnlyShadow')
    
    const $ihreZeitBoxJS = document.getElementById('ihreZeitBoxOnly')
    const $ihreZeitBox = $('#ihreZeitBoxOnly');
    const $ihreZeitBoxForGlow = $('#ihreZeitBox');
    const $ihreZeitBoxSlider = $('#ihreZeitBoxSlider');
    const $ihreZeitBoxNum = $ihreZeitBox.find('.num');
    const $ihreZeitBoxSub = $ihreZeitBox.find('.subtext');

    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = parseInt(date.getMinutes().toString()[0]+'0');
    var hours = parseInt(date.getHours().toString());

    // var positions = {
    //     left: 0,
    //     right: 0,
    // };

    // var dragging = {
    //     left: false,
    //     right: false,
    // };

    // var interval;

    // const handleLeftPull = function() {
    //     $parcelKey.classList.add('rotate-left');
    //     $parcelKey.classList.remove('rotate-right');
    //     var number = parseInt($count.getAttribute('data-count'), 10);
    //     number -= 1;

    //     if (number <= 0) {
    //         number = 0;
    //     }

    //     $count.setAttribute('data-count', number);
    //     $count.textContent = number + 'm';
    // };

    // const handleRightPull = function() {
    //     $parcelKey.classList.add('rotate-right');
    //     $parcelKey.classList.remove('rotate-left');
    //     var number = parseInt($count.getAttribute('data-count'), 10);
    //     number += 1;
    //     $count.setAttribute('data-count', number);
    //     $count.textContent = number + 'm';
    // };

    // const startDragInterval = function() {
    //     if (!interval) {
    //         if (dragging.left === true) {
    //             interval = setInterval(handleLeftPull, 500);
    //         } else if(dragging.right === true) {
    //             interval = setInterval(handleRightPull, 500);
    //         }
    //     }
    // };

    // const stopDragInterval = function() {
    //     if (interval) {
    //         clearInterval(interval);
    //         interval = undefined;
    //     }
    // }

    // // const dragStartLeft = function(event) {
    // //     event.dataTransfer.setDragImage(img, 0, 0);
    // // };

    // // const dragStartRight = function(event) {
    // //     event.dataTransfer.setDragImage(img, 0, 0);
    // // };

    // const dragLeft = function(event) {
    //     if (!positions.left) {
    //         positions.left = event.screenY;
    //     } else if (event.screenY > positions.left) {
    //         dragging.left = true;
    //         startDragInterval();
    //     }
    // };

    // const dragRight = function(event) {
    //     if (!positions.right) {
    //         positions.right = event.screenY;
    //     } else if (event.screenY > positions.right) {
    //         dragging.right = true;
    //         startDragInterval();
    //     }
    // };

    // const dragEndLeft = function(event) {
    //     dragging.left = false;
    //     positions.left = 0;
    //     stopDragInterval();
    //     $parcelKey.classList.remove('rotate-left');
    // };

    // const dragEndRight = function(event) {
    //     dragging.right = false;
    //     positions.right = 0;
    //     stopDragInterval();
    //     $parcelKey.classList.remove('rotate-right');
    // };

    let interval;
    let ktime = {
        h: hours,
        m: minutes
    };
    let clock;

    const minFix = function(m){
        if(m < 10){
            return '0' + m
        }else{
            return m
        }
    }

    clock = ktime.h + ':' + minFix(ktime.m)
    // console.log('Clock', clock)
    $ihreZeitBoxNum.html(clock)

    const startDragInterval = function(dir) {
        if(!interval){
            if(dir == 'left'){
                interval = setInterval(() => {

                    ktime.m -= 10;
                    if(ktime.m < 0){
                        ktime.m = 50;
                        ktime.h -= 1;
                    }

                    if(ktime.h == 24){
                        ktime.h = 0;
                    }

                    if(ktime.h < 0){
                        ktime.h = 23;
                    }
    
                    clock = ktime.h + ':' + minFix(ktime.m)
                    // console.log('Clock', clock)
                    $ihreZeitBoxNum.html(clock)

                    console.log([ktime.h, hours, minutes])
                    console.log(ktime.h < hours)

                    if(ktime.h < hours || ktime.h > 21){
                        $ihreZeitBoxForGlow.removeClass('glowStatic');
                        $ihreZeitBoxForGlow.addClass('glowStaticRed');
                    }else{
                        $ihreZeitBoxForGlow.removeClass('glowStaticRed');
                        $ihreZeitBoxForGlow.addClass('glowStatic');
                    }

                }, 500);
            }

            if(dir == 'right'){
                interval = setInterval(() => {
                    ktime.m += 10;
                    if(ktime.m == 60){
                        ktime.m = 0;
                        ktime.h += 1;
                    }
                    
                    if(ktime.h == 24){
                        ktime.h = 0;
                    }

                    if(ktime.h < 0){
                        ktime.h = 23;
                    }

                    clock = ktime.h + ':' + minFix(ktime.m)
                    // console.log('Clock', clock)
                    $ihreZeitBoxNum.html(clock)

                    if(ktime.h < hours || ktime.h > 21){
                        $ihreZeitBoxForGlow.removeClass('glowStatic');
                        $ihreZeitBoxForGlow.addClass('glowStaticRed');
                    }else{
                        $ihreZeitBoxForGlow.removeClass('glowStaticRed');
                        $ihreZeitBoxForGlow.addClass('glowStatic');
                    }
                }, 500);
            }
        }
    };

    const stopDragInterval = function() {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    }

    const rotateKey = function(event) {
        $ihreZeitBoxJS.style.transform = 'rotateZ('+event.target.value+'deg) translateY(-50px)';
        $ihreZeitBoxOnlyShadowJS.style.transform = 'rotateZ('+event.target.value+'deg) translateY(-50px)';
        if(event.target.value < -15){
            // left
            startDragInterval('left'); 
        }else if(event.target.value > 15){
            // right
            startDragInterval('right'); 
        }else{
            // neutral
            stopDragInterval();
            // $ihreZeitBoxForGlow.removeClass('glowStaticRed');
            // $ihreZeitBoxForGlow.removeClass('glowStatic');
        }

    };

    // $dragLeft.addEventListener('dragstart', dragStartLeft);
    // $dragRight.addEventListener('dragstart', dragStartRight);
    // $dragLeft.addEventListener('drag', dragLeft);
    // $dragRight.addEventListener('drag', dragRight);
    // $dragLeft.addEventListener('dragend', dragEndLeft);
    // $dragRight.addEventListener('dragend', dragEndRight);
    $ihreZeitBoxSliderJS.addEventListener('input', rotateKey);
