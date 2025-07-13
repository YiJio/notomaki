chrome.action.onClicked.addListener(function (tab) {
  //chrome.action.setBadgeText({text: 'On'});
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
});
/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateBadge') {
    chrome.action.setBadgeText({text: request.badgeText});
  }
});*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action, payload } = request;
  console.log('received message: ', request);

  switch (action) {
    case 'getTodoList':
      chrome.storage.sync.get(['todoList']).then((result) => {
        sendResponse({ todoList: result.todoList || {} });
      }).catch((error) => {
        console.error('Error getting todo list:', error);
        sendResponse({ error: 'Failed to get todo list' });
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
        console.error('Error getting todo list:', error);
        sendResponse({ error: 'Failed to set todo list' });
      });
      /*try {
        console.log('setting todo list...', request.payload.todoList);
        await chrome.storage.sync.set({ todoList: payload.todoList });
        console.log('todo list set successfully')
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error setting todo list:', error);
        sendResponse({ error: 'Failed to set todo list' });
      }*/
      return true;
    case 'renameTab':
      chrome.storage.sync.get(['todoList']).then((result) => {
        const todoList = result.todoList;
        if (todoList && todoList[tabId]) {
          todoList[tabId].name = newName;
          chrome.storage.sync.set({ todoList });
        }
        sendResponse({ success: true });
      }).catch((error) => {
        console.error('Error getting renaming tab:', error);
        sendResponse({ error: 'Failed to rename tab' });
      });
      /*try {
        console.log('renaming tab...')
        const { todoList } = await chrome.storage.sync.get((['todoList']));
        if (todoList && todoList[tabId]) {
          todoList[tabId].name = newName;
          await chrome.storage.sync.set({ todoList });
        }
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error getting renaming tab:', error);
        sendResponse({ error: 'Failed to rename tab' });
      }*/
      return true;
    /*case 'changeColor':
      console.log('changing color...')
      await changeColor(payload.tabId, payload.newColor);
      sendResponse({ success: true });
      return true;
    case 'addItem':
      console.log('adding item...')
      await addItem(payload.tabId, payload.listId, payload.item);
      sendResponse({ success: true });
      return true;*/
    default: return false;
  }
});

async function renameTab(tabId, newName) {
  const { todoList } = await chrome.storage.sync.get((['todoList']));
  if (todoList && todoList[tabId]) {
    todoList[tabId].name = newName;
    await chrome.storage.sync.set({ todoList });
  }
}

async function changeColor(tabId, newColor) {
  const { todoList } = await chrome.storage.sync.get((['todoList']));
  if (todoList && todoList[tabId]) {
    todoList[tabId].color = newColor;
    await chrome.storage.sync.set({ todoList });
  }
}

async function addItem(tabId, listId, item) {
  const { todoList } = await chrome.storage.sync.get((['todoList']));
  if (todoList && todoList[tabId] && todoList[tabId].lists && todoList[tabId].lists[listId]) {
    // need to push item in specific order later
    todoList[tabId].lists[listId].items.push(item);
    await chrome.storage.sync.set({ todoList });
  }
}