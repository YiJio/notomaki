// packages
import { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
// utils
import { generateListName } from '../utils';
import { GUIDELINES_TAB, PATCHES_TAB } from '../constants';

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
				updated?: string;
				items: TodoItem[];
			};
		};
	};
}

interface TodoListContextType {
	activeTab: string;
	activeList: string;
	tabPopupOpen: string;
	hasUnsaved: boolean;
	todoList: TodoList;
	setActiveTab: (tabId: string) => void;
	setActiveList: (listId: string) => void;
	setTabPopupOpen: (tabId: string) => void;
	setHasUnsaved: (status: boolean) => void;
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
	const [hasUnsaved, setHasUnsaved] = useState(false);
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
		if (index === -1) return '';
		if (sorted.length === 1) return '';
		if (index > 0) return sorted[index - 1];
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
						const patchId = 'patches-reserved-key';
						const patchList = PATCHES_TAB;
						if (!response.todoList || Object.keys(response.todoList).length === 0) {
							const firstId = nanoid();
							const newTodoList = {
								[firstId]: GUIDELINES_TAB
							};
							// add patch
							newTodoList[patchId] = patchList;
							handleSetTodoList(newTodoList);
							setTodoList(newTodoList);
							// first install would need to set guidelines as active tab
							setActiveTab(firstId);
							localStorage.setItem('lastPatchSeen', '1.2.0');
						} else {
							// if there is patch list and user hasnt seen it yet,
							// then add it to end of todos and make it active tab
							chrome.runtime.sendMessage({ action: 'getPatchVersion' }, (resp) => {
								if (chrome.runtime.lastError) {
									console.error('Error sending message:', chrome.runtime.lastError);
								} else {
									const currVersion = resp.version;
									const seenVersion = localStorage.getItem('lastPatchSeen') || '1.1.0';
									console.log('got here version?', seenVersion, currVersion)
									if (currVersion !== seenVersion) {
										const updatedTodoList = { ...response.todoList };
										updatedTodoList[patchId] = patchList;
										updatedTodoList[patchId].order = Object.keys(response.todoList).length;
										console.log(updatedTodoList);
										setTodoList(updatedTodoList);
										handleSetTodoList(updatedTodoList);
										setActiveTab(patchId);
										localStorage.setItem('lastPatchSeen', currVersion);
									} else {
										console.log('patches already updated')
										setTodoList(response.todoList);
										const firstTabId = getFirstTabId(response.todoList);
										if (firstTabId) setActiveTab(firstTabId);
									}
								}
							});
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
		<TodoListContext.Provider value={{ activeTab, setActiveTab, activeList, setActiveList, tabPopupOpen, setTabPopupOpen, hasUnsaved, setHasUnsaved, todoList, setTodoList: handleSetTodoList, handleUpdate, getFirstListId, isLoading, error }}>
			{children}
		</TodoListContext.Provider>
	);
};

export default TodoListContext;