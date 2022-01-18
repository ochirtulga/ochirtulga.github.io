"use strict";

window.onload = () => {

    var createBtn = document.getElementById("createNew");

    var accountFactory = (accountName, balance) => {
        return new Account(accountName, balance);;
    }

    class Account {
        constructor(accountName, balance) {
            this.accountName = accountName;
            this.balance = balance;
        }
    }

    createBtn.onclick = () => {

        const accountName = document.getElementById("accName");
        const balance = document.getElementById("deposit");
        var account = accountFactory(accountName.value, balance.value);

        updateTextArea(account);
    }

    function updateTextArea(account) {
        if (document.getElementById("textArea").value.length == 0) {
            document.getElementById("textArea").value = document.getElementById("textArea").value +
                "Account Name:  " + account.accountName + " Balance:  " + account.balance;
        } else {
            document.getElementById("textArea").value = document.getElementById("textArea").value +
                "\n" +
                "Account Name:  " + account.accountName + " Balance:  " + account.balance;
        }
    }
}