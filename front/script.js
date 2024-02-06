function init() {
    renderAllUsers();
    handleEvents();
}

init();

function handleEvents() {
    toggleCreateBlock();
    attachEditEvent();
}

async function renderAllUsers() {
    let response = await fetch('http://localhost:3005/getUsers');
    let data = await response.json();
    if (!isJson(data)) return;
    const listWrapper = document.querySelector('.list');
    listWrapper.innerHTML = '';
    let dataArray = data.users;
    dataArray.forEach(user => {
        let html = `
        <div class="item">
            <div class="item__wrapper">
                <div class="item__row item__row--stretch">
                    <div class="item__input-wrapper">
                        <span class="item__label">Имя</span>
                        <span name="name" class="item__text item--name">${user.name}</span>
                    </div>

                    <div class="item__input-wrapper">
                        <label class="item__label">Почта</label>
                        <input name="email" type="text" class="input item__input" disabled value="${user.email}" data-cache="${user.email}">
                    </div>
                </div>

                <div class="item__row">
                    <div class="item__block">
                        <span class="item__label">Дата создания</span>
                        <span class="item__text">${user.created.split(',').join(' ')}</span>
                    </div>
                    <div class="item__block">
                        <span class="item__label">Дата последнего изменения</span>
                        <span class="item__text">${user.lastUpdate.split(',').join(' ')}</span>
                    </div>
                </div>
                

                <div class="item__control">
                    <img src="./assets/img/pencil.svg" class="item__control-icon item__control-icon--change">
                    <img src="./assets/img/cross.svg" class="item__control-icon item__control-icon--hide item__control-icon--cancel">
                </div>
            </div>

            <div class="item__confirm-wrapper">
                <button class="btn btn-pill item__confirm" type="button">Сохранить</button>
            </div>
        </div>
        `
        listWrapper.insertAdjacentHTML('beforeend', html);
    })
}

function toggleCreateBlock() {
    const createForm = document.querySelector('.create__form');
    const createToggleButton = document.querySelector('.create__button-toggle');
    const createBlock = document.querySelector('.create__wrapper');
    const createButton = document.querySelector('.create__button');
    const cancelButton = document.querySelector('.create__button-cancel');
    if (createBlock === null || createButton === null || createToggleButton === null) return;

    createForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createEvent();
    })
    createToggleButton.addEventListener('click', openBlock)
    cancelButton.addEventListener('click', closeBlock);
    // createButton.addEventListener('click', createEvent);


    function openBlock() {
        createToggleButton.classList.add('create__button-toggle--hide');
        createBlock.classList.add('create__wrapper--active');
    }

    function closeBlock() {
        createToggleButton.classList.remove('create__button-toggle--hide');
        createBlock.classList.remove('create__wrapper--active');
    }
}

function createEvent() {
    const createEmail = document.querySelector('.create__input[name="email"]').value;
    const createName = document.querySelector('.create__input[name="name"]').value;
    const date = new Date();
    const currentDate = `${'0' + date.getDate().toString().slice(-2)}.${'0' + (date.getMonth()+1).toString().slice(-2)}.${date.getFullYear()},${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, "0")}`;
    let dataToSend = {
        'name': createName,
        'email': createEmail,
        'date': currentDate
    }
    fetch('http://localhost:3005/createUser', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            renderAllUsers();
        } else {
            console.log(data?.message)
        }
    })
}

function attachEditEvent() {
    const listWrapper = document.querySelector('.list');
    if (listWrapper === null) return;

    listWrapper.addEventListener('click', function(e) {
        if (e.target.classList.contains('item__control')) {
            handleChangeButton(e.target);
        }

        if (e.target.classList.contains('item__confirm')) {
            e.preventDefault();
            handleChangeSubmit(e.target);
        }
    })
}

function handleChangeButton(element) {
    const itemWrapper = element.closest('.item');
    const iconChange = itemWrapper.querySelector('.item__control-icon--change');
    const iconCancel = itemWrapper.querySelector('.item__control-icon--cancel');
    const emailInput = itemWrapper.querySelector('.item__input[name="email"]');
    const confirmBlock = itemWrapper.querySelector('.item__confirm-wrapper');
    itemWrapper.classList.contains('item--edit') ? disableEditState() : enableEditState();

    function enableEditState() {
        itemWrapper.classList.add('item--edit')
        iconChange.classList.add('item__control-icon--hide');
        iconCancel.classList.remove('item__control-icon--hide');
        emailInput.classList.add('item__input--active');
        emailInput.removeAttribute('disabled');
        confirmBlock.classList.add('item__confirm-wrapper--active');
    }

    function disableEditState() {
        itemWrapper.classList.remove('item--edit')
        iconChange.classList.remove('item__control-icon--hide');
        iconCancel.classList.add('item__control-icon--hide');
        emailInput.classList.remove('item__input--active');
        emailInput.setAttribute('disabled', '');
        confirmBlock.classList.remove('item__confirm-wrapper--active')
    }
}

function handleChangeSubmit(element) {
    const itemWrapper = element.closest('.item');
    const name = itemWrapper.querySelector('.item--name').innerText;
    const email = itemWrapper.querySelector('.item__input[name="email"]').value;
    const emailCache = itemWrapper.querySelector('.item__input[name="email"]').getAttribute('data-cache');
    if (email === emailCache) return;
    const date = new Date();
    const currentDate = `${'0' + date.getDate().toString().slice(-2)}.${'0' + (date.getMonth()+1).toString().slice(-2)}.${date.getFullYear()},${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, "0")}`;
    let dataToSend = {
        'name': name,
        'email': email,
        'date': currentDate
    }
    fetch('http://localhost:3005/changeUser', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            renderAllUsers();
        } else {
            console.log(data?.message)
        }
    })

}

function isJson(item) {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;    
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
      
    return typeof value === "object" && value !== null;
}