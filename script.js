let expenses = [];

let limit = 10000;
const currency = 'руб.';
const inLimit = 'все хорошо';
const outLimit = 'все плохо';
const outLimitClassName = 'status-red';

const inputNode = document.querySelector('.expense-input');
const btnNode = document.querySelector('.add-btn');
const historyNode = document.querySelector('.history');
const sumNode = document.querySelector('.sum');
const limitNode = document.querySelector('.limit');
const statusNode = document.querySelector('.status');
const clearNode = document.querySelector('.clear-btn');
const changeNode = document.querySelector('.change-btn');
const categoryNode = document.querySelector('.category');

init();

btnNode.addEventListener('click', function () {
    const currentSum  = getExpenseFromUser();
    if(!currentSum) {
      alert('Не задана сумма');
      return;
    }

    const currentCategory = getCategory();
    if(categoryNode.value === "Категория") {
        alert('Категория не выбрана');
        return ;
    }

    const expense = {sum:currentSum,category:currentCategory};

    addExpense(expense);

    saveExpensesToLS();
    
    render(expenses);

 });

 clearNode.addEventListener('click', function () {
   expenses = [];
   localStorage.removeItem("expenses");
   statusNode.classList.remove(outLimitClassName);
   render(expenses);
   statusNode.innerText = inLimit;
 });

 changeNode.addEventListener('click',function () {
    const newLim = prompt('Укажите новый лимит');

    const newLimit = parseInt(newLim);
    if (!newLimit) {
        return;
    }

    limitNode.innerText = newLimit;
    limit = newLimit;
    localStorage.setItem("limit",newLimit);

    render(expenses);
 });


//1 инит
function init() {
  const limitFromLS = parseInt(localStorage.getItem("limit"));
  if(limitFromLS) {
    limit = limitFromLS;
  }

  const expensesFromLsString = localStorage.getItem("expenses");
  const expensesFromLS = JSON.parse(expensesFromLsString);

  if (Array.isArray(expensesFromLS)) {
    expenses = expensesFromLS;
  }
  

  limitNode.innerText = limit;
  statusNode.innerText = inLimit;
  sumNode.innerText = calculateSum(expenses);
  render(expenses);

}

//2 получение от пользователя
function getExpenseFromUser () {
  const expense = parseInt(inputNode.value);
  if (!expense) {
    return
  }

  clearInput();

  return expense;
}

//3 очистка поля
function clearInput () {
  inputNode.value = '';
}

//4 подсчет суммы
function calculateSum (expenses) {
  let sum = 0;
   expenses.forEach(element => {
     sum += element.sum
   });

   return sum;
}
//5 добавление траты
function addExpense (expense) {
  expenses.push(expense);
}
//6 рендер суммы
function renderSum(expenses) {
   sumNode.innerText = calculateSum(expenses) ;
}

//7 рендер истории
function renderHistory (expenses) {
  let historyHTML = '';
  expenses.forEach(element => {
    let li = `<li>${element.category} - ${element.sum} ${currency}</li>`;
    historyHTML += li;
  });

  historyNode.innerHTML = `<ol>${historyHTML}</ol>`;
}

//8 рендер статуса
function renderStatus(sum) {

  if(sum <= limit) {
    statusNode.innerText = inLimit;
    statusNode.classList.remove(outLimitClassName);
  } else {
    statusNode.innerText = `${outLimit} (-${sum - limit})`;
    statusNode.classList.add(outLimitClassName);
  }
}

//9 рендер общий
function render(expenses) {
  const sum = calculateSum(expenses);

  renderHistory(expenses);
  renderSum(expenses);
  renderStatus(sum);
}

//10 получение категории
function getCategory () {
    return categoryNode.value;
}

function saveExpensesToLS () {
    const expString = JSON.stringify(expenses);
    localStorage.setItem("expenses",expString);
}