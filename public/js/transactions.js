var myModal = new bootstrap.Modal(document.getElementById('transaction-modal'))
var myModalEdit = new bootstrap.Modal(document.getElementById('edit-transaction-modal'))
const hasSession = localStorage.getItem('session')
let isLogged = sessionStorage.getItem('logged')
let transactionId = 0;


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

  getTransactions();
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

const saveData = (data) => {
  localStorage.setItem(data.email, JSON.stringify(data))
  getTransactions();
}



function getTransactions() {
  const transactions = data.transactions;
  let transactionsHtml = ``;

  if(transactions.length) {
    transactions.forEach(item => {
      let type = 'Entrada';

      if(item.type === '2') {
        type = 'Saída';
      }

      transactionsHtml += `
        <tr>
          <th scope="row">${item.date}</th>
          <td>${item.value.toFixed(2)}</td>
          <td>${type}</td>
          <td>${item.description}</td>
          <td>
            <i class="bi bi-trash-fill remove-icon" id="${item.id}" onClick="removeTransaction(event)"></i>
            <i class="bi bi-pen-fill edit-icon" id="${item.id}" onClick="editTransaction(event)" data-bs-toggle="modal" data-bs-target="#edit-transaction-modal"></i>
          </td>
        </tr>
      `;

    })
    document.querySelector('#transactions-data').innerHTML = transactionsHtml;
  }
}

function removeTransaction(e) {
    data.transactions = removeFromUserData(data.transactions, parseFloat(e.target.id));
    saveData(data)
    getTransactions();
}

function removeFromUserData(data, id) {
  return data.filter(item => item.id !== id)
}

const modalEditForm = document.querySelector("#edit-transaction-form");



function editTransaction(e) {
  const userData = Array.from(e.target.parentElement.parentElement.children)
  transactionId = e.target.id;

  const obj = {
      value: parseFloat(userData[1].textContent),
      description: userData[3].textContent,
      date: userData[0].textContent,
      type: userData[2].textContent === "Entrada" ? "1" : "2",
  }

    modalEditForm.transactionValueEdit.value = obj.value;
    modalEditForm.transactionDescriptionEdit.value = obj.description;
    modalEditForm.transactionDateEdit.value = obj.date;
    modalEditForm.entradaEdit.checked = obj.type === "1";
    modalEditForm.saidaEdit.checked = obj.type === "2";
}

  modalEditForm.addEventListener('submit', event => {
    event.preventDefault();

    const value = parseFloat(modalEditForm.transactionValueEdit.value);
    const description = modalEditForm.transactionDescriptionEdit.value;
    const date = modalEditForm.transactionDateEdit.value;
    const type = document.querySelector('input[name="transactionTypeEdit"]:checked').value;

    const obj = {id: parseFloat(transactionId), value, description, date, type};

    updateTransaction(obj);
    
    myModalEdit.hide();
    successAlertUser('edit');
  })

function updateTransaction(obj) {
  data.transactions.forEach(item => {
    if(item.id === obj.id) {
      item.value = obj.value;
      item.description = obj.description;
      item.date = obj.date;
      item.type = obj.type;
    }
  });
  
  saveData(data);

  transactionId = 0
}


// Alerts
function successAlertUser(target) {
  const alert = document.querySelector('[data-js-custom-alert-success]');
  const alertEdit = document.querySelector('[data-js-custom-alert-success-edit]');

  if(target === 'edit') {
    alertEdit.classList.add('alert-user');
    alertEdit.classList.remove('d-none');

    setTimeout(()=> {
      alertEdit.classList.remove('alert-user')
      alertEdit.classList.add('d-none')
    }, 4000)
    
  } else {
    alert.classList.add('alert-user');
    alert.classList.remove('d-none');

    setTimeout(()=> {
      alert.classList.remove('alert-user')
      alert.classList.add('d-none')
    }, 4000)
  }
  
}

// Botão de logout
document.querySelector('#button-logout').addEventListener('click', e => {
  sessionStorage.removeItem('logged');
  localStorage.removeItem('session');

  window.location.href = 'index.html';
})