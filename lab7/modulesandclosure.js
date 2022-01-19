/*jshint esversion: 6 */

(function () {
    'use strict';
}());

window.onload = () => {

    //Task#1
    var rudyBtn = document.getElementById("rudy");
    var para = document.getElementById("rudii");

    var timer = null;

    rudyBtn.onclick = () => varrudyTimer.rudyTimer();

    var varrudyTimer = {
        rudyTimer : function() {
            if (timer == null) {
                timer = setInterval(function () {
                    para.innerHTML += "Rudy!";
                }, 1000);
            } else {
                clearInterval(timer);
                timer = null;
            }
        }
    }

    //Task#2
    var createBtn = document.getElementById("createNew");
    const accountInfoList = [];

    var accountFactory = {
        createAccount: function () {
            let accountName = document.getElementById("accName").value;
            let balance = document.getElementById("deposit").value;
            accountInfoList.push(new Account(accountName, balance));
            return accountInfoList.slice(-1);
        }
    };

    class Account {
        constructor(accountName, balance) {
            this.accountName = accountName;
            this.balance = balance;
        }
    }

    createBtn.onclick = () => {
        accountFactory.createAccount();
        // console.log(accountInfoList);
        updateTextArea();
    };

    function updateTextArea() {
        document.getElementById("textArea").value += "Account Name:  " + accountInfoList[accountInfoList.length - 1].accountName + " Balance:  " + accountInfoList[accountInfoList.length - 1].balance + "\n";
    }
};