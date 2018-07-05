;( function() {

    'use strict';

    var bodyEl = document.body,
        videoWrap = document.querySelector('.video-wrap'),
        videoEl = videoWrap.querySelector('video'),
        playCtrl = document.querySelector('.action__opentrailer'),
        closeCtrl = document.querySelector('.action--close');

    function init() {
        initEvents();
    }

    function initEvents() {
        playCtrl.addEventListener('click', play);
        closeCtrl.addEventListener('click', hide);
        videoEl.addEventListener('canplaythrough', allowPlay);
        videoEl.addEventListener('ended', hide);
    }

    function allowPlay() {
        bodyEl.classList.add('video-loaded');
    }

    function play() {
        videoEl.currentTime = 0;
        videoWrap.classList.remove('video-wrap--hide');
        videoWrap.classList.add('video-wrap--show');
        setTimeout(function() {videoEl.play();}, 600);
    }

    function hide() {
        videoWrap.classList.remove('video-wrap--show');
        videoWrap.classList.add('video-wrap--hide');
        videoEl.pause();
    }

    init();

})();