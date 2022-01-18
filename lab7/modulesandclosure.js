"use strict";

window.onload = () => { 
    
    var createBtn = document.getElementById("createNew");

    var createAccount = function () { 
        var account;
        var accountName = document.getElementById("accName");
        var balance = document.getElementById("deposit");
        account = new Account(accountName.value, balance.value);
        return account;
    }

    class Account {
        constructor(accountName, balance) {
            this.accountName = accountName;
            this.balance = balance;
        }
    }

    createBtn.onclick = () => { 
        var account = (createAccount());
        console.log(account);
        updateTextArea(account);
    }

    function updateTextArea(account) {
        if(document.getElementById("textArea").value.length == 0) {
            document.getElementById("textArea").value = document.getElementById("textArea").value 
            + "Account Name:  " + account.accountName + " Balance:  " + account.balance;
        } else {
            document.getElementById("textArea").value = document.getElementById("textArea").value 
            + "\n" 
            + "Account Name:  " + account.accountName + " Balance:  " + account.balance;
        }
    }
}

