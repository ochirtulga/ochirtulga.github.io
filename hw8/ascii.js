"use strict";

window.onload = function () {
    var textArea = document.getElementById("textArea");
    var startBtn = document.getElementById("start");
    var stopBtn = document.getElementById("stop");
    var animationOpt = document.getElementById("animation");
    var sizeOpt = document.getElementById("size");
    var speed = document.getElementById("speed");

    var timer = null;
    var interval = 250;
    var choosen;
    var selectedIndex;
    var firstFigure;
    var currentFrame = 0;
    var splited;

    startBtn.onclick = () => {
        choosen = getAnimation();
        selectedIndex = animationOpt.selectedIndex;
        if (timer == null) {
            changeAnimation(interval);
        }
    }

    stopBtn.onclick = () => {
        clearInterval(timer);
        timer = null;
        textArea.value = firstFigure;
    }

    animationOpt.onchange = () => {
        if (timer) {
            alert("Stop existing animation before changing to a new one.");
            animationOpt.options[selectedIndex].selected = true;
        } else {
            choosen = getAnimation();
            textArea.value = choosen;
            currentFrame = 0;
        }
    }

    sizeOpt.onchange = () => {
        let size = sizeOpt.value;
        textArea.style.fontSize = size;
    }

    speed.onchange = () => {
        if (speed.checked) {
            interval = 50;
            clearInterval(timer);
            changeAnimation(interval);
        } else if (timer == null || speed.checked == false) {
            interval = 250;
            clearInterval(timer);
            changeAnimation(interval);
        }
    }

    function changeAnimation(interval) {
        splited = choosen.split("=====\n");
        firstFigure = splited[0];
        timer = setInterval(displayFrames, interval);
    }

    function displayFrames() {
        textArea.value = splited[currentFrame];
        console.log(splited[currentFrame]);
        currentFrame++;
        if (currentFrame == splited.length) currentFrame = 0;
    }

    function getAnimation() {
        let animation = animationOpt.value;
        if (animation != "Blank" && animation != "Custom") {
            return ANIMATIONS[animation];
        } else {
            alert("Choose other animations than Blank or Custom.");
        }
    }
}