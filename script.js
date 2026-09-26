const incomeForm = document.getElementById("incomeForm");
const expenseForm = document.getElementById("expenseForm");
const transactionTable = document.getElementById("transactionTable");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


let editingIndex = null;
let editingType = null;



function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}



function displayTransactions() {

    transactionTable.innerHTML = "";

    transactions.forEach(function(transaction, index) {

        const row = document.createElement("tr");

        const typeCell = document.createElement("td");
        const amountCell = document.createElement("td");
        const categoryCell = document.createElement("td");
        const dateCell = document.createElement("td");
        const descriptionCell = document.createElement("td");
        const actionCell = document.createElement("td");

        typeCell.textContent = transaction.type;
        amountCell.textContent = transaction.amount;
        categoryCell.textContent = transaction.category;
        dateCell.textContent = transaction.date;
        descriptionCell.textContent = transaction.description;



        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";

        editButton.addEventListener("click", function() {

            editingIndex = index;
            editingType = transaction.type;

            if (transaction.type === "Income") {

                document.getElementById("inAmt").value = transaction.amount;
                document.getElementById("inDate").value = transaction.date;
                document.getElementById("inDes").value = transaction.description;
                document.getElementById("inCat").value = transaction.category;

            } else {

                document.getElementById("exAmt").value = transaction.amount;
                document.getElementById("exDate").value = transaction.date;
                document.getElementById("exDes").value = transaction.description;
                document.getElementById("exCat").value = transaction.category;
            }

        });



        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {

            transactions.splice(index, 1);

            saveTransactions();

            displayTransactions();
        });


        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(typeCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(descriptionCell);
        row.appendChild(actionCell);

        transactionTable.appendChild(row);
    });

    filterTransactions();
}



incomeForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = document.getElementById("inAmt").value;
    const date = document.getElementById("inDate").value;
    const description = document.getElementById("inDes").value;
    const category = document.getElementById("inCat").value;


    const transaction = {
        type: "Income",
        amount: amount,
        date: date,
        description: description,
        category: category
    };


    if (editingIndex !== null && editingType === "Income") {

        transactions[editingIndex] = transaction;

    } else {

        transactions.push(transaction);
    }


    saveTransactions();

    editingIndex = null;
    editingType = null;

    incomeForm.reset();

    displayTransactions();
});



expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = document.getElementById("exAmt").value;
    const date = document.getElementById("exDate").value;
    const description = document.getElementById("exDes").value;
    const category = document.getElementById("exCat").value;


    const transaction = {
        type: "Expense",
        amount: amount,
        date: date,
        description: description,
        category: category
    };


    if (editingIndex !== null && editingType === "Expense") {

        transactions[editingIndex] = transaction;

    } else {

        transactions.push(transaction);
    }


    saveTransactions();

    editingIndex = null;
    editingType = null;

    expenseForm.reset();

    displayTransactions();
});



const calculateBalance = document.getElementById("calculateBalance");

calculateBalance.addEventListener("click", function(event) {

    event.preventDefault();

    let totalIncome = 0;
    let totalExpense = 0;

    const rows = transactionTable.querySelectorAll("tr");

    rows.forEach(function(row) {

        const type = row.cells[0].textContent.trim();
        const amount = Number(row.cells[1].textContent.trim());

        if (type === "Income") {
            totalIncome = totalIncome + amount;
        }

        if (type === "Expense") {
            totalExpense = totalExpense + amount;
        }
    });


    const balance = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpense").textContent = totalExpense;
    document.getElementById("currentBalance").textContent = balance;
});



const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");

typeFilter.addEventListener("change", filterTransactions);
categoryFilter.addEventListener("change", filterTransactions);


function filterTransactions() {

    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;

    const rows = transactionTable.querySelectorAll("tr");

    rows.forEach(function(row) {

        const type = row.cells[0].textContent;
        const category = row.cells[2].textContent;


        const typeMatch =
            selectedType === "All" || type === selectedType;

        const categoryMatch =
            selectedCategory === "All" || category === selectedCategory;


        if (typeMatch && categoryMatch) {

            row.style.display = "";

        } else {

            row.style.display = "none";
        }
    });
}




displayTransactions();

const monthFilter = document.getElementById("monthFilter");
const calculateMonthlyExpense = document.getElementById("calculateMonthlyExpense");
const monthlyExpense = document.getElementById("monthlyExpense");

calculateMonthlyExpense.addEventListener("click", function() {

    const selectedMonth = monthFilter.value;

    let total = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "Expense" &&
            transaction.date.startsWith(selectedMonth)) {

            total = total + Number(transaction.amount);
        }
    });

    monthlyExpense.textContent = total;
});