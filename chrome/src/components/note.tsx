// packages
import { useEffect, useState } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';

export const Note = () => {
	const { activeTab, activeList, todoList, handleUpdate } = useTodoList();
	const [listName, setListName] = useState<string>(todoList?.[activeTab]?.lists?.[activeList].name);

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
			<div className={`nm-content__title nm-mg-${todoList?.[activeTab]?.color}`}>
				<input className='nm-content__input' type='text' value={listName} onChange={(e) => setListName(e.target.value)} onBlur={handleRenameList} placeholder='Untitled note' />
				<strong>{todoList?.[activeTab]?.name}</strong>
			</div>
			<div className={`nm-note nm-bg-${todoList?.[activeTab]?.color}`}>
				<div className='nm-notes'>
					items
				</div>
			</div>
		</div>
	);
}