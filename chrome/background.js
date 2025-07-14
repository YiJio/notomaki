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
			console.log('setting to do list', payload.todoList)
			chrome.storage.sync.set({ todoList: payload.todoList }).then(() => {
				sendResponse({ success: true });
			}).catch((error) => {
				console.error('Error getting todos:', error);
				sendResponse({ error: 'Background response: Failed to set todos.' });
			});
			return true;
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