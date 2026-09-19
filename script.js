// Get elements from HTML

const form = document.getElementById("transaction-form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");

const transactionList = document.getElementById("transaction-list");
const filter = document.getElementById("filter");


// Load transactions from localStorage

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// Set today's date automatically

const today = new Date().toISOString().split("T")[0];

dateInput.value = today;


// Add transaction

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (
        description === "" ||
        amount <= 0 ||
        date === ""
    ) {
        alert("Please enter valid information.");
        return;
    }

    const transaction = {

        id: Date.now(),

        description: description,

        amount: amount,

        type: type,

        category: category,

        date: date

    };

    transactions.push(transaction);

    saveTransactions();

    form.reset();

    dateInput.value = today;

    displayTransactions();

    updateSummary();

});


// Save transactions

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Display transactions

function displayTransactions() {

    transactionList.innerHTML = "";

    let filteredTransactions = transactions;

    const selectedFilter = filter.value;

    if (selectedFilter !== "all") {

        filteredTransactions = transactions.filter(
            transaction => transaction.type === selectedFilter
        );

    }

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                No transactions found.
            </p>
        `;

        return;

    }


    // Show newest transactions first

    filteredTransactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const transactionElement =
                document.createElement("div");

            transactionElement.classList.add("transaction");


            // Choose icon

            const icons = {

                Food: "🍔",

                Transport: "🚗",

                Shopping: "🛍️",

                Bills: "💡",

                Entertainment: "🎬",

                Health: "💊",

                Education: "📚",

                Salary: "💰",

                Other: "📦"

            };

            const icon = icons[transaction.category] || "📦";


            // Amount sign

            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            transactionElement.innerHTML = `

                <div class="transaction-info">

                    <div class="category-icon">
                        ${icon}
                    </div>

                    <div class="transaction-details">

                        <h3>
                            ${transaction.description}
                        </h3>

                        <p>
                            ${transaction.category}
                            •
                            ${formatDate(transaction.date)}
                        </p>

                    </div>

                </div>


                <div class="transaction-right">

                    <span class="amount ${transaction.type}">
                        ${sign}$${transaction.amount.toFixed(2)}
                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        ✕
                    </button>

                </div>

            `;

            transactionList.appendChild(
                transactionElement
            );

        });

}


// Delete transaction

function deleteTransaction(id) {

    const confirmDelete =
        confirm("Delete this transaction?");

    if (!confirmDelete) {
        return;
    }

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();

    displayTransactions();

    updateSummary();

}


// Update summary

function updateSummary() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expenses += transaction.amount;

        }

    });


    const balance = income - expenses;


    incomeElement.textContent =
        `$${income.toFixed(2)}`;

    expensesElement.textContent =
        `$${expenses.toFixed(2)}`;

    balanceElement.textContent =
        `$${balance.toFixed(2)}`;


    // Change balance color

    if (balance < 0) {

        balanceElement.style.color = "#dc2626";

    } else {

        balanceElement.style.color = "#16a34a";

    }

}


// Format date

function formatDate(date) {

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// Filter transactions

filter.addEventListener(
    "change",
    displayTransactions
);


// Initial display

displayTransactions();

updateSummary();
