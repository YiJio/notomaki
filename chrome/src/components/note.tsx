// packages
import { useEffect, useState } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';
// constants
import { NOTE_TYPES } from './toolbox';

function getFromIndex(array: any[], fieldCheck: string, value: any, returnField?: string | null) {
	const index = array.findIndex((a) => a[fieldCheck] == value);
	if (returnField) return array[index][returnField];
	return array[index];
}

export const Note = () => {
	const { activeTab, activeList, todoList, handleUpdate } = useTodoList();
	const [listName, setListName] = useState<string>(todoList?.[activeTab]?.lists?.[activeList].name);
	const activeColor = todoList?.[activeTab]?.color;
	const activeNote = todoList?.[activeTab]?.lists?.[activeList]?.note;
	const noteShort = getFromIndex(NOTE_TYPES, 'key', activeNote)?.short;

	const handleRenameList = () => {
		handleUpdate('renameList', { tabId: activeTab, listId: activeList, newName: listName });
	}

	useEffect(() => {
		// better to do this once
		if(todoList) {
			setListName(todoList?.[activeTab]?.lists?.[activeList].name);
		}
	}, [todoList]);

	useEffect(() => {
		setListName(todoList?.[activeTab]?.lists?.[activeList].name);
	}, [activeTab, activeList]);

	return (
		<div className='nm-content'>
			<div className={`nm-content__title nm-mg-${activeColor}`}>
				<input className='nm-content__input' type='text' value={listName} onChange={(e) => setListName(e.target.value)} onBlur={handleRenameList} placeholder='Untitled note' />
				/
				<strong>{todoList?.[activeTab]?.name}</strong>
			</div>
			<div className={`nm-note nm-note--${noteShort} nm-bg-${activeColor}`}>
				<div className='nm-notes'>
					items
				</div>
			</div>
		</div>
	);
}