chrome.action.onClicked.addListener(function (tab) {
	chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	const { action, payload } = request;
	console.log('received message: ', request);

	switch (action) {
		case 'getTodoList':
			chrome.storage.sync.get(['todoList']).then((result) => {
				sendResponse({ todoList: result.todoList || {} });
			}).catch((error) => {
				console.error('Error getting todos:', error);
				sendResponse({ error: 'Background response: Failed to get todos.' });
			});
			/*try {
				console.log('getting todo list...')
				const { todoList } = await chrome.storage.sync.get(['todoList']);
				console.log('todo list get:', todoList)
				sendResponse({ todoList: todoList || {} });
			} catch (error) {
				console.error('Error getting todo list:', error);
			}*/
			return true;
		case 'setTodoList':
			chrome.storage.sync.set({ todoList: payload.todoList }).then(() => {
				sendResponse({ success: true });
			}).catch((error) => {
				console.error('Error getting todos:', error);
				sendResponse({ error: 'Background response: Failed to set todos.' });
			});
			return true;
		case 'addTab':
			chrome.storage.sync.get(['todoList']).then((result) => {
				const updatedTodoList = result.todoList;
				console.log('adding tab check todo', updatedTodoList)
				if (updatedTodoList) {
					const nextTabId = (Object.keys(updatedTodoList).length + 1).toString();
					const newTabName = payload.tabName || `Tab #${nextTabId}`;
					const newOrder = Object.keys(updatedTodoList).length;
					updatedTodoList[nextTabId] = {
						name: newTabName,
						color: payload.color || 'o',
						order: newOrder,
						lists: {
							'1': {
								note: 'line-solid',
								name: 'Untitled note #1',
								items: [{ text: 'Item #1', completed: false, cursorPosition: 0 }]
							}
						}
					};
					chrome.storage.sync.set({ todoList: updatedTodoList }).then(() => {
						sendResponse({ todoList: updatedTodoList, success: true });
					}).catch((error) => {
						console.error('Error adding tab:', error);
						sendResponse({ error: 'Background response: Failed to add tab.' });
					});
				}
			}).catch((error) => {
				console.error('Error getting todos to adding tab:', error);
				sendResponse({ error: 'Background response: Failed to get todos and add tab.' });
			});
			return true;
		case 'renameTab':
			chrome.storage.sync.get(['todoList']).then((result) => {
				const updatedTodoList = result.todoList;
				console.log('renaming tab check todo', updatedTodoList)
				if (updatedTodoList && updatedTodoList[payload.tabId]) {
					updatedTodoList[payload.tabId].name = payload.newName;
					chrome.storage.sync.set({ todoList: updatedTodoList }).then(() => {
						sendResponse({ todoList: updatedTodoList, success: true });
					}).catch((error) => {
						console.error('Error renaming tab:', error);
						sendResponse({ error: 'Background response: Failed to rename tab.' });
					});
				}
			}).catch((error) => {
				console.error('Error getting todos to renaming tab:', error);
				sendResponse({ error: 'Background: Failed to get todos and rename tab.' });
			});
			return true;
		case 'addList':
			chrome.storage.sync.get(['todoList']).then((result) => {
				const updatedTodoList = result.todoList;
				console.log('adding list check todo', updatedTodoList)
				if (updatedTodoList) {
					const nextListId = (Object.keys(updatedTodoList[payload.tabId]?.lists || {}).length + 1).toString();
					const newListName = `Untitled note #${nextListId}`;
					updatedTodoList[payload.tabId].lists[nextListId] = {
						note: 'grid-dot',
						name: newListName,
						items: [{ text: 'Item #1', completed: false, cursorPosition: 0 }]
					};
					chrome.storage.sync.set({ todoList: updatedTodoList }).then(() => {
						sendResponse({ todoList: updatedTodoList, success: true });
					}).catch((error) => {
						console.error('Error adding list:', error);
						sendResponse({ error: 'Background response: Failed to add list.' });
					});
				}
			}).catch((error) => {
				console.error('Error getting todos to adding list:', error);
				sendResponse({ error: 'Background response: Failed to get todos and add list.' });
			});
			return true;
		case 'renameList':
			chrome.storage.sync.get(['todoList']).then((result) => {
				const updatedTodoList = result.todoList;
				console.log('renaming list check todo', updatedTodoList)
				if (updatedTodoList && updatedTodoList[payload.tabId] && updatedTodoList[payload.tabId].lists && updatedTodoList[payload.tabId].lists[payload.listId]) {
					updatedTodoList[payload.tabId].lists[payload.listId].name = payload.newName;
					chrome.storage.sync.set({ todoList: updatedTodoList }).then(() => {
						sendResponse({ todoList: updatedTodoList, success: true });
					}).catch((error) => {
						console.error('Error renaming list:', error);
						sendResponse({ error: 'Background response: Failed to rename list.' });
					});
				}
			}).catch((error) => {
				console.error('Error getting todos to renaming list:', error);
				sendResponse({ error: 'Background response: Failed to get todos and rename list.' });
			});
			return true;
		case 'changeColor':
			chrome.storage.sync.get(['todoList']).then((result) => {
				const updatedTodoList = result.todoList;
				console.log('changing color check todo', updatedTodoList)
				if (updatedTodoList && updatedTodoList[payload.tabId]) {
					updatedTodoList[payload.tabId].color = payload.newColor;
					chrome.storage.sync.set({ todoList: updatedTodoList }).then(() => {
						sendResponse({ todoList: updatedTodoList, success: true });
					}).catch((error) => {
						console.error('Error changing color:', error);
						sendResponse({ error: 'Background response: Failed to change color.' });
					});
				}
			}).catch((error) => {
				console.error('Error getting todos to changing color:', error);
				sendResponse({ error: 'Background: Failed to get todos and change color.' });
			});
			return true;
		case 'changeNote':
			chrome.storage.sync.get(['todoList']).then((result) => {
				const updatedTodoList = result.todoList;
				console.log('changing note check todo', updatedTodoList)
				if (updatedTodoList && updatedTodoList[payload.tabId] && updatedTodoList[payload.tabId].lists && updatedTodoList[payload.tabId].lists[payload.listId]) {
					updatedTodoList[payload.tabId].lists[payload.listId].note = payload.newNote;
					chrome.storage.sync.set({ todoList: updatedTodoList }).then(() => {
						sendResponse({ todoList: updatedTodoList, success: true });
					}).catch((error) => {
						console.error('Error changing color:', error);
						sendResponse({ error: 'Background response: Failed to change color.' });
					});
				}
			}).catch((error) => {
				console.error('Error getting todos to changing color:', error);
				sendResponse({ error: 'Background: Failed to get todos and change color.' });
			});
			return true;
		/*case 'addItem':
			console.log('adding item...')
			await addItem(payload.tabId, payload.listId, payload.item);
			sendResponse({ success: true });
			return true;*/
		default: return false;
	}
});

async function addItem(tabId, listId, item) {
	const { todoList } = await chrome.storage.sync.get((['todoList']));
	if (todoList && todoList[tabId] && todoList[tabId].lists && todoList[tabId].lists[listId]) {
		// need to push item in specific order later
		todoList[tabId].lists[listId].items.push(item);
		await chrome.storage.sync.set({ todoList });
	}
}