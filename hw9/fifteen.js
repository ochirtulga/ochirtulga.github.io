$(document).ready(function () {
    // var puzzleArea = $("puzzlearea");
    // var divs = $("#puzzlearea > div");
    var empty = (function () {
        let x = 300;
        let y = 300;
        let changePosition = function (a, b) {
            x = a;
            y = b;
        };
        let getX = () => {
            return x;
        }
        let getY = () => {
            return y;
        }
        return {
            changePosition: changePosition,
            getX: getX,
            getY: getY
        }
    })();

    const divs = "#puzzlearea > div";

    $(divs).each(function (idx, e) {
        var x = ((idx % 4) * 100);
        var y = (Math.floor(idx / 4) * 100);
        $(e).addClass("puzzlepiece")
            .css("left", x + 'px')
            .css("top", y + 'px')
            .css("backgroundImage", "url('../images/hw9/background.jpeg')")
            .css("backgroundPosition", -x + 'px ' + (-y) + 'px');
    });

    $(divs).hover(
        function () {
            if (checkMovable(this) == true) {
                $(this).addClass("movablepiece");
            } else {
                return false;
            }
        },
        function () {
            $(this).removeClass("movablepiece");
        }
    );

    $(divs).click(function () {
        if (checkMovable(this) == true) {
            let currX = parseInt($(this).css("left"));
            let currY = parseInt($(this).css("top"));
            $(this).css("left", empty.getX() + 'px ')
                .css("top", empty.getY() + 'px');
            empty.changePosition(currX, currY);
        } else {
            return false;
        }
    });

    function checkMovable(piece) {
        let currX = parseInt($(piece).css("left"));
        let currY = parseInt($(piece).css("top"));
        // console.log("Empty: " + empty.getX() + " | " + empty.getY());
        // console.log("Current: " + currX + " | " + currY);
        // console.log("X :" + Math.abs(Math.abs(empty.getX() - currX)));
        // console.log("Y :" + Math.abs(Math.abs(empty.getY() - currY)));
        // console.log("SUM :" + (Math.abs(Math.abs(empty.getX() - currX)) + Math.abs(Math.abs(empty.getY() - currY))));
        if (Math.abs((Math.abs(empty.getX() - currX)) + Math.abs(Math.abs(empty.getY() - currY))) == 100) {
            return true;
        } else {
            return false
        };
    }

    $("#shufflebutton").click(function () {
        randomShuffle();
    });

    // 16 element tei function iig function
    function randomShuffle() {
        var pieces = randomGenerate();
        let i = 0;
        let c;
        $(divs).each(function (idx, e) {
            if (i == 0) {
                c = i;
                i += 1;
            }
            let x = ((pieces[i] % 4) * 100);
            let y = (Math.floor(pieces[i] / 4) * 100);
            $(e).css("left", x + 'px')
                .css("top", y + 'px')
            i++;
        });
        empty.changePosition((pieces[c] % 4) * 100, (Math.floor(pieces[c] / 4) * 100));
    }

    function randomGenerate() {
        var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var result = [];
        for (let i = 1; i < nums.size() + 1; i++) {
            const random = parseInt(Math.random() * (nums.size() - i));
            result.push(nums[random]);
            nums[random] = nums[nums.size() - i];
        }
        return result;
    }


    // initialize each piece
    // for (var i=0; i< divs.length; i++) {
    //     var div = divs[i];

    //     // calculate x and y for this piece
    //     var x = ((i % 4) * 100) ;
    //     var y = (Math.floor(i / 4) * 100) ;

    //     // set basic style and background
    //     div.className = "puzzlepiece";
    //     div.style.left = x + 'px';
    //     div.style.top = y + 'px';
    //     div.style.backgroundImage = 'url("../images/hw9/background.jpeg")';
    //     div.style.backgroundPosition = -x + 'px ' + (-y) + 'px';

    //     // store x and y for later
    //     div.x = x;
    //     div.y = y; 
    // }  

});