/* eslint-disable no-unused-vars */
window.onload = inicialize();
function inicialize() {
    const userOn = document.cookie.includes('u_on=true');
    toggleLogin(userOn);
    if (window.location.pathname === '/game') {
        getDashboard(false);
        getChat(true);
    } else if (window.location.pathname === '/login' || window.location.pathname === '/register') {
        setEnterShortcut();
        const submitAction = document.getElementById('submitBt');
        if (submitAction.textContent === 'login') {
            submitAction.addEventListener('click', loginFetch);
        } else {
            submitAction.addEventListener('click', registerFetch);
        }
    }
}

function toggleLogin(condition) {
    if (condition) {
        const button = document.querySelectorAll('.butaoTopo');
        button[0].target = '_blank';
        button[2].target = '_blank';
        button[3].innerHTML = 'Logout';
        button[3].href = '/logout';
    }
}

function setEnterShortcut() {
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.target.id === 'username') {
                    document.getElementById('password').focus();
                } else if (e.target.id === 'password') {
                    if (document.getElementById('submitBt').textContent === 'login') {
                        loginFetch(e);
                    } else {
                        document.getElementById('repeatPassword').focus();
                    }
                } else if (e.target.id === 'repeatPassword') {
                    registerFetch(e);
                }
            }
        });
    }
}

function showBar(userOn) {
    const bar =
        document.querySelector('aside');
    if (userOn) {
        bar.style.display = 'block';
    } else {
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
            console.log(response);
            if (response.redirected) {
                window.location.href = response.url;
                return {};
            } else {
                return response.json();
            }
        })
        .then(obj => {
            if (obj.message) {
                message.style.color = 'rgb(255, 20, 20)';
                message.innerText = obj.message;
            }
        })
        .catch(error => {
            console.error(error);
            message.style.color = 'rgb(255, 20, 20)';
            message.innerHTML = error;
        });
}

function registerFetch(event) {
    // event.preventDefault();
    const message = document.getElementById('message');
    message.style.color = 'rgb(255, 20, 20)';
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
                }
                return response.json();
            })
            .then(obj => {
                message.innerText = obj.message;
            })
            .catch(error => {
                console.error(error);
                message.style.color = 'rgb(255, 20, 20)';
                message.innerHTML = error;
            });
    }
};

function getItemStack(refresh) {
    const painel = document.getElementById('painel');
    let itemList;
    let doFecth = true;
    if (document.getElementById('itemList')) {
        itemList = document.getElementById('itemList');
        if (!refresh) {
            doFecth = false;
            painel.removeChild(itemList);
        }
    } else {
        itemList = document.createElement('div');
        itemList.setAttribute('id', 'itemList');
        itemList.setAttribute('class', 'mainColor mainGaps');
        painel.appendChild(itemList);
    }
    // Obtenção via Fetch/db quantidade de items
    if (doFecth) {
        fetch('/userInventory')
            .then(async response => {
                console.log(response);
                if (response.ok) {
                    const userInventory = await response.json();
                    const inventory = userInventory.inventory;
                    const inventoryCap = userInventory.inventoryCap;
                    console.log(inventory);
                    const stackInventory = { null: 0 };
                    inventory.forEach(element => { stackInventory[element] = stackInventory[element] + 1 || 1; });
                    console.log(stackInventory);
                    if (stackInventory.null !== inventoryCap) {
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
                                        if (element === itemObj.item_id.toString()) {
                                            const item = [];
                                            item.push(itemObj.item_id);
                                            item.push(itemObj.name);
                                            item.push(stackInventory[element]);
                                            item.push(itemObj.description);
                                            items.push(item);
                                        }
                                    });
                                }
                                console.log(items);
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
                                // Change to i < stackInventoryLength
                                for (let i = 0; i < obj.length + 1; i++) {
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
                                itemList.replaceChildren(table);
                            } else {
                                itemList.innerText = obj.message;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            itemList.innerText = 'Failed to get item data.';
                        });
                } else {
                    itemList.innerText = obj.message;
                }
            })
            .catch(error => {
                console.log(error);
                itemList.innerText = 'Failed to get inventory.';
            });
    }
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

function gatheringAction() {
    const action = {
        operation: 'add',
        origin: 'actions',
        qty: parseInt(document.getElementById('actionsQty').value),
        itemId: parseInt(this.value)
    };
    const emiter = 'actionOverview';
    updateItems(action, emiter);
    setTimeout(() => {
        if (document.getElementById('itemList')) {
            getItemStack(true);
        }
        if (document.getElementById('Dashboard')) {
            getDashboard(true);
        }
    }, 500);
};

function getDashboard(refresh) {
    const painel = document.getElementById('painel');
    let dashboard;
    let doFecth = true;
    if (document.getElementById('dashboard')) {
        dashboard = document.getElementById('dashboard');
        if (!refresh) {
            doFecth = false;
            painel.removeChild(dashboard);
        }
    } else {
        dashboard = document.createElement('div');
        dashboard.setAttribute('id', 'dashboard');
        dashboard.setAttribute('class', 'mainColor mainGaps');
        painel.appendChild(dashboard);
    }
    if (doFecth) {
        fetch('/status')
            .then(response => {
                return response.json();
            })
            .then(async status => {
                const dashboardTitle = document.createElement('h3');
                dashboardTitle.innerText = 'Dashboard';
                dashboardTitle.setAttribute('id', 'dashboardTitle');
                const dashboardChart = document.createElement('div');
                dashboardChart.setAttribute('id', 'dashboardChart');
                dashboard.replaceChildren(dashboardTitle, dashboardChart);
                if (status.message) {
                    dashboardChart.innerText = status.message;
                    return;
                }
                // Body
                // currency status
                const dashboardCurrency = document.createElement('p');
                dashboardCurrency.setAttribute('id', 'dashboardCurrency');
                dashboardCurrency.innerText = `Currency: ${status.currency} ¢`;
                // inventory status
                const dashboardInventoryStack = document.createElement('p');
                dashboardInventoryStack.setAttribute('id', 'dashboardInventory');
                if (status.message) {
                    dashboardInventoryStack.innerText = status.message;
                } else {
                    dashboardInventoryStack.innerText = `Inventory Capacity Used: 
                    ${status.count}/${status.inventory_cap}`;
                }
                // location status
                const dashboardLocation = document.createElement('p');
                dashboardLocation.setAttribute('id', 'dashboardLocation');
                dashboardLocation.innerText = `Location sector: ${status.location}`;
                // mission status
                const dashboardMission = document.createElement('div');
                dashboardMission.setAttribute('id', 'dashboardMission');
                if (status.missionStatus.error) {
                    dashboardMission.innerText = status.missionStatus.error;
                } else {
                    dashboardMission.innerText = 'Actual Mission: ';
                    const dashboardMissionSelect = document.createElement('select');
                    dashboardMissionSelect.setAttribute('id', 'dashboardMissionSelect');
                    dashboardMissionSelect.addEventListener('change', (event) => {
                        const missionStep = document.getElementById('dashboardMissionStep');
                        for (let i = 0; i < status.missionStatus.length; i++) {
                            if (status.missionStatus[i].missionId === parseInt(event.target.value)) {
                                missionStep.innerText = status.missionStatus[i].missionStep;
                            }
                        }
                    });
                    const selectLabel = document.createElement('option');
                    selectLabel.innerText = 'Select a Mission...';
                    selectLabel.setAttribute('disabled', true);
                    selectLabel.setAttribute('selected', true);
                    dashboardMissionSelect.appendChild(selectLabel);
                    status.missionStatus.forEach((mission) => {
                        const option = document.createElement('option');
                        option.value = mission.missionId;
                        option.innerText = mission.missionId;
                        dashboardMissionSelect.appendChild(option);
                    });
                    const dashboardMissionStep = document.createElement('p');
                    dashboardMissionStep.setAttribute('id', 'dashboardMissionStep');
                    dashboardMissionStep.innerText = 'There should come the current Mission Step.';
                    dashboardMission.append(dashboardMissionSelect, dashboardMissionStep);
                }
                dashboardChart.append(dashboardCurrency, dashboardInventoryStack, dashboardLocation, dashboardMission);
            })
            .catch(error => {
                const dashboardChart = document.getElementById('dashboardChart');
                dashboardChart.innerText = 'Unable to get Dashboard';
                console.log(error);
            });
    }
}

function getActions(refresh) {
    const painel = document.getElementById('painel');
    let actionsPainel;
    let doFecth = true;
    if (document.getElementById('actions')) {
        actionsPainel = document.getElementById('actions');
        if (!refresh) {
            doFecth = false;
            painel.removeChild(actionsPainel);
        }
    } else {
        actionsPainel = document.createElement('div');
        actionsPainel.setAttribute('id', 'actions');
        actionsPainel.setAttribute('class', 'mainColor mainGaps');
        painel.appendChild(actionsPainel);
    }
    const actionOverview = document.createElement('p');
    actionOverview.setAttribute('id', 'actionOverview');
    if (doFecth) {
        fetch('/localActions')
            .then(response => {
                return response.json();
            })
            .then(actionsResponse => {
                console.log(actionsResponse);
                if (actionsResponse.message) {
                    actionsPainel.textContent = actionsResponse.message;
                    return;
                }
                const qtyLabel = document.createElement('div');
                qtyLabel.id = 'QtyLabel';
                const textLabel = document.createElement('label');
                textLabel.setAttribute('for', 'actionsQty');
                textLabel.textContent = 'Qty';
                const inputLabel = document.createElement('input');
                inputLabel.id = 'actionsQty';
                inputLabel.value = 1;
                qtyLabel.append(textLabel, inputLabel);
                actionsPainel.replaceChildren(qtyLabel, actionOverview);
                const actionsButtons = [];
                for (let i = 0; i < actionsResponse.localActions.length; i++) {
                    const respectiveAction = actionsResponse.actions.filter(action => action.action_id === actionsResponse.localActions[i].action_id)[0];
                    console.log(respectiveAction);
                    actionsButtons[i] = document.createElement('button');
                    actionsButtons[i].value = respectiveAction.item_id;
                    actionsButtons[i].textContent = respectiveAction.name;
                    actionsPainel.insertBefore(actionsButtons[i], qtyLabel);
                }
                actionsButtons.forEach(button => {
                    if (button.value === 'null') {
                        button.addEventListener('click', getMarket);
                    } else {
                        button.addEventListener('click', gatheringAction);
                    }
                });
            })
            .catch(err => {
                console.log(err);
                actionsPainel.textContent = 'No action avaliable.';
            });
    }
}

function getMarket() {
    const painel = document.getElementById('painel');
    let market = document.getElementById('market');
    if (market) {
        painel.removeChild(market);
    } else {
        market = document.createElement('div');
        market.setAttribute('id', 'market');
        market.setAttribute('class', 'mainColor mainGaps');
        painel.append(market);
        // Market header
        const marketTitle = document.createElement('div');
        marketTitle.setAttribute('id', 'marketTitle');
        const marketTitleName = document.createElement('h3');
        marketTitleName.innerText = 'Market';
        const marketTitleDivisory = document.createElement('hr');
        marketTitle.append(marketTitleName, marketTitleDivisory);
        // Market Body
        const marketPainel = document.createElement('div');
        marketPainel.setAttribute('id', 'marketPainel');
        // Append on painel
        market.append(marketTitle, marketPainel);
        // Mock Items
        fetch('/items')
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(async itemsResponse => {
                if (itemsResponse.message) {
                    marketPainel.innerText = itemsResponse.message;
                    marketPainel.style.justifyContent = 'center';
                } else {
                    const marketOptions = document.createElement('div');
                    marketOptions.setAttribute('id', 'marketOptions');
                    const marketVerticalDivisory = document.createElement('hr');
                    marketVerticalDivisory.setAttribute('class', 'vertical');
                    const marketChart = document.createElement('div');
                    marketChart.setAttribute('id', 'marketChart');
                    const marketOverview = document.createElement('p');
                    marketOverview.setAttribute('id', 'marketOverview');
                    marketChart.append(marketOverview);
                    marketPainel.append(marketOptions, marketVerticalDivisory, marketChart);
                    // Items Options
                    const selectItem = document.createElement('select');
                    selectItem.setAttribute('id', 'itemCategories');
                    selectItem.setAttribute('name', 'itemCategories');
                    selectItem.addEventListener('change', (e) => { getItemOrder(e, itemsResponse); });
                    const selectLabel = document.createElement('option');
                    selectLabel.innerText = 'Select an item...';
                    selectLabel.setAttribute('disabled', true);
                    selectLabel.setAttribute('selected', true);
                    const itemCategories = itemsResponse.map(item => {
                        const itemBlock = document.createElement('option');
                        itemBlock.setAttribute('value', item.item_id);
                        itemBlock.innerText = item.name;
                        return itemBlock;
                    });
                    selectItem.append(selectLabel, ...itemCategories);
                    // Options others Funcinalities
                    const storageMetersButton = document.createElement('button');
                    storageMetersButton.innerText = 'Storage Meters';
                    const assets = await getAssets();
                    const marketExit = document.createElement('button');
                    marketExit.setAttribute('id', 'marketExit');
                    marketExit.innerText = 'Exit Market';
                    marketExit.addEventListener('click', getMarket);
                    marketOptions.append(selectItem, storageMetersButton, assets, marketExit);
                }
            })
            .catch(error => {
                console.log(error);
                marketPainel.innerText = error.message;
                marketPainel.style.justifyContent = 'center';
            });
    }
}

async function getAssets() {
    if (!document.getElementById('assets')) {
        const assets = document.createElement('div');
        assets.setAttribute('id', 'assets');
        const assetsTitle = document.createElement('h3');
        const assetsResponse = await fetch('/status').then(response => response.json());
        if (!assetsResponse.message) {
            assetsTitle.innerText = 'Current Assets:';
            const assetsCurrency = document.createElement('p');
            assetsCurrency.innerText = `Currency: ${assetsResponse.currency}¢`;
            const assetsFreeSpace = document.createElement('p');
            assetsFreeSpace.innerText = `Inventory free space: ${assetsResponse.inventoryCap - assetsResponse.count}`;
            assets.append(assetsTitle, assetsCurrency, assetsFreeSpace);
        } else {
            assetsTitle.innerText = assetsResponse.message;
        }
        return assets;
    } else {
        const assetsResponse = await fetch('/status').then(response => response.json());
        const assets = document.getElementById('assets');
        const assetsCurrency = document.querySelector('#assets p:nth-of-type(1)');
        const assetsFreeSpace = document.querySelector('#assets p:nth-of-type(2)');
        assetsCurrency.innerText = `Currency: ${assetsResponse.currency}¢`;
        assetsFreeSpace.innerText = `Inventory free space: ${assetsResponse.inventoryCap - assetsResponse.count}`;
        return assets;
    }
}

function getItemOrder(event, items) {
    console.log(event.target.value);
    const marketChart = document.getElementById('marketChart');
    const marketOverview = document.getElementById('marketOverview');
    const itemId = parseInt(event.target.value);
    if (items.message !== undefined) {
        marketChart.innerText = 'Unable to get item orders.';
        marketChart.style.textAlign = 'center';
    } else {
        try {
            const item = {};
            items.forEach(itemObj => {
                if (itemObj.item_id === itemId) {
                    item.id = itemObj.item_id;
                    item.name = itemObj.name;
                    item.description = itemObj.description;
                    item.price = itemObj.market_price;
                    item.qty = itemObj.market_qty;
                    console.log(item);
                    return item;
                }
            });
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
            const marketQtyLabel = document.createElement('div');
            const marketQtyName = document.createElement('div');
            marketQtyName.textContent = 'Qty: ';
            const marketQty = document.createElement('input');
            marketQty.id = 'marketQty';
            marketQty.value = 1;
            marketQtyLabel.append(marketQtyName, marketQty);
            orderBtns.appendChild(buyBt);
            orderBtns.appendChild(sellBt);
            const orderLabel = document.createElement('div');
            orderLabel.setAttribute('id', 'orderLabel');
            orderLabel.appendChild(orderBtns);
            orderLabel.appendChild(marketQtyLabel);
            const itemPrice = document.createElement('span');
            itemPrice.textContent = `Price: ${item.price}¢ each`;
            marketChart.insertBefore(itemName, marketOverview);
            marketChart.insertBefore(orderLabel, marketOverview);
            marketChart.insertBefore(itemPrice, marketOverview);
            buyBt.addEventListener('click', function (e) { tradeItem('add', parseInt(marketQty.value), parseInt(itemId)); });
            sellBt.addEventListener('click', function (e) { tradeItem('remove', parseInt(marketQty.value), parseInt(itemId)); });
        } catch (error) {
            console.log(error);
            marketChart.innerText = 'Unable to get item orders.';
            marketChart.style.textAlign = 'center';
        }
    }
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
    setTimeout(() => {
        if (document.getElementById('itemList')) {
            getItemStack(true);
        }
        if (document.getElementById('dashboard')) {
            getDashboard(true);
        }
        getAssets();
    }, 500);
}
function getResearch(refresh) {
    const painel = document.getElementById('painel');
    let researchPainel;
    let doFecth = true;
    if (document.getElementById('research')) {
        researchPainel = document.getElementById('research');
        if (!refresh) {
            doFecth = false;
            painel.removeChild(researchPainel);
        }
    } else {
        researchPainel = document.createElement('div');
        researchPainel.setAttribute('id', 'actions');
        researchPainel.setAttribute('class', 'mainColor mainGaps');
        painel.appendChild(researchPainel);
    }
}

function getChat(refresh) {
    const painel = document.getElementById('painel');
    let chat = document.getElementById('chat');
    if (!chat) {
        chat = document.createElement('div');
        chat.setAttribute('id', 'chat');
        chat.setAttribute('class', 'mainColor mainGaps');
        const chatTitle = document.createElement('div');
        chatTitle.innerText = 'Communication';
        chatTitle.setAttribute('id', 'chatTitle');
        const chatChart = document.createElement('div');
        const chatDivisory = document.createElement('hr');
        chatChart.setAttribute('id', 'chatChart');
        const chatInput = document.createElement('textarea');
        chatInput.setAttribute('id', 'chatInput');
        chatInput.setAttribute('placeholder', 'Type your message...');
        chatInput.setAttribute('autocomplete', 'off');
        const chatMessages = document.createElement('div');
        chatMessages.setAttribute('id', 'chatMessages');
        setupDragging(chat, chatTitle);
        chat.replaceChildren(chatTitle, chatDivisory, chatChart);
        chatChart.replaceChildren(chatMessages, chatInput);
        setWindowResizable(chat);
        painel.appendChild(chat);
        setWindowPosition(chat);
    }
    if (refresh) {
        try {
            const socket = connectSocket();
            const chatInput = document.getElementById('chatInput');
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const message = chatInput.value;
                    if (message) {
                        socket.emit('message', message);
                        chatInput.value = '';
                    }
                }
            });
        } catch (error) {
            console.log(error);
            const chatChart = document.getElementById('chatChart');
            chatChart.style.textAlign = 'center';
            chatChart.innerText = 'Unable to connect to chat server.';
        }
    } else {
        if (chat.style.display === 'none') {
            chat.style.display = 'flex';
        } else {
            chat.style.display = 'none';
        }
    }
}

function setupDragging(window, windowDragElement) {
    let isDragging = false;
    let offsetX, offsetY;

    windowDragElement.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', drag);

    function startDrag(e) {
        isDragging = true;
        document.body.style.userSelect = 'none';
        windowDragElement.style.cursor = 'grabbing';
        offsetX = e.clientX - window.offsetLeft;
        offsetY = e.clientY - window.offsetTop;
    }

    function stopDrag() {
        document.body.style.userSelect = 'auto';
        windowDragElement.style.cursor = 'auto';
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            window.style.left = `${e.clientX - offsetX}px`;
            window.style.top = `${e.clientY - offsetY}px`;
        }
    }
}

function setWindowResizable(window) {
    const resizeTop = document.createElement('div');
    const resizeTopLeft = document.createElement('div');
    const resizeTopRight = document.createElement('div');
    const resizeLeft = document.createElement('div');
    const resizeRight = document.createElement('div');
    const resizeBottom = document.createElement('div');
    const resizeBottomLeft = document.createElement('div');
    const resizeBottomRight = document.createElement('div');
    resizeTop.classList.add('resize-handle', 'top');
    resizeTopLeft.classList.add('resize-handle', 'top-left');
    resizeTopRight.classList.add('resize-handle', 'top-right');
    resizeLeft.classList.add('resize-handle', 'left');
    resizeRight.classList.add('resize-handle', 'right');
    resizeBottom.classList.add('resize-handle', 'bottom');
    resizeBottomLeft.classList.add('resize-handle', 'bottom-left');
    resizeBottomRight.classList.add('resize-handle', 'bottom-right');
    window.appendChild(resizeTop);
    window.appendChild(resizeTopLeft);
    window.appendChild(resizeTopRight);
    window.appendChild(resizeLeft);
    window.appendChild(resizeRight);
    window.appendChild(resizeBottom);
    window.appendChild(resizeBottomLeft);
    window.appendChild(resizeBottomRight);
    setupResizing(window);

    function setupResizing(window) {
        const handles = window.querySelectorAll('.resize-handle');
        let startX, startY, startWidth, startHeight, startTop, startLeft;

        handles.forEach(handle => {
            handle.addEventListener('mousedown', initResize);

            function initResize(e) {
                e.preventDefault();
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(window).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(window).height, 10);
                startTop = parseInt(document.defaultView.getComputedStyle(window).top, 10);
                startLeft = parseInt(document.defaultView.getComputedStyle(window).left, 10);

                document.body.style.userSelect = 'none';

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            }

            function resize(e) {
                if (handle.classList.contains('right') || handle.classList.contains('bottom-right') || handle.classList.contains('top-right')) {
                    const width = startWidth + (e.clientX - startX);
                    window.style.width = `${Math.max(400, width)}px`;
                }
                if (handle.classList.contains('bottom') || handle.classList.contains('bottom-right') || handle.classList.contains('bottom-left')) {
                    const height = startHeight + (e.clientY - startY);
                    window.style.height = `${Math.max(300, height)}px`;
                }
                if (handle.classList.contains('left') || handle.classList.contains('top-left') || handle.classList.contains('bottom-left')) {
                    const width = startWidth - (e.clientX - startX);
                    window.style.width = `${Math.max(400, width)}px`;
                    (e.clientX - startX < 0) ? window.style.left = `${e.clientX}px` : window.style.left = `${startLeft - 1}px`;
                }
                if (handle.classList.contains('top') || handle.classList.contains('top-left') || handle.classList.contains('top-right')) {
                    const height = startHeight - (e.clientY - startY);
                    window.style.height = `${Math.max(300, height)}px`;
                    if (e.clientY - startY < 0) window.style.top = `${e.clientY}px`;
                }
            }

            function stopResize() {
                delete document.body.style.userSelect;
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
            }
        });
    }
}

function setWindowPosition(window) {
    const main = document.getElementsByTagName('main')[0];
    const x = main.offsetWidth - window.offsetWidth + 70;
    const y = main.offsetHeight - window.offsetHeight - 70;
    console.log(x, y);
    window.style.left = `${x}px`;
    window.style.top = `${y}px`;
}

function connectSocket() {
    // eslint-disable-next-line no-undef
    const socket = io();
    socket.on('connect', () => {
        console.log(socket);
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
    socket.on('welcome', (message) => {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('p');
        messageElement.innerText = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    socket.on('error', (message) => {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('p');
        messageElement.innerText = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    socket.on('message', (message) => {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('p');
        messageElement.classList.add('message');
        messageElement.innerText = `${message.username}: ${message.content}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    return socket;
}
