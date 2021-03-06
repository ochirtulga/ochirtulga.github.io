"use strict";
window.onload = function() {

    var timer = null;
    var btn = document.getElementById("btn");
    var textArea = document.getElementById("textarea");
    var checkBox = document.getElementById("checkbox");
    var pigLatin = document.getElementById("pigLatin");
    var malkovitch = document.getElementById("malkovitch");

    btn.onclick = function() {
        let hasText = textArea.value;
        if(hasText) {
            if(timer == null) {
                timer = setInterval(biggerFont,500);
            } else {
                clearInterval(timer);
                timer = null;
            }
        } else {
            alert("Please add some text..");
        }
    };
    
    function biggerFont() { 
        var currentSize = parseInt(window.getComputedStyle(textArea,null).getPropertyValue('font-size'));
        currentSize += 2;
        textArea.style.fontSize = currentSize + "px";
    };

    checkBox.onchange = function() {
        let hasText = textArea.value;
        if(hasText) {   
            if(checkBox.checked) {
                textArea.style.fontWeight = "bold";    
                textArea.style.color = "green";
                textArea.style.textDecoration = "underline";
                document.body.style.backgroundImage = "url('../images/lab6/hundred-dollar-bill.jpeg')";
            } else {
                textArea.style.fontWeight = "normal";
                textArea.style.color = "black";
                textArea.style.textDecoration = "none";
                document.body.style.backgroundImage = "none";
            } 
        } else {
            checkBox.checked = false;
            alert("Please add some text..");
        }         
    }

    pigLatin.onclick = function () { 
        let context = textArea.value;
        if(context) {
            let words = context.split(" ");
            for(let i = 0; i < words.length; i++) {
                let f = words[i].charAt(0);
                if (f != 'a' && f != 'e' && f != 'i' && f != 'o' && f != 'u') {
                    words[i] = words[i].substr(1,words[i].length) + f + "ay";
                }
            }
            context = words.join(" ");
            textArea.value = context;
        } else {
            alert("Please add some text..");
        }
    }

    malkovitch.onclick = function() {
        let context = textArea.value;
        if(context) {
            let words = context.split(" ");
            for(let i = 0; i < words.length; i++) {
                if (words[i].length >= 5) {
                    words[i] = "Malkovitch";
                }
            }
            context = words.join(" ");
            textArea.value = context;
        } else {
            alert("Please add some text..");
        }
    }

};
