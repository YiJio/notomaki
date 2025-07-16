//import React from 'react'
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';

interface DeleteTabDialogProps {
	tabId: string;
	tabName: string;
}

export const DeleteTabDialog = ({ tabId, tabName }: DeleteTabDialogProps) => {
	const { closeModal } = useModal();
	const { todoList, handleUpdate } = useTodoList();
	const hasOnlyOneTab = Object.keys(todoList).length === 1;

	const handleDeleteTab = () => {
		handleUpdate('deleteTab', { tabId }); // handles setting active tab & list already
		closeModal();
	}

	return (
		<>
			<header className='nm-dialog__header'>{hasOnlyOneTab ? <>Uh oh. Cannot roll away!</> : <>Delete "{tabName}"?</>}</header>
			<div className='nm-dialog__body'>
				<center>
					{hasOnlyOneTab ? (<>
						<strong>You cannot delete your only tab.</strong> Try adding a tab you really want and come back to delete this one to get it out of the way.
					</>) : (<>
						<strong>Be careful with this action.</strong> Deleting this tab will delete all notes associated with it!!!
					</>)}
				</center>
			</div>
			<footer style={{ flexDirection: 'column', gap: '8px' }} className='nm-dialog__footer'>
				{hasOnlyOneTab ? (<button onClick={closeModal} className='nm-button nm-button--outline nm-hover'>Got it</button>) : (<>
					<button onClick={handleDeleteTab} className='nm-button nm-button--danger nm-hover'>Yes, delete!!!</button>
					<button onClick={closeModal} className='nm-button nm-button--danger-outline nm-hover'>No, keep it</button>
				</>)}
			</footer>
		</>
	);
}