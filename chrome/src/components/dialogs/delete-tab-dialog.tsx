//import React from 'react'
// utils
import { getLocalization } from '../../utils';
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';

interface DeleteTabDialogProps {
	tabId: string;
	tabName: string;
}

export const DeleteTabDialog = ({ tabId, tabName }: DeleteTabDialogProps) => {
	const { closeModal } = useModal();
	const { lang, todoList, handleUpdate } = useTodoList();
	const hasOnlyOneTab = Object.keys(todoList).length === 1;

	const handleDeleteTab = () => {
		handleUpdate('deleteTab', { tabId }); // handles setting active tab & list already
		closeModal();
	}

	return (
		<>
			<header className='nm-dialog__header'>{hasOnlyOneTab ? getLocalization(lang, 'h-delete_to') : <>{getLocalization(lang, 'h-delete', tabName)} Delete "{tabName}"?</>}</header>
			<div className='nm-dialog__body'>
				<center>
					{hasOnlyOneTab ? (<>
						<strong>{getLocalization(lang, 't-delete_to_label')}</strong> {getLocalization(lang, 't-delete_to_more')}
					</>) : (<>
						<strong>{getLocalization(lang, 't-delete_label')}</strong> {getLocalization(lang, 't-delete_tab_more')}
					</>)}
				</center>
			</div>
			<footer style={{ flexDirection: 'column', gap: '8px' }} className='nm-dialog__footer'>
				{hasOnlyOneTab ? (<button onClick={closeModal} className='nm-button nm-button--outline nm-hover'>
					{getLocalization(lang, 'btn-delete_got')}
				</button>) : (<>
					<button onClick={handleDeleteTab} className='nm-button nm-button--danger nm-hover'>
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