// packages
import { useRef } from 'react';
// hooks
import { usePopup } from '../../contexts/popup.context';
// components
import { NotePopup } from '../popups';

export const NoteMenuButton = () => {
	const { openPopup } = usePopup();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleOpen = (e: React.MouseEvent) => {
		if (buttonRef.current) {
			const node = e.target as HTMLElement;
			const x = 36;
			const y = node.getBoundingClientRect().top + 26;
			openPopup(<NotePopup />, x, y, 'note');
		}
	}

	return (
		<button ref={buttonRef} onClick={handleOpen} className='nm-hover nm-layer'>
			<img src='assets/icon-menu.png' />
		</button>
	);
}
