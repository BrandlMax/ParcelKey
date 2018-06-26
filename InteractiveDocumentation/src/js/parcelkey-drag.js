(function() {
    const $parcelKey = document.querySelector('.parcelkey-front');
    const $dragLeft = document.querySelector('.parcelkey-front .pull-left');
    const $dragRight = document.querySelector('.parcelkey-front .pull-right');
    const $count = document.querySelector('.parcelkey-front .count');

    var positions = {
        left: 0,
        right: 0,
    };

    var dragging = {
        left: false,
        right: false,
    };

    var interval;
    var img = document.createElement("img");
    img.src = "http://kryogenix.org/images/hackergotchi-simpler.png";

    const handleLeftPull = function() {
        $parcelKey.classList.add('rotate-left');
        $parcelKey.classList.remove('rotate-right');
        var number = parseInt($count.getAttribute('data-count'), 10);
        number -= 1;

        if (number <= 0) {
            number = 0;
        }

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
        if (!interval) {
            if (dragging.left === true) {
                interval = setInterval(handleLeftPull, 500);
            } else if(dragging.right === true) {
                interval = setInterval(handleRightPull, 500);
            }
        }
    };

    const stopDragInterval = function() {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    }

    const dragStartLeft = function(event) {
        event.dataTransfer.setDragImage(img, 0, 0);
    };

    const dragStartRight = function(event) {
        event.dataTransfer.setDragImage(img, 0, 0);
    };

    const dragLeft = function(event) {
        if (!positions.left) {
            positions.left = event.screenY;
        } else if (event.screenY > positions.left) {
            dragging.left = true;
            startDragInterval();
        }
    };

    const dragRight = function(event) {
        if (!positions.right) {
            positions.right = event.screenY;
        } else if (event.screenY > positions.right) {
            dragging.right = true;
            startDragInterval();
        }
    };

    const dragEndLeft = function(event) {
        dragging.left = false;
        positions.left = 0;
        stopDragInterval();
        $parcelKey.classList.remove('rotate-left');
    };

    const dragEndRight = function(event) {
        dragging.right = false;
        positions.right = 0;
        stopDragInterval();
        $parcelKey.classList.remove('rotate-right');
    };

    $dragLeft.addEventListener('dragstart', dragStartLeft);
    $dragRight.addEventListener('dragstart', dragStartRight);
    $dragLeft.addEventListener('drag', dragLeft);
    $dragRight.addEventListener('drag', dragRight);
    $dragLeft.addEventListener('dragend', dragEndLeft);
    $dragRight.addEventListener('dragend', dragEndRight);
})();