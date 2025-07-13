//import React from 'react'
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';

export const DeleteTabDialog = ({ tabId, tabName }: { tabId: string, tabName: string }) => {
	const { closeModal } = useModal();
	const { setActiveTab, setActiveList, handleUpdate } = useTodoList();

	const handleDeleteTab = () => {
		handleUpdate('deleteTab', { tabId });
		setActiveTab('1');
		setActiveList('1');
		closeModal();
	}

	return (
		<>
			<header className='nm-dialog__header'>Delete "{tabName}"?</header>
			<div className='nm-dialog__body'>
				<strong>Be careful with this action.</strong> Deleting this tab will delete all to-do lists associated with it!!!
			</div>
			<footer style={{ flexDirection:'column' }} className='nm-dialog__footer'>
				<button onClick={handleDeleteTab} className='nm-button nm-button--danger'>Yes, delete!!!</button>
				<button onClick={closeModal} className='nm-button nm-outline'>No, keep it</button>
			</footer>
		</>
	);
}
