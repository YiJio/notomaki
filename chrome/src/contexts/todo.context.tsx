// packages
import { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
// utils
import { generateListName } from '../utils';

export interface TodoItem {
	id: string;
	text: string;
	completed: boolean;
	indent: number;
}

export interface TodoList {
	[tabId: string]: {
		name: string;
		color: string;
		mark: string;
		order: number;
		lists: {
			[listId: string]: {
				name: string;
				note: string;
				heading: string;
				items: TodoItem[];
			};
		};
	};
}

interface TodoListContextType {
	activeTab: string;
	activeList: string;
	tabPopupOpen: string;
	todoList: TodoList;
	setActiveTab: (tabId: string) => void;
	setActiveList: (listId: string) => void;
	setTabPopupOpen: (tabId: string) => void;
	setTodoList: (todoList: TodoList) => void;
	handleUpdate: (action: string, payload: any) => void;
	getFirstListId: (tabId: string) => string;
	isLoading: boolean;
	error: string | null | undefined;
}

const TodoListContext = createContext<TodoListContextType | null | undefined>(undefined);

export function useTodoList(): TodoListContextType {
	const context = useContext(TodoListContext);
	if (context === undefined || context === null) {
		throw new Error('useTodoList must be used within a TodoListProvider');
	}
	return context;
}

export const TodoListProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeTab, setActiveTab] = useState<string>('');
	const [activeList, setActiveList] = useState<string>('1');
	const [tabPopupOpen, setTabPopupOpen] = useState<string>('');
	const [todoList, setTodoList] = useState<TodoList>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null | undefined>(null);

	function normalizeTabOrders(todoList: TodoList): TodoList {
		const sorted = Object.entries(todoList).sort(([, a], [, b]) => a.order - b.order);
		const normalized: TodoList = {};
		sorted.forEach(([id, data], index) => {
			normalized[id] = { ...data, order: index };
		});
		return normalized;
	}

	function getFirstTabId(todoList: TodoList): string {
		const first = Object.entries(todoList).find(([, value]) => value.order === 0);
		return first?.[0] ?? '';
	}

	function getFirstListId(tabId: string): string {
		const sorted = Object.keys(todoList[tabId].lists).sort((a, b) => parseInt(a) - parseInt(b));
		return sorted[0];
	}

	function getNewListId(tabId: string): string {
		const maxId = Object.keys(todoList[tabId].lists).reduce((max, id) => {
			const num = parseInt(id, 10);
			return isNaN(num) ? max : Math.max(max, num);
		}, 0);
		return (maxId + 1).toString();
	}

	function getPrevListId(tabId: string, deletedId: string): string {
		const sorted = Object.keys(todoList[tabId].lists).sort((a, b) => parseInt(a) - parseInt(b));
		const index = sorted.indexOf(deletedId);
		if(index === -1) return '';
		if(sorted.length === 1) return '';
		if(index > 0) return sorted[index - 1];
		else { return sorted[1]; }
	}

	useEffect(() => {
		setIsLoading(true);
		const getTodoList = async () => {
			try {
				//console.log('getting list from context')
				chrome.runtime.sendMessage({ action: 'getTodoList' }, (response) => {
					if (chrome.runtime.lastError) {
						console.error('Error sending message:', chrome.runtime.lastError);
					} else {
						// handle the response
						if (!response.todoList || Object.keys(response.todoList).length === 0) {
							const firstId = nanoid();
							const newTodoList = {
								[firstId]: {
									name: 'Guidelines', color: 'o', mark: 'x', order: 0,
									lists: {
										'1': {
											name: 'Guide to using noto maki pt. 1', note: 'grid-dot', heading: '',
											items: [
												{ id: nanoid(), text: 'Hello there.', completed: true, indent: 1 },
												{ id: nanoid(), text: 'You can start by typing your to-do items here!', completed: false, indent: 1 },
												{ id: nanoid(), text: 'At the start of a line, press "tab" to indent a line. Can only indent up to 4 times (5 levels).', completed: false, indent: 1 },
												{ id: nanoid(), text: 'I am at level 2!', completed: false, indent: 2 },
												{ id: nanoid(), text: 'I am at level 3!', completed: false, indent: 3 },
												{ id: nanoid(), text: 'I am at level 4!', completed: false, indent: 4 },
												{ id: nanoid(), text: 'I am at level 5! Press enter and you will go to next line with the previous indentation!', completed: false, indent: 5 },
												{ id: nanoid(), text: 'You can press enter to reduce your indentation if you have no text on the current line.', completed: false, indent: 4 },
												{ id: nanoid(), text: 'You can perform basic formatting to your text: <b>bolding</b> (ctrl+b/cmd+b), <i>italicizing</i> (ctrl+i/cmd+i), and <u>underlining</u> (ctrl+u/cmd+u).', completed: false, indent: 1 },
												{ id: nanoid(), text: '<u><b>Please click the right arrow sign</b></u> above to go to the next page. The little guide continues there!', completed: false, indent: 1 },
											]
										},
										'2': {
											name: 'Guide to using noto maki pt. 2', note: 'grid-dot', heading: '',
											items: [
												{ id: nanoid(), text: '<u><b>Like making maki rolls, you need to be patient and follow basic guidelines:</b></u>', completed: false, indent: 1 },
												{ id: nanoid(), text: '<b>Create a new tabby</b>: click on that + button on the left!', completed: false, indent: 2 },
												{ id: nanoid(), text: '<b>Rename a note</b>: type on the field next to your tab name at the top', completed: false, indent: 2 },
												{ id: nanoid(), text: '<b>Tabby popup menu 👀:</b> right-click on a tabby!', completed: false, indent: 2 },
												{ id: nanoid(), text: '<b>Rename a tabby</b>', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Delete a tabby 🙁</b> (must confirm!) ', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Reorder a tabby</b>', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Simple customization? 😮</b>: toolboxes on your right!', completed: false, indent: 2 },
												{ id: nanoid(), text: '<b>Changing a specific <u>note</u>\'s type</b>', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Changing a <u>tabby</u>\'s color</b>', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Changing a <u>tabby</u>\'s marking</b>', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Cycle your notes in this tab</b>: click the arrow signs at the top between the current date and time!', completed: false, indent: 2 },
												{ id: nanoid(), text: 'Note: It will only work if you have added new notes with that "New note +" button!', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Save your notes</b>: click the "Save" button if you ever want to.', completed: false, indent: 2 },
												{ id: nanoid(), text: 'Note: The extension auto saves it for you every 2 minutes, if you ever hide the side panel, or if you close the window.', completed: false, indent: 3 },
												{ id: nanoid(), text: '<b>Mark your to-do items complete by checking the checkmark at the front of each line!</b>', completed: false, indent: 1 },
												{ id: nanoid(), text: 'Happy to-do completing!', completed: true, indent: 1 },
											]
										}
									}
								}
							};
							handleSetTodoList(newTodoList);
							setTodoList(newTodoList);
							setActiveTab(firstId);
						} else {
							setTodoList(response.todoList);
							const firstTabId = getFirstTabId(response.todoList);
							if (firstTabId) setActiveTab(firstTabId);
						}
					}
				});
			} catch (error) {
				setError('Failed to get todo list');
			} finally {
				setIsLoading(false);
			}
		}
		getTodoList();
	}, []);

	const handleSetTodoList = async (newTodoList: TodoList) => {
		//console.log('calling to save to storage');
		setIsLoading(true);
		try {
			const response: any = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ action: 'setTodoList', payload: { todoList: newTodoList } }, resolve);
			});
			if (response.error) { setError(response.error); }
			else { setTodoList(newTodoList); }
		} catch (error) {
			setError('Failed to set todo list');
		} finally {
			setIsLoading(false);
		}
	}

	const handleUpdate = async (action: string, payload: any) => {
		setIsLoading(true);
		try {
			let updated = { ...todoList };
			let activeTabId = '';
			let activeListId = '';
			switch (action) {
				case 'addTab':
					activeTabId = nanoid();
					const newTabName = payload.tabName || `Tab #${activeTabId}`;
					const newOrder = Object.keys(todoList).length;
					updated[activeTabId] = {
						name: newTabName, color: payload.color || 'o', mark: 'x', order: newOrder,
						lists: {
							'1': {
								note: 'grid-dot', name: generateListName(), heading: '',
								items: [{ id: nanoid(), text: 'Item #1', completed: false, indent: 1 }]
							}
						}
					};
					break;
				case 'renameTab':
					updated[payload.tabId].name = payload.newName;
					activeTabId = payload.tabId;
					break;
				case 'deleteTab':
					delete updated[payload.tabId];
					const normalized = normalizeTabOrders(updated);
					activeTabId = getFirstTabId(normalized);
					activeListId = getFirstListId(activeTabId);
					updated = normalized;
					break;
				case 'addList':
					activeListId = getNewListId(payload.tabId);
					updated[payload.tabId].lists[activeListId] = {
						name: generateListName(), note: 'grid-dot', heading: '',
						items: [{ id: nanoid(), text: 'Item #1', completed: false, indent: 1 }]
					};
					break;
				case 'renameList':
					updated[payload.tabId].lists[payload.listId].name = payload.newName;
					break;
				case 'changeHeading':
					updated[payload.tabId].lists[payload.listId].heading = payload.newName;
					break;
				case 'deleteList':
					activeListId = getPrevListId(payload.tabId, payload.listId);
					delete updated[payload.tabId].lists[payload.listId];
					break;
				case 'changeColor':
					updated[payload.tabId].color = payload.newColor;
					break;
				case 'changeMark':
					updated[payload.tabId].mark = payload.newMark;
					break;
				case 'changeNote':
					updated[payload.tabId].lists[payload.listId].note = payload.newNote;
					break;
			}
			const response: any = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ action: 'setTodoList', payload: { todoList: updated } }, resolve);
			});
			if (response.error) { setError(response.error); }
			else {
				setTodoList(updated);
				if (activeTabId !== '') { setActiveTab(activeTabId); }
				if (activeListId !== '') { setActiveList(activeListId); }
			}
		} catch (error) {
			setError('Failed to update');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<TodoListContext.Provider value={{ activeTab, activeList, tabPopupOpen, todoList, setActiveTab, setActiveList, setTabPopupOpen, setTodoList: handleSetTodoList, handleUpdate, getFirstListId, isLoading, error }}>
			{children}
		</TodoListContext.Provider>
	);
};

export default TodoListContext;