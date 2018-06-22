(function() {
    const $parcelKey = document.querySelector('.parcelkey-front');
    const $dragLeft = document.querySelector('.parcelkey-front .pull-left');
    const $dragRight = document.querySelector('.parcelkey-front .pull-right');
    const $count = document.querySelector('.parcelkey-front .count');

    var positions = {
        start: {
            left: 0,
            right: 0,
        },
        end: {
            left: 0,
            right: 0,
        },
    };

    var dragging = {
        left: false,
        right: false,
    };

    var interval;

    const handleLeftPull = function() {
        $parcelKey.classList.add('rotate-left');
        $parcelKey.classList.remove('rotate-right');
        var number = parseInt($count.getAttribute('data-count'), 10);
        number -= 1;
        $count.setAttribute('data-count', number);
        $count.textContent = number + 'm';
    };

    const handleRightPull = function() {
        $parcelKey.classList.add('rotate-right');
        $parcelKey.classList.remove('rotate-left');
        var number = parseInt($count.getAttribute('data-count'), 10);
        number += 1;
        $count.setAttribute('data-count', number);
        $count.textContent = number + 'm';
    };

    const startDragInterval = function() {
        if (dragging.left === true) {
            interval = setInterval(handleLeftPull, 500);
        } else if(dragging.right === true) {
            interval = setInterval(handleRightPull, 500);
        }
    };

    const stopDragInterval = function() {
        if (interval) {
            clearInterval(interval);
        }
    }

    const dragStartLeft = function(event) {
        positions.start.left = event.screenY;
        dragging.left = true;
        startDragInterval();
    };

    const dragStartRight = function(event) {
        var img = document.createElement("img");
        img.src = "http://kryogenix.org/images/hackergotchi-simpler.png";
        event.dataTransfer.setDragImage(img, 0, 0);
        positions.start.right = event.screenY;
        dragging.right = true;
        startDragInterval();
    };

    const dragEndLeft = function(event) {
        positions.end.left = event.screenY;
        dragging.left = false;
        stopDragInterval();
        $parcelKey.classList.remove('rotate-left');
    };

    const dragEndRight = function(event) {
        positions.end.right = event.screenY;
        dragging.right = false;
        stopDragInterval();
        $parcelKey.classList.remove('rotate-right');
    };

    $dragLeft.addEventListener('dragstart', dragStartLeft);
    $dragRight.addEventListener('dragstart', dragStartRight);
    $dragLeft.addEventListener('dragend', dragEndLeft);
    $dragRight.addEventListener('dragend', dragEndRight);
})();