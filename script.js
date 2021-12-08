const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localDataBase = JSON.parse(localStorage.getItem("transactions"));
let transactions =
  localStorage.getItem("transactions") !== null ? localDataBase : [];
const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  init();
  updateLocalBase();
};
const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");
  li.classList.add(CSSClass);
  li.innerHTML = `
    ${transaction.name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})"><i class="ri-close-fill"></i></button>
  `;
  transactionsUl.append(li);
};
const updateBalanceValues = () => {
  const transactionAmounts = transactions.map(
    (transaction) => transaction.amount
  );
  const total = transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);
  const income = transactionAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);
  const expense = Math.abs(
    transactionAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);
  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};
init();

const updateLocalBase = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionData = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const cleanInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor, preecha tanto o nome ou valor da transação");
    return;
  }

  addToTransactionData(transactionName, transactionAmount);
  init();
  updateLocalBase();
  cleanInputs();
};

form.addEventListener("submit", handleFormSubmit);
