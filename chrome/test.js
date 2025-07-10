/*const initialData = {
	blocks: [
		{
			type: 'checklist',
			data: {
				items: [
					{ text: 'Item 1', checked: true },
					{ text: 'Item 2', checked: false },
					{ text: 'Item 3', checked: false }
				]
			}
		}
	]
};

const editor = new EditorJS({
	holder: 'editorjs',
	tools: {
		checklist: {
			class: Checklist,
			inlineToolbar: true,
		}
	},
	data: initialData
});*/

const container = document.getElementById('container');
const todoList = document.getElementById('todo');
const tabsList = document.getElementById('tabs');
const listTitle = document.getElementById('list');

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

function handleKeyDown(event) {
	if (event.key === 'Enter') {
		event.preventDefault();
		const currentItem = event.target.parentNode;
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
		todoList.appendChild(addTodoItem(textAfter));
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
			todoList = {
				'1': {
					name: 'School',
					color: 'o',
					lists: {
						'1': {
							name: 'Untitled note #1',
							items: [
								{ text: 'Item 1', completed: false },
								{ text: 'Item 2', completed: false }
							]
						},
						'2': {
							name: 'Untitled note #2',
							items: [
								{ text: 'Item 3', completed: true },
								{ text: 'Item 4', completed: false }
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
								{ text: 'apple', completed: true },
								{ text: 'banana', completed: false }
							]
						}
					}
				}
			};
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
		listTitle.value = listData.name;
		listData.items.forEach(item => {
			let thwitem = addTodoItem(item.text, item.completed);
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
	const colorSwatch = displaySwatches('nm-swatches', content, 'o', function(selectedColor) {
		color = selectedColor;
		console.log('returned color', color)
	});
	const footer = document.createElement('footer');
	footer.className = 'nm-dialog__footer';
	const button1 = document.createElement('button');
	button1.className = 'nm-button nm-button--outline';
	button1.textContent = 'Cancel';
	button1.addEventListener('click', function () { container.removeChild(dialog); });
	const button2 = document.createElement('button');
	button2.className = 'nm-button nm-button--solid';
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
	renamePopup.style.position = 'absolute';
	renamePopup.style.left = event.clientX + 'px';
	renamePopup.style.top = event.clientY + 'px';
	const input = document.createElement('input');
	input.className = 'nm-popup__input';
	input.type = 'text';
	input.value = todo[tabId].name;
	renamePopup.appendChild(input);
	const button = document.createElement('button');
	button.className = 'nm-button nm-button--solid';
	button.textContent = 'Rename';
	button.addEventListener('click', function () {
		renameTab(tabId, input.value);
		container.removeChild(renamePopup);
	});
	renamePopup.appendChild(button);
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
		todoList[nextTabId] = { name: newTabName, color: color || 'o', lists: {} };
		chrome.storage.sync.set({ todoList: todoList }, function () {
			loadTodoList(nextTabId);
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