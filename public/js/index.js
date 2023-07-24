// LOGIN ACCOUNT
const formLogin = document.querySelector("#login-form");
const hasSession = localStorage.getItem('session')
let isLogged = sessionStorage.getItem('logged')

formLogin.addEventListener('submit', e => {
  e.preventDefault()

  const email = formLogin.emailLoginInput.value;
  const password = formLogin.passwordLoginInput.value;
  const checkSession =  formLogin.sessionCheck.checked;

  tryToLogin({email, password});
  
  saveSession(email, checkSession);

})

const tryToLogin = (data) => {
  const account = JSON.parse(localStorage.getItem(data.email));
  
  if(!account) {
    alertUser('login');
    throw Error("Conta inexistente");
  }

  if(account.email === data.email && account.password === data.password) {
    window.location.href = 'home.html'
  } else {
    alertUser('login')
  }
}

const saveSession = (data, checkSession) => {
  if(checkSession) {
    localStorage.setItem('session', data);
  }
  sessionStorage.setItem('logged', data);
}

const checkLogged = () => {
  if(hasSession) {
    sessionStorage.setItem('logged', hasSession);
    isLogged = hasSession;
  }

  if(isLogged) {
    saveSession(isLogged, hasSession);
    window.location.href = 'home.html';
  }
}
checkLogged();


// CREATE ACCOUNT
var myModal = new bootstrap.Modal(document.getElementById('register-modal'))
const form = document.querySelector('#create-account-form');

form.addEventListener('submit', e => {
  e.preventDefault()

  const email = form.createAccountEmail.value;
  const password = form.createAccountPassword.value;
  
  if(!isEmailValid(email)) {
    alertUser('email')
    return;
  };
  
  if(!isPasswordValid(password)) {
    alertUser('password')
    return;
  };

  saveAccount({email, password, transactions: []})
  
  myModal.hide();

  successAlertUser();
})

const isEmailValid = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}

const isPasswordValid = (password) => {
  return password.length >= 4;
}

const saveAccount = (data) => {
  localStorage.setItem(data.email, JSON.stringify(data));
}

const alertUser = (data) => {
  const errorAlert = document.querySelector('[data-js-custom-alert]')
  const errorLoginAlert = document.querySelector('[data-js-custom-alert-login]')
  const div = document.querySelector('#message-error')
  const divLogin = document.querySelector('#message-error-login')

  errorAlert.classList.add('alert-user')
  errorAlert.classList.remove('d-none')
  if(data === 'email') {
    div.textContent = 'O E-mail informado não é válido'
  } 
  if(data === 'password') {
    div.textContent = 'A senha deve conter no mínimo 4 caracteres'
  }

  if(data === 'login') {
    errorLoginAlert.classList.add('alert-user')
    errorLoginAlert.classList.remove('d-none')
    divLogin.textContent = 'Opps! Verifique seu email e senha e tente novamente!'

    setTimeout(()=> {
      errorLoginAlert.classList.remove('alert-user')
      errorLoginAlert.classList.add('d-none')
    }, 4000)
  }

  setTimeout(()=> {
    errorAlert.classList.remove('alert-user')
    errorAlert.classList.add('d-none')
  }, 4000)
}

const successAlertUser = () => {
  const alert = document.querySelector('[data-js-custom-alert-success]');
  alert.classList.add('alert-user')
  alert.classList.remove('d-none')

  setTimeout(()=> {
    alert.classList.remove('alert-user')
    alert.classList.add('d-none')
  }, 4000)

}