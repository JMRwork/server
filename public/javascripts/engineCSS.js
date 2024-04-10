let userOn = false;
window.onload = inicialize();
function inicialize() {
    if (document.cookie.includes('u_on=true')) {
        userOn = true;
    }
    toggleLogin();
    showBar();
}
function toggleLogin() {
    const button =
        document.querySelectorAll('.butaoTopo');
    if (userOn) {
        button[3].innerHTML = 'Logout';
        button[3].href = '/logout';
    } else {
        button[3].innerHTML = 'Login';
        button[3].href = '/login';
    }
}
function showBar() {
    const bar =
        document.querySelector('aside');
    if (userOn) {
        userOn = false;
        bar.style.display = 'block';
    } else {
        userOn = true;
        bar.style.display = 'none';
    }
}
function loginFetch(event) {
    // event.preventDefault();
    const message = document.getElementById('message');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = {
        username,
        password
    };

    console.log(user);

    const loginFetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(user)
    };

    fetch('/login', loginFetchOptions)
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
            return response.json();
        })
        .then(obj => {
            if (obj.message) {
                message.style.color = 'rgb(255, 20, 20)';
                message.innerText = obj.message;
            }
        })
        .catch(error => {
            message.style.color = 'rgb(255, 20, 20)';
            message.innerHTML = error;
        });
}

function registerFetch(event) {
    // event.preventDefault();
    const message = document.getElementById('message');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeatPassword').value;
    if (password !== repeatPassword) {
        message.textContent = 'Passwords do not match';
    } else {
        const user = {
            username,
            password
        };

        console.log(user);

        const registerFetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(user)
        };

        fetch('/register', registerFetchOptions)
            .then(response => {
                console.log(response);
                if (response.status === 201) {
                    message.style.color = 'white';
                } else {
                    message.style.color = 'rgb(255, 20, 20)';
                }
                return response.json();
            })
            .then(obj => {
                message.innerText = obj.message;
            })
            .catch(error => {
                message.innerHTML = error;
            });
    }
};

if (document.getElementById('submitBt')) {
    const submitAction = document.getElementById('submitBt');
    if (submitAction.textContent === 'login') {
        submitAction.addEventListener('click', loginFetch);
    } else {
        submitAction.addEventListener('click', registerFetch);
    }
}

function getItemStack() {
    const itemList = document.getElementById('itemList');
    itemList.style.display = 'flex';
    const message = document.getElementById('itemList');
    // Obtenção via Fetch/db quantidade de items
    fetch('/userInventory')
        .then(async response => {
            if (response.ok) {
                const inventory = await response.json();
                const stackInventory = { null: 0 };
                inventory.forEach(element => { stackInventory[element] = stackInventory[element] + 1 || 1; });
                if (stackInventory.null !== 10) {
                    return stackInventory;
                } else {
                    return {
                        message: 'Your inventory is empty.'
                    };
                }
            } else {
                return response.json();
            }
        })
        .then(obj => {
            if (!obj.message) {
                const stackInventory = obj;
                // Lógica para o fetch item Data
                fetch('/items')
                    .then(async response => {
                        // informação dos itens
                        if (response.ok) {
                            const itemData = await response.json();
                            const items = [];
                            for (const element in stackInventory) {
                                itemData.forEach(itemObj => {
                                    if (element === itemObj.itemId.toString()) {
                                        const item = [];
                                        item.push(itemObj.itemId);
                                        item.push(itemObj.name);
                                        item.push(stackInventory[element]);
                                        item.push(itemObj.description);
                                        items.push(item);
                                    }
                                });
                            }
                            return items;
                        } else {
                            return response.json();
                        }
                    })
                    .then(obj => {
                        // Template listagem
                        if (!obj.message) {
                            const itemTemplate = ['Icon', 'Name', 'Qty', 'Description'];
                            const table = document.createElement('table');
                            const rows = [];
                            const stackInventoryLength = Object.keys(stackInventory).length;
                            for (let i = 0; i < stackInventoryLength; i++) {
                                rows[i] = document.createElement('tr');
                                if (i === 0) {
                                    const itemHeaders = [];
                                    for (let j = 0; j < 4; j++) {
                                        itemHeaders[j] = document.createElement('th');
                                        itemHeaders[j].textContent = itemTemplate[j];
                                        rows[i].appendChild(itemHeaders[j]);
                                    }
                                } else {
                                    const itemData = [];
                                    for (let j = 0; j < 4; j++) {
                                        itemData[j] = document.createElement('td');
                                        itemData[j].textContent = obj[i - 1][j];
                                        rows[i].appendChild(itemData[j]);
                                    }
                                }
                                table.appendChild(rows[i]);
                            }
                            if (itemList.childNodes[0]) {
                                itemList.removeChild(itemList.childNodes[0]);
                            }
                            itemList.appendChild(table);
                        } else {
                            message.innerText = obj.message;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        message.innerText = 'Failed to get item data.';
                    });
            } else {
                message.innerText = obj.message;
            }
        })
        .catch(error => {
            console.log(error);
            message.innerText = 'Failed to get inventory.';
        });
}

if (document.getElementById('itemListBtn')) {
    const itemListBtn = document.getElementById('itemListBtn');
    itemListBtn.addEventListener('click', getItemStack);
}

function updateItems(action, emiter) {
    const message = document.getElementById(emiter);
    const updateItemsFetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(action)
    };

    fetch('/userInventory', updateItemsFetchOptions)
        .then(response => { return response.json(); })
        .then(obj => { message.innerText = obj.message; })
        .catch(err => {
            console.log(err);
            message.innerText = 'Unable to proceed with this action';
        });
}
function gatheringAction(event) {
    const action = {
        operation: 'add',
        origin: 'actions',
        qty: parseInt(document.getElementById('actionsQty').value),
        itemId: parseInt(this.value)
    };
    const emiter = 'actionOverview';
    updateItems(action, emiter);
}

function getActions() {
    const actionsLabel = document.getElementById('actions');
    const actionOverview = document.createElement('p');
    actionOverview.id = 'actionOverview';
    fetch('/localActions')
        .then(response => { return response.json(); })
        .then(actions => {
            const qtyLabel = document.createElement('div');
            qtyLabel.id = 'QtyLabel';
            const textLabel = document.createElement('label');
            textLabel.setAttribute('for', 'actionsQty');
            textLabel.textContent = 'Qty';
            const inputLabel = document.createElement('input');
            inputLabel.id = 'actionsQty';
            inputLabel.value = 1;
            qtyLabel.append(textLabel, inputLabel);
            actionsLabel.append(qtyLabel, actionOverview);
            const actionsButtons = [];
            for (let i = 0; i < actions.length; i++) {
                actionsButtons[i] = document.createElement('button');
                actionsButtons[i].id = actions[i].action;
                actionsButtons[i].value = actions[i].value;
                actionsButtons[i].textContent = actions[i].textContent;
                actionsLabel.insertBefore(actionsButtons[i], qtyLabel);
            }
            actionsButtons.forEach((button) => {
                button.addEventListener('click', gatheringAction);
            });
        })
        .catch(err => {
            console.log(err);
            actionsLabel.append(actionOverview);
            actionOverview.textContent = 'No action avaliable.';
        });
}

if (document.getElementById('actions')) {
    getActions();
}

function getItemOrder(event) {
    const itemId = parseInt(this.value);
    const marketChart = document.getElementById('marketChart');
    const marketOverview = document.getElementById('marketOverview');
    fetch('/items')
        .then(response => { return response.json(); })
        .then(itemData => {
            let item;
            itemData.forEach(itemObj => {
                if (itemObj.itemId === itemId) {
                    item = itemObj;
                }
            });
            return item;
        })
        .then(item => {
            if (marketChart.childNodes.length !== 1) {
                const nodes = [...marketChart.childNodes];
                for (const orderNodes of nodes) {
                    if (orderNodes !== marketOverview) {
                        marketChart.removeChild(orderNodes);
                    }
                }
            }
            const itemName = document.createElement('span');
            itemName.innerText = item.name;
            const orderBtns = document.createElement('div');
            const buyBt = document.createElement('button');
            buyBt.innerText = 'Buy';
            buyBt.value = item.id;
            const sellBt = document.createElement('button');
            sellBt.innerText = 'Sell';
            sellBt.value = item.id;
            orderBtns.appendChild(buyBt);
            orderBtns.appendChild(sellBt);
            const marketQtyLabel = document.createElement('div');
            const marketQtyName = document.createElement('span');
            marketQtyName.textContent = 'Quantity: ';
            const marketQty = document.createElement('input');
            marketQty.id = 'marketQty';
            marketQty.value = '1';
            marketQtyLabel.append(marketQtyName, marketQty);
            const itemPrice = document.createElement('span');
            itemPrice.textContent = `Price: ${item.price}¢ each`;
            marketChart.insertBefore(itemName, marketOverview);
            marketChart.insertBefore(orderBtns, marketOverview);
            marketChart.insertBefore(marketQtyLabel, marketOverview);
            marketChart.insertBefore(itemPrice, marketOverview);
            buyBt.addEventListener('click', function (e) { tradeItem('add', parseInt(marketQty.value), itemId); });
            sellBt.addEventListener('click', function (e) { tradeItem('remove', parseInt(marketQty.value), itemId); });
        })
        .catch(err => {
            console.log(err);
            marketChart.innerText = 'Unable to get item orders.';
            marketChart.style.textAlign = 'center';
        });
}

function tradeItem(operation, qty, itemId) {
    const action = {
        operation,
        origin: 'market',
        qty,
        itemId
    };
    const emiter = 'marketOverview';
    updateItems(action, emiter);
}

if (document.getElementById('market')) {
    const itemToList = document.getElementById('itemCategories');
    itemToList.addEventListener('change', getItemOrder);
}
