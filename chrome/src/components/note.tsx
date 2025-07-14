// packages
import { useEffect, useState } from 'react';
// types
import { TodoItem } from '../contexts/todo.context';
// hooks
import { useTodoList } from '../contexts/todo.context';
// components
import { Editor } from './editor';
// constants
import { NOTE_TYPES } from './constants';

function getFromIndex(array: any[], fieldCheck: string, value: any, returnField?: string | null) {
	const index = array.findIndex((a) => a[fieldCheck] == value);
	if (returnField) return array[index][returnField];
	return array[index];
}

export const Note = () => {
	const { activeTab, activeList, todoList, setTodoList, handleUpdate } = useTodoList();
	const [listName, setListName] = useState<string>(todoList?.[activeTab]?.lists?.[activeList]?.name);
	const activeColor = todoList?.[activeTab]?.color;
	const activeNote = todoList?.[activeTab]?.lists?.[activeList]?.note;
	const noteShort = getFromIndex(NOTE_TYPES, 'key', activeNote)?.short;

	const handleRenameList = () => {
		handleUpdate('renameList', { tabId: activeTab, listId: activeList, newName: listName });
	}

	const handleUpdateItems = (tabId: string, listId: string, items: TodoItem[]) => {
		const updatedTodoList = { ...todoList };
		updatedTodoList[tabId] = {
			...updatedTodoList[tabId],
			lists: {
				...updatedTodoList[tabId]?.lists,
				[listId]: {
					...updatedTodoList[tabId]?.lists[listId],
					items: items
				}
			}
		};
		console.log('items to update',items)
		console.log('final update', updatedTodoList)
		setTodoList(updatedTodoList);
	}

	useEffect(() => {
		if(activeTab && activeList) {
			const newName: string = todoList?.[activeTab].lists[activeList].name;
			console.log('note page changed to:', newName)
			setListName(newName);
		}
	}, [activeTab, activeList]);

	return (
		<div className='nm-content'>
			<div className={`nm-content__title nm-mg-${activeColor}`}>
				<input className='nm-content__input nm-layer' type='text' value={listName} onChange={(e) => setListName(e.target.value)} onBlur={handleRenameList} placeholder='Untitled note' />
				/
				<strong className='nm-content__tab nm-layer'>{todoList?.[activeTab]?.name}</strong>
			</div>
			<div className={`nm-note nm-note--${noteShort} nm-bg-${activeColor}`}>
				<Editor tabId={activeTab} listId={activeList} items={todoList?.[activeTab]?.lists?.[activeList]?.items} onUpdateItems={handleUpdateItems} />
			</div>
		</div>
	);
}