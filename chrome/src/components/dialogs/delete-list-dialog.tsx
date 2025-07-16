//import React from 'react'
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';


export const DeleteListDialog = () => {
	const { closeModal } = useModal();
	const { activeTab, activeList, todoList, handleUpdate } = useTodoList();
	const hasOnlyOneList = Object.keys(todoList?.[activeTab]?.lists).length === 1;
	const listName = todoList?.[activeTab]?.lists?.[activeList].name;

	const handleDeleteList = () => {
		handleUpdate('deleteList', { tabId: activeTab, listId: activeList }); // handles setting active tab & list already
		closeModal();
	}

	return (
		<>
			<header className='nm-dialog__header'>{hasOnlyOneList ? <>Stop right there!</> : <>Delete "{listName}"?</>}</header>
			<div className='nm-dialog__body'>
				<center>
					{hasOnlyOneList ? (<>
						<strong>You cannot delete your only note in this tab.</strong> Try adding a note you really want and come back to delete this one to get it out of the way.
					</>) : (<>
						<strong>Be careful with this action.</strong>
					</>)}
				</center>
			</div>
			<footer className='nm-dialog__footer'>
				{hasOnlyOneList ? (<button onClick={closeModal} className='nm-button nm-button--outline nm-hover'>Got it</button>) : (<>
					<button onClick={handleDeleteList} className='nm-button nm-button--danger nm-hover'>Yes, delete!!!</button>
					<button onClick={closeModal} className='nm-button nm-button--danger-outline nm-hover'>No, keep it</button>
				</>)}
			</footer>
		</>
	);
}