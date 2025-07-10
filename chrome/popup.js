const Inline = Quill.import('blots/inline');

class BoldBlot extends Inline {
	static blotName = 'bold';
	static tagName = 'strong';
}
class ItalicBlot extends Inline {
	static blotName = 'italic';
	static tagName = 'em';
}
class StrikethroughBlot extends Inline {
	static blotName = 'strikethrough';
	static tagName = 's';
}
class UnderlineBlot extends Inline {
	static blotName = 'underline';
	static tagName = 'u';
}

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(StrikethroughBlot);
Quill.register(UnderlineBlot);


/*const onClick = (selector, callback) => {
	document.querySelector(selector).addEventListener('click', callback);
};

onClick('#bold-button', () => {
	quill.format('bold', true);
});

onClick('#italic-button', () => {
	quill.format('italic', true);
});*/

//const quill = new Quill('#editor');

let title = document.getElementById('title');
title.addEventListener('click', function (event) {
	let isJP = title.innerHTML === 'ノート 巻';
	if (isJP) {
		title.classList.add('nm-header__title--en');
		title.innerHTML = 'noto maki';
	} else {
		title.classList.remove('nm-header__title--en');
		title.innerHTML = 'ノート 巻';
	}
});


let todoList = document.getElementById('todo');
function addTodoItem() {
	let item = document.createElement('div');
	item.className = 'nm-item';
	let check = document.createElement('div');
	check.className = 'nm-check';
	let checkbox = document.createElement('div');
	checkbox.className = 'nm-check__box';
	let input = document.createElement('input');
	input.type = 'checkbox';
	check.appendChild(input);
	check.appendChild(checkbox);
	item.appendChild(check);

	let quillEditor = document.createElement('div');
	item.appendChild(quillEditor);
	let quillInstance = new Quill(quillEditor, {
		modules: { toolbar: false },
	});
	todoList.appendChild(item);
	quillInstance.focus();
}

function focusNextEditor() {
	const editors = todoList.querySelectorAll('.ql-editor');
	const focusedIndex = Array.from(editors).indexOf(document.activeElement);
	if (focusedIndex < editors.length - 1) {
		editors[focusedIndex + 1].focus();
	}
}
function focusPrevEditor() {
	const editors = todoList.querySelectorAll('.ql-editor');
	const focusedIndex = Array.from(editors).indexOf(document.activeElement);
	if (focusedIndex > 0) {
		editors[focusedIndex - 1].focus();
	}
}



addTodoItem();



document.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowDown') {
		focusNextEditor();
		event.preventDefault();
	} else if (event.key === 'ArrowUp') {
		focusPrevEditor();
		event.preventDefault();
	} else if (event.key === 'Enter') {
		let activeEditor = null;
		const editors = todoList.querySelectorAll('.ql-editor');
		editors.forEach(editor => {
			if (document.activeElement === editor) activeEditor = Quill.find(editor);
		});
		console.log(activeEditor);
		/*if (activeEditor) {
			console.log(activeEditor)
			const range = activeEditor?.getSelection();
			const length = activeEditor?.getLength();
			console.log(range,range.index, length);
			if (range && range.index === activeEditor.getLength()) {
				addTodoItem();
				//event.preventDefault();
			} else {
				// Remove newline only if it's not at the end of the editor
				let text = activeEditor.getText();
				if (text.trim().endsWith('\n')) {
					activeEditor.deleteText(text.length - 1, 1);
				}
			}
		}*/
		const lastEditor = todoList.querySelectorAll('.nm-item > div')[todoList.querySelectorAll('.nm-item > div').length - 1];
		const quill = Quill.find(lastEditor);
		const editor = lastEditor.querySelector('.ql-editor');
		if (quill) {
			for (const child of editor.children) {
				console.log(child.tagName);
			}
			console.log(lastEditor)
			editor.removeChild(editor.lastElementChild);
			addTodoItem();
			event.preventDefault();
		}
	}
});



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