const container = document.getElementById('container');
const todoList = document.getElementById('todo');
const tabsList = document.getElementById('tabs');
const listTitle = document.getElementById('list');

const defaultList = {
	'1': {
		name: 'School',
		color: 'o',
		lists: {
			'1': {
				name: 'Untitled note #1',
				items: [
					{ text: 'Item 1', completed: false, cursorPos: 0 },
					{ text: 'Item 2', completed: false, cursorPos: 0 }
				]
			},
			'2': {
				name: 'Untitled note #2',
				items: [
					{ text: 'Item 3', completed: true, cursorPos: 0 },
					{ text: 'Item 4', completed: false, cursorPos: 0 }
				]
			}
		}
	},
	'2': {
		name: 'Personal',
		color: 'g',
		lists: {
			'1': {
				name: 'Personal #1',
				items: [
					{ text: 'apple', completed: true, cursorPos: 0 },
					{ text: 'banana', completed: false, cursorPos: 0 }
				]
			}
		}
	}
};

function addTodoItem(str, done = false) {
	const item = document.createElement('div');
	item.className = 'nm-item';
	let check = document.createElement('div');
	check.className = 'nm-check';
	let checkbox = document.createElement('div');
	checkbox.className = 'nm-check__box';
	const checkInput = document.createElement('input');
	checkInput.type = 'checkbox';
	checkInput.addEventListener('change', function () {
		item.querySelector('div[contenteditable="true"]').classList.toggle('nm-strikethrough');
		checkbox.classList.toggle('nm-check__box--x');
	});
	check.appendChild(checkbox);
	check.appendChild(checkInput);
	item.appendChild(check);
	const textInput = document.createElement('div');
	textInput.classList.add('nm-item__input');
	if (done) { textInput.classList.add('nm-strikethrough'); }
	textInput.contentEditable = true;
	textInput.textContent = str || '';
	textInput.addEventListener('keydown', handleKeyDown);
	item.appendChild(check);
	item.appendChild(textInput);
	textInput.focus();
	return item;
}

function addTodoItem2(todo, tabId, listId, listData, index, item) {
	const itemDiv = document.createElement('div');
	itemDiv.className = 'nm-item';
	let check = document.createElement('div');
	check.className = 'nm-check';
	let checkbox = document.createElement('div');
	checkbox.className = 'nm-check__box';
	const checkInput = document.createElement('input');
	checkInput.type = 'checkbox';
	checkInput.addEventListener('change', function () {
		updateItemCompletion(tabId, listId, index, this.checked);
		itemDiv.querySelector('div[contenteditable="true"]').classList.toggle('nm-strikethrough');
		checkbox.classList.toggle('nm-check__box--x');
	});
	check.appendChild(checkbox);
	check.appendChild(checkInput);
	itemDiv.appendChild(check);
	const textInput = document.createElement('div');
	textInput.classList.add('nm-item__input');
	if (item.completed) { textInput.classList.add('nm-strikethrough'); }
	textInput.contentEditable = true;
	textInput.textContent = item.text;
	textInput.addEventListener('input', (e) => handleContentChange(e, tabId, listId, index));
	textInput.addEventListener('keydown', (e) => handleKeyDown(e, todo, tabId, listId, index));
	textInput.focus();
	itemDiv.appendChild(check);
	itemDiv.appendChild(textInput);
	// Set cursor position after rendering
	/*if (index !== 0 && index === listData.items.length - 1) {
		const selection = window.getSelection();
		const range = document.createRange();
		range.setStart(textInput.childNodes[0], item.cursorPosition);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
		textInput.focus();
	}*/
	return itemDiv;
}


function updateItemDisplay(tabId, listId, itemId, updates) {
	const itemDiv = document.querySelector(`#tab${tabId}-list${listId} > div:nth-child(${itemId + 1})`);
	if (itemDiv) {
			const checkbox = itemDiv.querySelector('input[type="checkbox"]');
			const textInput = itemDiv.querySelector('div[contenteditable="true"]');
			checkbox.checked = updates.completed;
			textInput.textContent = updates.text;
			//Set cursor position
			const selection = window.getSelection();
			const range = document.createRange();
			range.setStart(textInput.childNodes[0], updates.cursorPosition);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
			textInput.focus();
	}
}


function handleContentChange(event, tabId, listId, index) {
	const textInput = event.target;
	const currentItem = textInput.parentNode;
	const text = textInput.textContent;
	const selection = window.getSelection();
	const range = selection.getRangeAt(0);
	const cursorPosition = range.startOffset;
	updateItem(text, tabId, listId, index);
}

function handleKeyDown(event, todo, tabId, listId, index) {
	if (event.key === 'Enter') {
		event.preventDefault();
		const currentItem = event.target.parentNode;
		console.log(tabId, listId, index)
		const textInput = event.target;
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const text = textInput.textContent;
		const cursorPosition = range.startOffset;
		console.log(range, text, cursorPosition)
		// Split the text at the cursor position
		const textBefore = text.substring(0, cursorPosition);
		let textAfter = text.substring(cursorPosition);
		textInput.textContent = textBefore.substring(0, cursorPosition);
		//todoList.appendChild(addTodoItem(textAfter));
		updateItem(textBefore, tabId, listId, index, cursorPosition);
		addItem(textAfter, false, 0, tabId, listId);
		/*const currentItem = event.target.parentNode;
		const textInput = event.target;
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const text = textInput.textContent;
		const cursorPosition = range.startOffset;
		// Split the text at the cursor position
		const textBefore = text.substring(0, cursorPosition);
		let textAfter = text.substring(cursorPosition);
		// Find the last word in textBefore
		const lastSpaceIndex = textBefore.lastIndexOf(' ');
		const lastWord = textBefore.substring(lastSpaceIndex + 1);
		//If cursor is in the middle of a word, move the rest of the word to the next line
		if (cursorPosition > 0 && textBefore.trim().length > 0 && textBefore.charAt(cursorPosition - 1) !== ' ') {
			textInput.textContent = textBefore.substring(0, lastSpaceIndex + 1);
			textAfter = lastWord + textAfter;
		}
		// Add new to-do item with cursor position
		addItem(textAfter, false, 0, '1', '1');*/
	} else if (event.key === 'Backspace') {
		const currentItem = event.target.parentNode;
		const textInput = event.target;
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const cursorPosition = range.startOffset;
		if (cursorPosition === 0) {
			event.preventDefault();
			const currentItem = event.target.parentNode;
			const prevItem = currentItem.previousElementSibling;
			if (prevItem) {
				const prevTextInput = prevItem.querySelector('div[contenteditable="true"]');
				const prevText = prevTextInput.textContent;
				const currentText = textInput.textContent;
				const newText = prevText + currentText;
				prevTextInput.textContent = newText;
				currentItem.remove();
				// Calculate the new cursor position
				const newCursorPosition = prevText.length;
				// Set cursor to the calculated position
				const newRange = document.createRange();
				newRange.setStart(prevTextInput.childNodes[0], newCursorPosition);
				newRange.collapse(true);
				selection.removeAllRanges();
				selection.addRange(newRange);
				prevTextInput.focus();
			}
		}
	} else if (event.key === 'ArrowUp') {
		event.preventDefault();
		const currentItem = event.target.parentNode;
		const prevItem = currentItem.previousElementSibling;
		if (prevItem) {
			prevItem.querySelector('div[contenteditable="true"]').focus();
		}
	} else if (event.key === 'ArrowDown') {
		event.preventDefault();
		const currentItem = event.target.parentNode;
		const nextItem = currentItem.nextElementSibling;
		if (nextItem) {
			nextItem.querySelector('div[contenteditable="true"]').focus();
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	loadTodoList();
	document.getElementById('add-tab').addEventListener('click', showAddTabDialog);
	document.addEventListener('click', handleOutsideClick);
});

function loadTodoList(tabId = '1') {
	chrome.storage.sync.get(['todoList'], function (result) {
		let todoList = result.todoList;
		// Set default data if todoList is undefined or empty
		if (!todoList || Object.keys(todoList).length === 0) {
			todoList = defaultList;
		}
		displayTabs(todoList, tabId);
		displayTodoList(todoList, tabId);
	});
}

function displayTabs(todo, activeTabId) {
	tabsList.innerHTML = '';
	for (const tabId in todo) {
		const tabData = todo[tabId];
		// update the tab names on the tabs list
		const tabDiv = document.createElement('button');
		tabDiv.className = `nm-tab${tabId === activeTabId ? ' nm-tab--active' : ''} nm-fg-${tabData.color}`;
		tabDiv.id = `tab-${tabId}`;
		tabDiv.innerHTML = `<span>${tabData.name}</span>`;
		tabDiv.addEventListener('contextmenu', function (event) {
			event.preventDefault();
			showRenameTabPopup(event, todo, tabId);
		});
		//tabDiv.style.display = tabId === activeTabId ? 'flex' : 'none';
		tabDiv.addEventListener('click', function () {
			displayTodoList(todo, tabId);
			displayTabs(todo, tabId);
		});
		tabsList.appendChild(tabDiv);
	}
}

function displayTodoList(todo, activeTabId) {
	todoList.innerHTML = ''; // Clear existing content
	const tabData = todo[activeTabId];
	for (const listId in tabData.lists) {
		const listData = tabData.lists[listId];
		const listDiv = document.createElement('div');
		listDiv.id = `tab${activeTabId}-list${listId}`;
		listTitle.value = listData.name;
		listData.items.forEach((item, index) => {
			//let thwitem = addTodoItem(item.text, item.completed);
			let thwitem = addTodoItem2(todo, activeTabId, listId, listData, index, item);
			listDiv.appendChild(thwitem);
		});
		todoList.appendChild(listDiv);
	}
}

function displaySwatches(className, parent, color = 'o', callback = null) {
	const swatches = ['o', 'y', 'g', 'm', 'b', 'p'];
	const element = document.querySelector(`.${className}`);
	if (!element) {
		const newElement = document.createElement('div');
		newElement.className = className;
		parent.appendChild(newElement);
		return updateSwatches(newElement, swatches, color, callback);
	} else {
		return updateSwatches(element, swatches, color, callback);
	}
}

function updateSwatches(element, swatches, color, callback = null) {
	element.innerHTML = '';
	for (let i = 0; i < swatches.length; i++) {
		const swatchDiv = document.createElement('button');
		swatchDiv.className = `nm-swatch${swatches[i] === color ? ' nm-swatch--active' : ''} nm-fg-${swatches[i]}`;
		swatchDiv.id = swatches[i];
		swatchDiv.addEventListener('click', function () {
			const selecteColor = swatches[i];
			updateSwatches(element, swatches, swatches[i], callback);
			callback(selecteColor);
		});
		element.appendChild(swatchDiv);
	}
	return color;
}

function showAddTabDialog() {
	const dialog = document.createElement('dialog');
	dialog.id = 'dialog-rename';
	dialog.className = 'nm-dialog';
	const wrapper = document.createElement('div');
	wrapper.className = 'nm-dialog__wrapper nm-frame';
	const header = document.createElement('header');
	header.className = 'nm-dialog__header';
	header.innerHTML = 'Create a new tab';
	const content = document.createElement('div');
	content.className = 'nm-dialog__body';
	const input = document.createElement('input');
	input.className = 'nm-dialog__input';
	input.type = 'text';
	input.value = 'Untitled tab';
	content.appendChild(input);
	let color = 'o';
	const colorSwatch = displaySwatches('nm-swatches', content, 'o', function (selectedColor) {
		color = selectedColor;
		console.log('returned color', color)
	});
	const footer = document.createElement('footer');
	footer.className = 'nm-dialog__footer';
	const button1 = document.createElement('button');
	button1.className = 'nm-button nm-button--outline nm-hover';
	button1.textContent = 'Cancel';
	button1.addEventListener('click', function () { container.removeChild(dialog); });
	const button2 = document.createElement('button');
	button2.className = 'nm-button nm-button--solid nm-hover';
	button2.textContent = 'Create';
	button2.addEventListener('click', function () {
		addTab(input.value, color);
		container.removeChild(dialog);
	});
	footer.appendChild(button1);
	footer.appendChild(button2);
	wrapper.appendChild(header);
	wrapper.appendChild(content);
	wrapper.appendChild(footer);
	dialog.appendChild(wrapper);
	container.appendChild(dialog);
}

function showRenameTabPopup(event, todo, tabId) {
	const existing = document.getElementById('popup-rename');
	if (existing) { container.removeChild(existing); }
	const renamePopup = document.createElement('div');
	renamePopup.id = 'popup-rename';
	renamePopup.className = 'nm-popup nm-frame';
	renamePopup.style.left = event.clientX + 'px';
	renamePopup.style.top = event.clientY + 'px';
	const input = document.createElement('input');
	input.className = 'nm-popup__input';
	input.type = 'text';
	input.value = todo[tabId].name;
	renamePopup.appendChild(input);
	const button1 = document.createElement('button');
	button1.className = 'nm-button nm-button--solid nm-hover';
	button1.textContent = 'Rename';
	button1.addEventListener('click', function () {
		renameTab(tabId, input.value);
		container.removeChild(renamePopup);
	});
	const button2 = document.createElement('button');
	button2.className = 'nm-button nm-button--danger-outline nm-hover';
	button2.textContent = 'Delete';
	button2.addEventListener('click', function () {
		deleteTab(tabId);
		container.removeChild(renamePopup);
	});
	const hint = document.createElement('small');
	hint.innerHTML = 'Be careful. Deleting this tab will delete all to-do lists associated with it.';
	renamePopup.appendChild(button1);
	renamePopup.appendChild(button2);
	renamePopup.appendChild(hint);
	container.appendChild(renamePopup);
}

function handleOutsideClick(event) {
	const renamePopup = document.getElementById('popup-rename');
	if (renamePopup && !renamePopup.contains(event.target)) {
		container.removeChild(renamePopup);
	}
}


function addTab(name, color) {
	chrome.storage.sync.get(['todoList'], function (result) {
		const todoList = result.todoList || {};
		const nextTabId = (Object.keys(todoList).length + 1).toString();
		const newTabName = name || `Tab #${nextTabId}`;
		todoList[nextTabId] = {
			name: newTabName, color: color || 'o', lists: {
				'1': {
					name: 'Untitled note #1',
					items: [{ text: 'Item #1', completed: false, cursorPos: 0 }]
				}
			}
		};
		chrome.storage.sync.set({ todoList: todoList }, function () {
			loadTodoList(nextTabId);
		});
	});
}

function deleteTab(tabId) {
	chrome.storage.sync.get(['todoList'], function (result) {
		const todoList = result.todoList;
		delete todoList[tabId];
		chrome.storage.sync.set({ todoList: todoList }, function () {
			loadTodoList();
		});
	});
}

function renameTab(tabId, newName) {
	chrome.storage.sync.get(['todoList'], function (result) {
		const todoList = result.todoList;
		todoList[tabId].name = newName;
		chrome.storage.sync.set({ todoList: todoList }, function () {
			loadTodoList(tabId);
		});
	});
}


function addItem(text = '', done = false, pos = 0, tabId = '1', listId = '1') {
	chrome.storage.sync.get(['todoList'], function (result) {
		const todoList = result.todoList || {};
		if (!todoList[tabId]) {
			todoList[tabId] = { name: `Tab ${tabId}`, lists: {} };
		}
		if (!todoList[tabId].lists[listId]) {
			todoList[tabId].lists[listId] = { items: [] };
		}
		const nextItemId = todoList[tabId].lists[listId].items.length;
		todoList[tabId].lists[listId].items.push({ text: text, completed: done, cursorPos: pos });
		chrome.storage.sync.set({ todoList: todoList }, function () {
			loadTodoList();
		});
	});
}

function updateItem(text = '', tabId = '1', listId = '1', index, cursorPos) {
	chrome.storage.sync.get(['todoList'], function (result) {
		const todoList = result.todoList || {};
		if (!todoList[tabId] || !todoList[tabId].lists[listId] || !todoList[tabId].lists[listId].items[index]) {
			console.error('Invalid tabId, listId, or index');
			return;
		}
		const updated = { text: text, completed: false, cursorPos: cursorPos };
		Object.assign(todoList[tabId].lists[listId].items[index], updated);
		chrome.storage.sync.set({ todoList: todoList }, function () {
			updateItemDisplay(tabId, listId, index, updated);
		});
	});
}

/*chrome.storage.sync.set({ todoList: updatedTodoList }, function () {
	// Optional: Add a success callback here
});*/

function handleError(error) {
	console.error('Error accessing Chrome storage:', error);
	//Display an error message to the user
	const errorDiv = document.createElement('div');
	errorDiv.textContent = 'Error loading to-do list. Please try again later.';
	document.body.appendChild(errorDiv);
}

function updateTimer() {
	const now = new Date();
	const options = {
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit'
	};
	const formattedTime = now.toLocaleString('en-US', options).replaceAll('/', '.').replace(',', ''); //
	document.getElementById('datetime').textContent = formattedTime;
}
setInterval(updateTimer, 1000);
updateTimer();