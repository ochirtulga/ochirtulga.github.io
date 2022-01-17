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
    }

    pigLatin.onclick = function () { 
        let context = textArea.value;
        let words = context.split(" ");
        for(let i = 0; i < words.length; i++) {
            let f = words[i].charAt(0);
            if (f != 'a' && f != 'e' && f != 'i' && f != 'o' && f != 'u') {
                words[i] = words[i].substr(1,words[i].length) + f + "ay";
            }
        }
        context = words.join(" ");
        textArea.value = context;
    }

    malkovitch.onclick = function() {
        let context = textArea.value;
        let words = context.split(" ");
        for(let i = 0; i < words.length; i++) {
            if (words[i].length >= 5) {
                words[i] = "Malkovitch";
            }
        }
        context = words.join(" ");
        textArea.value = context;
    }



    // var ok = document.getElementById("ok");
    // ok.onclick = function() {
    //     setTimeout(booyah(), 2000);
    //     // setTimeout(booyah, 2000);
    // }

    // function booyah() {
    //     alert("BOOYAH!");
    // }
};


// var myfunc = function(a, x) {  
//         return a * x;    
//     };  
    
// var x = myfunc(2, 3);  
// var y = myfunc;  
// alert(x);  
// alert(y(2,3)); 

// setTimeout(booyah1, 2000);  
// setTimeout(booyah2(), 2000); 


// function booyah1() { 
// 	alert("BOOYAH!"); 
// } 

// function booyah2() { 
// 	setTimeout(booyah1, 2000); 
// } 