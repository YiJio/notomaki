// packages
import { useEffect, useRef, useState } from 'react';
// hooks
import { useModal } from '../../contexts/modal.context';
// components
import { DeleteTabDialog } from '../dialogs';

interface TabPopupProps {
	y: number;
	tabId: string;
	tabName: string;
	onRename: (name: string) => void;
	onMove: (direction: 'up' | 'down') => void;
	closePopup: () => void;
}

export const TabPopup = ({ y, tabId, tabName, onRename, onMove, closePopup }: TabPopupProps) => {
	const { openModal } = useModal();
	const popupRef = useRef<HTMLDivElement>(null);
	const [newTabName, setNewTabName] = useState<string>(tabName);

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				closePopup();
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => { document.removeEventListener('mousedown', handleOutsideClick); }
	}, []);

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
		<div ref={popupRef} className='nm-popup nm-popup--tab nm-frame' style={{ top: (y - 180) + 'px' }}>
			<input className='nm-popup__input' type='text' value={newTabName} onChange={(e) => setNewTabName(e.target.value)} placeholder='e.g., Personal' />
			<button onClick={handleClickRename} className='nm-button nm-button--solid nm-hover'>Rename</button>
			<button onClick={handleClickDelete} className='nm-button nm-button--danger-outline nm-hover'>Delete</button>
			<hr />
			<div style={{ display:'flex', gap:'8px' }}>
				<button onClick={() => handleMoveTab('up')} className=''>
					<img style={{ filter:'invert(1)' }} src='assets/icon-up.png' />
					Move up
				</button>
				<button onClick={() => handleMoveTab('down')}>
					<img style={{ filter:'invert(1)' }} src='assets/icon-down.png' />
					Move down
				</button>
			</div>
		</div>
	);
}