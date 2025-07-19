// packages
import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
// types
import { TodoItem } from '../contexts/todo.context';
// hooks
import { useTodoList } from '../contexts/todo.context';
// components
import { Editable, EditableLine } from './editable';
import { SaveButton } from './buttons';

interface EditorProps {
	items: TodoItem[];
}

export const Editor = ({ items }: EditorProps) => {
	const { activeTab, activeList, todoList, setTodoList } = useTodoList();
	const [lines, setLines] = useState<EditableLine[]>([]);
	const editorRef = useRef<HTMLDivElement>(null);
	const lineRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const saveRef = useRef<HTMLDivElement>(null);
	const isSelectAll = useRef(false);
	/*const { handleUpdate } = useTodoList();*/

	const getVisibleText = (html: string) => {
		const temp = document.createElement('div');
		temp.innerHTML = html;
		return temp.textContent || '';
	};

	const placeCursorAtOffset = (el: HTMLElement, offset: number) => {
		const sel = window.getSelection();
		const range = document.createRange();
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
		let currentNode = walker.nextNode();
		let currentOffset = offset;
		while (currentNode) {
			const len = currentNode.textContent?.length || 0;
			if (currentOffset <= len) {
				range.setStart(currentNode, currentOffset);
				break;
			}
			currentOffset -= len;
			currentNode = walker.nextNode();
		}
		if (!currentNode) {
			el.focus();
			range.selectNodeContents(el);
			range.collapse(false);
		}
		sel?.removeAllRanges();
		sel?.addRange(range);
	};

	const getCaretOffsetInLine = (el: HTMLElement) => {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return 0;
		const range = sel.getRangeAt(0);
		const preRange = range.cloneRange();
		preRange.selectNodeContents(el);
		preRange.setEnd(range.startContainer, range.startOffset);
		return preRange.toString().length;
	};

	const handleInput = (id: string, html: string) => {
		if (isSelectAll.current) {
			isSelectAll.current = false;
			setLines([{ id: nanoid(), html, completed: false, indent: 1 }]);
		} else {
			setLines((prev) => prev.map((line) => (line.id === id ? { ...line, html } : line)));
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
		const index = lines.findIndex(line => line.id === id);
		const ref = lineRefs.current[id];
		if (!ref) return;
		const selection = document.getSelection();
		if (!selection || selection.rangeCount === 0) return;
		const offset = getCaretOffsetInLine(ref);
		/*if (isSelectAll.current && (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter' || e.key.length === 1)) {
			e.preventDefault();
			isSelectAll.current = false;
			let newLine: EditableLine = { id: nanoid(), html: '', completed: false, indent: 1 };
			if (e.key === 'Backspace' || e.key === 'Delete') {
				setLines([newLine]);
			} else if (e.key === 'Enter') {
				const newLine0: EditableLine = { id: nanoid(), html: '', completed: false, indent: 1 };
				setLines([newLine0, newLine]);
			} else {
				newLine.html = e.key;
				setLines([newLine]);
			}
			requestAnimationFrame(() => {
				const el = lineRefs.current[newLine.id];
				if (el) placeCursorAtOffset(el, 1);
			});
			return;
		}*/
		if (e.key === 'Tab') {
			if (offset === 0) {
				// make indentation only when at front of line
				e.preventDefault();
				console.log('current indent:', lines[index].indent)
				setLines(prev => prev.map((line, i) => i === index ? { ...line, indent: Math.min(line.indent + 1, 5) } : line));
			} else {
				// if not at offset 0, tab to next line if next line exists
				if (index < lines.length - 1) {
					e.preventDefault();
					const below = lineRefs.current[lines[index + 1].id];
					if (below) { placeCursorAtOffset(below, 0); }
				}
			}
			return;
		}
		if (e.key === 'Backspace') {
			if (index === 0) return;
			if (!selection.isCollapsed && selection.toString()) {
				e.preventDefault();
				const updated = [...lines];
				updated[index].html = '';
				setLines(updated);
				return;
			}
			if (selection.anchorOffset === 0 && index > 0) {
				e.preventDefault();
				//const current = lines[index];
				/*if (current.indent > 1) {
					setLines(prev => prev.map((line, i) => i === index ? { ...line, indent: line.indent - 1 } : line));
					return;
				}*/
				const prevId = lines[index - 1].id;
				const currentHTML = lines[index].html;
				const prevHTML = lines[index - 1].html;
				const prevVisibleText = getVisibleText(prevHTML);
				const newHTML = prevHTML + currentHTML;
				setLines(prev => {
					const updated = [...prev];
					updated[index - 1].html = newHTML;
					updated.splice(index, 1);
					return updated;
				});
				requestAnimationFrame(() => {
					const el = lineRefs.current[prevId];
					if (el) placeCursorAtOffset(el, prevVisibleText.length);
				});
			}
		}
		if (e.key === 'Delete') {
			const end = getVisibleText(lines[index].html).length;
			const below = lineRefs.current[lines[index + 1].id];
			if (offset === end && below) {
				e.preventDefault();
				const newHtml = lines[index].html + lines[index + 1].html;
				setLines(prev => {
					const updated = [...prev];
					updated[index].html = newHtml;
					updated.splice(index + 1, 1);
					return updated;
				});
				requestAnimationFrame(() => {
					const el = lineRefs.current[lines[index].id];
					if (el) placeCursorAtOffset(el, end);
				});
			}
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			const range = document.getSelection()?.getRangeAt(0);
			if (!range) return;
			if (!selection.isCollapsed) {
				const html = lines[index].html
				const newHtml = html.substring(0, offset);
				const newLine = { id: nanoid(), html: html.substring(offset), completed: false, indent: lines[index].indent };
				const updated = [...lines];
				updated[index].html = newHtml;
				updated.splice(index + 1, 0, newLine);
				setLines(updated);
				return;
			}
			const beforeFragment = document.createRange();
			beforeFragment.setStart(ref, 0);
			beforeFragment.setEnd(range.startContainer, range.startOffset);
			const afterFragment = document.createRange();
			afterFragment.setStart(range.startContainer, range.startOffset);
			afterFragment.setEnd(ref, ref.childNodes.length);
			const container1 = document.createElement('div');
			container1.appendChild(beforeFragment.cloneContents());
			const container2 = document.createElement('div');
			container2.appendChild(afterFragment.cloneContents());
			let makeNewLine = false;
			// by default, take the indentation from current line
			let indent = lines[index].indent;
			if (container1.innerHTML === '') {
				// if pressed enter while current line has no text, move indent back
				indent = lines[index].indent - 1;
				// if indent at level 1, pressing enter causes new line below
				if (indent < 1) { indent = 1; makeNewLine = true; }
			} else {
				// if there is text in current line, make new line with current indent
				makeNewLine = true;
			}
			let newLine: EditableLine = { id: nanoid(), html: container2.innerHTML || '', completed: false, indent: indent };
			setLines(prev => {
				const updated = [...prev];
				updated[index] = { ...updated[index], html: container1.innerHTML || '', indent: indent };
				if (makeNewLine) updated.splice(index + 1, 0, newLine);
				return updated;
			});
			requestAnimationFrame(() => {
				const id = makeNewLine ? newLine.id : lines[index].id;
				const el = lineRefs.current[id];
				if (el) placeCursorAtOffset(el, 0);
			});
		} else if (e.key === 'ArrowUp' && index > 0) {
			e.preventDefault();
			const above = lineRefs.current[lines[index - 1].id];
			if (above) { placeCursorAtOffset(above, offset); }
		} else if (e.key === 'ArrowDown' && index < lines.length - 1) {
			e.preventDefault();
			const below = lineRefs.current[lines[index + 1].id];
			if (below) { placeCursorAtOffset(below, offset); }
		} else if(e.key === 'ArrowLeft' && offset === 0) {
			e.preventDefault();
			const above = lineRefs.current[lines[index - 1].id];
			if (above) { placeCursorAtOffset(above, getVisibleText(lines[index - 1].html).length); }
		} else if(e.key === 'ArrowRight' && offset === getVisibleText(lines[index].html).length) {
			const below = lineRefs.current[lines[index + 1].id];
			if(below) { placeCursorAtOffset(below, 0);	}
		}
	};

	/*const handlePaste = (id: string, clipboardHtml: string, clipboardText: string) => {
		const index = lines.findIndex(line => line.id === id);
		if (index === -1) return;
		const items = clipboardText.split(/\r?\n|<li>|<\/li>/g).map(s => s.trim()).filter(s => s);
		if (items.length <= 1) return;
		console.log(clipboardHtml);
		const newLines: EditableLine[] = items.map(text => ({ id: nanoid(), html: text, completed: false, indent: 1 }));
		setLines(prev => {
			const updated = [...prev];
			updated.splice(index, 1, ...newLines);
			return updated;
		});
		requestAnimationFrame(() => {
			const el = lineRefs.current[newLines[newLines.length - 1].id];
			if (el) placeCursorAtOffset(el, getVisibleText(newLines[newLines.length - 1].html).length);
		});
	};*/

	const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>, id: string) => {
		e.preventDefault();
		const text = e.clipboardData.getData('text/plain');
		const linesToInsert = text.split(/\r?\n/).filter(line => line.trim() !== '');
		const index = lines.findIndex(line => line.id === id);
		const updatedLines = [...lines];
		const current = updatedLines[index];
		updatedLines[index] = { ...current, html: linesToInsert[0], };
		const newLines: EditableLine[] = linesToInsert.slice(1).map((line) => ({ id: nanoid(), html: line, completed: false, indent: 1, order: 0 }));
		updatedLines.splice(index + 1, 0, ...newLines);
		setLines(updatedLines);
		requestAnimationFrame(() => {
			const el = lineRefs.current[newLines[newLines.length - 1].id];
			if (el) placeCursorAtOffset(el, getVisibleText(newLines[newLines.length - 1].html).length);
		});
	};

	const handleToggle = (id: string) => {
		setLines(prev => prev.map(line =>
			line.id === id ? { ...line, completed: !line.completed } : line
		));
	};

	const handleSaveToStorage = (mode: string) => {
		console.log('save called by', mode);
		//console.log('instorage,list is', todoList);
		if (mode === 'interval') {
			console.log(saveRef)
			saveRef.current?.oncontextmenu;
			setTimeout(() => {
				saveRef?.current?.onclick;
			}, 1000);
		}
		const updated: TodoItem[] = lines.map(line => ({
			id: line.id,
			text: line.html,
			completed: line.completed,
			indent: line.indent
		}));
		const temp = todoList;
		temp[activeTab].lists[activeList].items = updated;
		setTodoList(temp);
	}

	useEffect(() => {
		// save every 2 minutes if extension active
		intervalRef.current = setInterval(() => {
			if (document.visibilityState === 'visible') { handleSaveToStorage('interval'); }
		}, 2 * 60 * 1000);
		// save when clicking outside of editor!!! MUST
		const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
			if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
				handleSaveToStorage('===FIRST: OUTSIDE CLICK===');
			}
		}
		// save when window closing and if hidden
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden') { handleSaveToStorage('documenthidden'); }
		}
		window.addEventListener('beforeunload', () => handleSaveToStorage('windowunload'));
		document.addEventListener('visibilitychange', handleVisibilityChange);
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			window.removeEventListener('beforeunload', () => handleSaveToStorage('windowunload'));
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			document.removeEventListener('mousedown', handleOutsideClick);
		}
	}, [todoList, lines]);

	/*useEffect(() => {
		const handleSelectionChange = () => {
			const selection = document.getSelection();
			if (!selection || selection.rangeCount === 0) {
				isSelectAll.current = false;
				return;
			}
			const range = selection.getRangeAt(0);
			const start = range.startContainer;
			const end = range.endContainer;
			const allInside = Object.values(lineRefs.current).some(ref => {
				return ref && ref.contains(start) && ref.contains(end);
			});
			isSelectAll.current = selection.toString().length > 0 && allInside;
			console.log(isSelectAll.current);
		};
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key.toLowerCase() === 'a') {
				const activeEl = document.activeElement;
				if (activeEl && Object.values(lineRefs.current).includes(activeEl as HTMLDivElement)) {
					e.preventDefault();
					const sel = window.getSelection();
					sel?.removeAllRanges();
					const range = document.createRange();
					const container = document.querySelector('#editor');
					if (container) {
						range.selectNodeContents(container);
						sel?.addRange(range);
						isSelectAll.current = true;
					}
				}
			}
		}
		document.addEventListener('keydown', handleGlobalKeyDown);
		document.addEventListener('selectionchange', handleSelectionChange);
		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown);
			document.removeEventListener('selectionchange', handleSelectionChange);
		}
	}, []);*/

	useEffect(() => {
		//console.log('is being updated?', todoList)
	}, [todoList]);

	useEffect(() => {
		if (items) {
			//console.log('initial setting list', activeList, items)
			const initial = items.map(item => ({
				id: item.id,
				html: item.text,
				completed: item.completed,
				indent: item.indent ?? 1,
			}));
			setLines(initial);
		}
	}, [items]);

	return (
		<>
			<div ref={editorRef} id='editor' className='nm-note__list nm-layer'>
				{lines.map((line) => (
					<Editable key={line.id} id={line.id} html={line.html} completed={line.completed} indent={line.indent} onInput={handleInput} onKeyDown={handleKeyDown} onPaste={handlePaste} onToggle={handleToggle} setRef={el => (lineRefs.current[line.id] = el)} />
				))}
			</div>
			<div className='nm-note__end' />
			<SaveButton onSave={() => handleSaveToStorage('button')} />
		</>
	);
}