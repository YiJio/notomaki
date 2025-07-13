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
                items: [{ text: 'Item #1', completed: false, cursorPos: 0 }]
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