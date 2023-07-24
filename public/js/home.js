var myModal = new bootstrap.Modal(document.getElementById('transaction-modal'))
const hasSession = localStorage.getItem('session')
let isLogged = sessionStorage.getItem('logged')

let data = {
  transactions: []
}

const checkLogged = () => {
  if(hasSession) {
    sessionStorage.setItem('logged', hasSession);
    isLogged = hasSession;
  }
  if(!isLogged) {
    window.location.href = 'index.html';
    return;
  }

  const dataUser = JSON.parse(localStorage.getItem(isLogged))
  if(dataUser) {
    data = dataUser
  }

  getCashIn();
  getCashOut();
  getTotal();
}
checkLogged();


// Adicionar lançamento
const transactionForm = document.querySelector('#create-transaction-form')

transactionForm.addEventListener('submit', e => {
  e.preventDefault()

  const value = parseFloat(transactionForm.transactionValue.value);
  const description = transactionForm.transactionDescription.value;
  const date = transactionForm.transactionDate.value;
  const type = document.querySelector('input[name="transactionType"]:checked').value;

  data.transactions.unshift(
    {
     id: Math.trunc(Math.random() * 10000000),
     value,
     description,
     date,
     type
    }
  )
  saveData(data);


  e.target.reset();
  myModal.hide();
  successAlertUser();
})


function getCashIn() {
  const transactions = data.transactions;
  const cashIn = transactions.filter(transaction => transaction.type === '1');
  const cashOut = transactions.filter(transaction => transaction.type === '2');

  if(cashIn.length) {
    let cashInHTML = ``;
    let limit = 5;

    if(cashIn.length > 5) {
      limit = 5;
    } else {
      limit = cashIn.length
    }

    for (let index = 0; index < limit; index++) {
      cashInHTML += `
      
      <div class="row mb-4">
        <div class="col-12">
          <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
          <div class="container p-0">
            <div class="row">
              <div class="col-12 col-md-8">
                <p>${cashIn[index].description}</p> 
              </div>
              <div class="col-12 col-md-3 d-flex justify-content-end">
              ${cashIn[index].date}
              </div>
            </div>
          </div>
        </div>
      </div>`
    }

    document.querySelector('#cash-in-list').innerHTML = cashInHTML;
  }
}

function getCashOut() {
  const transactions = data.transactions;
  const cashOut = transactions.filter(transaction => transaction.type === '2');

  if(cashOut.length) {
    let cashOutHTML = ``;
    let limit = 5;

    if(cashOut.length > 5) {
      limit = 5;
    } else {
      limit = cashOut.length
    }

    for (let index = 0; index < limit; index++) {
      cashOutHTML += `
      
      <div class="row mb-4">
        <div class="col-12">
          <h3 class="fs-2">R$ ${cashOut[index].value.toFixed(2)}</h3>
          <div class="container p-0">
            <div class="row">
              <div class="col-12 col-md-8">
                <p>${cashOut[index].description}</p> 
              </div>
              <div class="col-12 col-md-3 d-flex justify-content-end">
              ${cashOut[index].date}
              </div>
            </div>
          </div>
        </div>
      </div>`
    }

    document.querySelector('#cash-out-list').innerHTML = cashOutHTML;
  }
}

function getTotal() {
  const transactions = data.transactions;
  let total = 0

  transactions.forEach(item => {
    if(item.type === '1') {
      total += item.value;
    } else {
      total -= item.value;
    }
  })

  document.getElementById('total').innerHTML = `R$ ${total.toFixed(2)}`
}


const saveData = (data) => {
  localStorage.setItem(data.email, JSON.stringify(data))
  getCashIn();
  getCashOut();
  getTotal();
}



// Alerts

const successAlertUser = () => {
  const alert = document.querySelector('[data-js-custom-alert-success]');
  alert.classList.add('alert-user')
  alert.classList.remove('d-none')
  
  setTimeout(()=> {
    alert.classList.remove('alert-user')
    alert.classList.add('d-none')
  }, 4000)
}

// Botão de Logout
document.querySelector('#button-logout').addEventListener('click', e => {
  sessionStorage.removeItem('logged')  
  localStorage.removeItem('session')

  window.location.href = 'index.html'
})

// Botão Ver todas
document.querySelector('#transaction-button').addEventListener('click', () => {
  window.location.href = 'transactions.html';
})  