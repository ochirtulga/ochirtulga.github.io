/*jshint esversion: 6 */
$(document).ready(function () {

    var flag = (function () {
        let flag = false;
        let started = false;

        let changeFlag = () => flag = true;
        let resetFlag = () => flag = false;
        let getFlag = () => {
            return flag;
        };

        let changeStarted = () => started = true;
        let resetStarted = () => started = false;
        let getStarted = () => {
            return started;
        };
        return {
            changeFlag: changeFlag,
            resetFlag: resetFlag,
            getFlag: getFlag,
            changeStarted: changeStarted,
            resetStarted: resetStarted,
            getStarted: getStarted
        };
    })();

    $("#maze div.boundary").mouseover(function () {
        if (flag.getStarted() == true) {
            lost();
        }
    });

    $("#start").click(function () {
        $("#maze div.boundary").removeClass("youlose");
        flag.changeStarted();
        $("#status").text("Mouse maze has begun!");
    });

    $("#end").mouseover(function () {
        if (flag.getFlag() == true) {
            lost();
        } else {
            won();
        }
    });

    $("#maze").mouseleave(function () {
        if (flag.getStarted() == true) {
            lost();
        }
    });

    function lost() {
        $("#maze div.boundary").addClass("youlose");
        $("#status").text("You lose! -> Click the \"S\" to begin.");
        flag.changeFlag();
    }

    function won() {
        $("#status").text("You win! -> -> Click the \"S\" to play again.");
    }
});