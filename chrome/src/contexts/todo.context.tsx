// packages
import { nanoid } from 'nanoid';
import { createContext, useContext, useState, useEffect } from 'react';

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
				items: TodoItem[];
			};
		};
	};
}

interface TodoListContextType {
	activeTab: string;
	activeList: string;
	todoList: TodoList;
	setActiveTab: (tabId: string) => void;
	setActiveList: (listId: string) => void;
	setTodoList: (todoList: TodoList) => void;
	handleUpdate: (action: string, payload: any) => void;
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
	const [todoList, setTodoList] = useState<TodoList>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null | undefined>(null);

	useEffect(() => {
		setIsLoading(true);
		const getTodoList = async () => {
			try {
				console.log('getting list from context')
				chrome.runtime.sendMessage({ action: 'getTodoList' }, (response) => {
					if (chrome.runtime.lastError) {
						console.error('Error sending message:', chrome.runtime.lastError);
					} else {
						// handle the response
						if (!response.todoList || Object.keys(response.todoList).length === 0) {
							const firstId = nanoid();
							const newTodoList = {
								[firstId]: {
									name: 'First Tab',
									color: 'o',
									mark: 'x',
									order: 0,
									lists: {
										'1': {
											name: 'Guide to using noto maki pt. 1',
											note: 'grid-dot',
											items: [
												{ id: nanoid(), text: 'Hello there.', completed: true, indent: 1 },
												{ id: nanoid(), text: 'You can start by typing your to-do items here!', completed: false, indent: 1 },
												{ id: nanoid(), text: 'At the start of a line, press "tab" to indent a line. Can only indent up to 4 times (5 levels).', completed: false, indent: 1 },
												{ id: nanoid(), text: 'I am at level 2!', completed: false, indent: 2 },
												{ id: nanoid(), text: 'I am at level 3!', completed: false, indent: 3 },
												{ id: nanoid(), text: 'I am at level 4!', completed: false, indent: 4 },
												{ id: nanoid(), text: 'I am at level 5! Now press backspace to go back!', completed: false, indent: 5 },
												{ id: nanoid(), text: 'You can perform basic formatting to your text: <b>bolding</b> (ctrl+b/cmd+b), <i>italicizing</i> (ctrl+i/cmd+i), and <u>underlining</u> (ctrl+u/cmd+u).', completed: false, indent: 1 },
												{ id: nanoid(), text: '<u><b>Please click the right arrow sign</b></u> above to go to the next page. There is a little guide there!', completed: false, indent: 1 },
											]
										},
										'2': {
											name: 'Guide to using noto maki pt. 2',
											note: 'grid-dot',
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
										},
										'3': {
											name: 'Untitled note #3',
											note: 'grid-dot',
											items: [
												{ id: nanoid(), text: 'Item #1', completed: false, indent: 1 },
												{ id: nanoid(), text: 'Item #2', completed: false, indent: 1 },
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

	const handleSetTodoList = async (newTodoList: TodoList) => {
		console.log('calling to save to storage');
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
			let nextTabId = '';
			let nextListId = '';
			switch (action) {
				case 'addTab':
					nextTabId = nanoid();
					const newTabName = payload.tabName || `Tab #${nextTabId}`;
					const newOrder = Object.keys(todoList).length;
					updated[nextTabId] = {
						name: newTabName,
						color: payload.color || 'o',
						mark: 'x',
						order: newOrder,
						lists: {
							'1': {
								note: 'grid-dot',
								name: 'Untitled note #1',
								items: [{ id: nanoid(), text: 'Item #1', completed: false, indent: 1 }]
							}
						}
					};
					break;
				case 'renameTab':
					updated[payload.tabId].name = payload.newName;
					nextTabId = payload.tabId;
					break;
				case 'deleteTab':
					delete updated[payload.tabId];
					const normalized = normalizeTabOrders(updated);
					nextTabId = getFirstTabId(normalized);
					console.log(nextTabId);
					updated = normalized;
					break;
				case 'addList':
					nextListId = (Object.keys(todoList[payload.tabId]?.lists || {}).length + 1).toString();
					const newListName = `Untitled note #${nextListId}`;
					updated[payload.tabId].lists[nextListId] = {
						name: newListName,
						note: 'grid-dot',
						items: [{ id: nanoid(), text: 'Item #1', completed: false, indent: 1 }]
					};
					break;
				case 'renameList':
					updated[payload.tabId].lists[payload.listId].name = payload.newName;
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
				if (nextTabId !== '') {
					setActiveTab(nextTabId);
				} else if(nextListId !== '') {
					setActiveList(nextListId);
				}
			}
		} catch (error) {
			setError('Failed to update');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<TodoListContext.Provider value={{ activeTab, activeList, todoList, setActiveTab, setActiveList, setTodoList: handleSetTodoList, handleUpdate, isLoading, error }}>
			{children}
		</TodoListContext.Provider>
	);
};

export default TodoListContext;