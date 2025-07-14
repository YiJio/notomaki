// packages
import { useState } from 'react';
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';
// components
import { Swatch } from '../swatch';
// constants
import { SWATCH_COLORS } from '../constants';

export const AddTabDialog = () => {
	const { closeModal } = useModal();
	const [tabName, setTabName] = useState<string>('Untitled tab');
	const [selectedColor, setSelectedColor] = useState<string>('o');
	const { setActiveList, handleUpdate } = useTodoList();

	const handleAddTab = () => {
		handleUpdate('addTab', { tabName, color: selectedColor }); // handles setting active tab already
		setActiveList('1');
		closeModal();
	}

	return (
		<>
			<header className='nm-dialog__header'>
				<img src='assets/maki-2.png' />
				Create a new tab
			</header>
			<div className='nm-dialog__body'>
				<input className='nm-dialog__input' type='text' value={tabName} onChange={(e) => setTabName(e.target.value)} placeholder='e.g., Personal' />
				<div className='nm-swatches'>
					{SWATCH_COLORS.map((color, index) => (<Swatch key={index} color={color.key} activeColor={selectedColor} onChange={(newColor: string) => setSelectedColor(newColor)} />))}
				</div>
			</div>
			<footer className='nm-dialog__footer'>
				<button onClick={closeModal} className='nm-button nm-button--outline nm-hover'>Cancel</button>
				<button onClick={handleAddTab} className='nm-button nm-button--solid nm-hover'>Create</button>
			</footer>
		</>
	);
}