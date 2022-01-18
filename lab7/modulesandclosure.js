/*jshint esversion: 6 */

(function () {
    'use strict';
}());

window.onload = () => {

    var createBtn = document.getElementById("createNew");
    const accountInfoList = [];

    function createAccount() {
        var creatingNewAccount = function () {
            let accountName = document.getElementById("accName").value;
            let balance = document.getElementById("deposit").value;
            accountInfoList.push(new Account(accountName, balance));
            return accountInfoList.slice(-1);
        };
        return creatingNewAccount();
    }

    class Account {
        constructor(accountName, balance) {
            this.accountName = accountName;
            this.balance = balance;
        }
    }

    createBtn.onclick = () => {
        createAccount();
        console.log(accountInfoList);
        updateTextArea();
    };

    function updateTextArea() {
        document.getElementById("textArea").value += "Account Name:  " + accountInfoList[accountInfoList.length - 1].accountName + " Balance:  " + accountInfoList[accountInfoList.length - 1].balance + "\n";
    }
};