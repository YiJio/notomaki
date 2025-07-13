// packages
import { useEffect, useRef } from 'react';

interface RenamePopupProps {
	tabName: string;
	setTabName: (name: string) => void;
	closePopup: () => void;
}

export const RenamePopup = ({ tabName, setTabName, closePopup }: RenamePopupProps) => {
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
			if(popupRef.current && !popupRef.current.contains(e.target as Node)) {
				closePopup();
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => { document.removeEventListener('mousedown', handleOutsideClick); }
	}, []);

	const handleClickDelete = () => {
		// need to ask confirmation
	}

	return (
		<div ref={popupRef} className='nm-popup nm-frame'>
			<input className='nm-popup__input' type='text' value={tabName} onChange={(e) => setTabName(e.target.value)} />
			<button className='nm-button nm-button--solid nm-hover'>Rename</button>
			<button onClick={handleClickDelete} className='nm-button nm-button--danger-outline nm-hover'>Delete</button>
			<small>Be careful. Deleting this tab will delete all to-do lists associated with it.</small>
		</div>
	);
}