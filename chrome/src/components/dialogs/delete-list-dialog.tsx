//import React from 'react'
// utils
import { getLocalization } from '../../utils';
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';


export const DeleteListDialog = () => {
	const { closeModal } = useModal();
	const { lang, activeTab, activeList, todoList, handleUpdate } = useTodoList();
	const hasOnlyOneList = Object.keys(todoList?.[activeTab]?.lists).length === 1;
	const listName = todoList?.[activeTab]?.lists?.[activeList].name;

	const handleDeleteList = () => {
		handleUpdate('deleteList', { tabId: activeTab, listId: activeList }); // handles setting active tab & list already
		closeModal();
	}

	return (
		<>
			<header className='nm-dialog__header'>{hasOnlyOneList ? getLocalization(lang, 'h-delete_no') : <>{getLocalization(lang, 'h-delete', listName)} Delete "{listName}"?</>}</header>
			<div className='nm-dialog__body'>
				<center>
					{hasOnlyOneList ? (<>
						<strong>{getLocalization(lang, 't-delete_no_label')}</strong> {getLocalization(lang, 't-delete_no_more')}
					</>) : (<>
						<strong>{getLocalization(lang, 't-delete_label')}</strong>
					</>)}
				</center>
			</div>
			<footer className='nm-dialog__footer'>
				{hasOnlyOneList ? (<button onClick={closeModal} className='nm-button nm-button--outline nm-hover'>
					{getLocalization(lang, 'btn-delete_got')}
				</button>) : (<>
					<button onClick={handleDeleteList} className='nm-button nm-button--danger nm-hover'>
						{getLocalization(lang, 'btn-delete_yes')}
					</button>
					<button onClick={closeModal} className='nm-button nm-button--danger-outline nm-hover'>
						{getLocalization(lang, 'btn-delete_no')}
					</button>
				</>)}
			</footer>
		</>
	);
}