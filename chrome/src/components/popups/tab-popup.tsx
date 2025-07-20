// packages
import { useState } from 'react';
// utils
import { getLocalization } from '../../utils';
// hooks
import { useModal } from '../../contexts/modal.context';
import { usePopup } from '../../contexts/popup.context';
import { useTodoList } from '../../contexts/todo.context';
// components
import { DeleteTabDialog } from '../dialogs';

interface TabPopupProps {
	tabId: string;
	tabName: string;
	onRename: (name: string) => void;
	onMove: (direction: 'up' | 'down') => void;
}

export const TabPopup = ({ tabId, tabName, onRename, onMove }: TabPopupProps) => {
	const { closePopup } = usePopup();
	const { openModal } = useModal();
	const { lang } = useTodoList();
	const [newTabName, setNewTabName] = useState<string>(tabName);

	const handleMoveTab = (direction: 'up' | 'down') => {
		onMove && onMove(direction);
	}

	const handleClickRename = () => {
		onRename && onRename(newTabName);
		closePopup();
	}

	const handleClickDelete = () => {
		openModal(<DeleteTabDialog tabId={tabId} tabName={tabName} />);
	}

	return (
		<>
			<input className='nm-popup__input' type='text' value={newTabName} onChange={(e) => setNewTabName(e.target.value)} placeholder='e.g., Personal' />
			<button onClick={handleClickRename} className='nm-button nm-button--solid nm-hover'>
				{getLocalization(lang, 'btn-rename')}
			</button>
			<button onClick={handleClickDelete} className='nm-button nm-button--danger-outline nm-hover'>
				{getLocalization(lang, 'btn-delete')}
			</button>
			<hr />
			<div style={{ display: 'flex', gap: '8px' }}>
				<button onClick={() => handleMoveTab('up')} className=''>
					<img style={{ filter: 'invert(1)' }} src='assets/icon-up.png' />
					{getLocalization(lang, 'btn-move_up')}
				</button>
				<button onClick={() => handleMoveTab('down')}>
					<img style={{ filter: 'invert(1)' }} src='assets/icon-down.png' />
					{getLocalization(lang, 'btn-move_down')}
				</button>
			</div>
		</>
	);
}