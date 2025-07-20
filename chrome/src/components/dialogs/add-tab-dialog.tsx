// packages
import { useEffect, useState } from 'react';
// utils
import { getLocalization } from '../../utils';
// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';
// components
import { Swatch } from '../swatch';
// constants
import { SWATCH_COLORS } from '../../constants';

export const AddTabDialog = () => {
	const { closeModal } = useModal();
	const { lang, handleUpdate } = useTodoList();
	const [tabName, setTabName] = useState<string>('');
	const [selectedColor, setSelectedColor] = useState<string>('o');

	const handleAddTab = () => {
		handleUpdate('addTab', { tabName, color: selectedColor }); // handles setting active tab & list already
		closeModal();
	}

	useEffect(() => {
		if(lang) {
			setTabName(getLocalization(lang, 't-untitled_tab'));
		}
	}, [lang]);

	return (
		<>
			<header className='nm-dialog__header'>
				<img src='assets/maki-3.png' />
				{getLocalization(lang, 'h-create_tab')}
			</header>
			<div className='nm-dialog__body'>
				<input className='nm-dialog__input' type='text' value={tabName} onChange={(e) => setTabName(e.target.value)} placeholder={getLocalization(lang, 't-untitled_tab_ph')} />
				<div className='nm-swatches'>
					{SWATCH_COLORS.map((color, index) => (<Swatch key={index} color={color.key} activeColor={selectedColor} onChange={(newColor: string) => setSelectedColor(newColor)} />))}
				</div>
			</div>
			<footer className='nm-dialog__footer'>
				<button onClick={closeModal} className='nm-button nm-button--outline nm-hover'>
					{getLocalization(lang, 'btn-cancel')}
				</button>
				<button onClick={handleAddTab} className='nm-button nm-button--solid nm-hover'>
					{getLocalization(lang, 'btn-create')}
				</button>
			</footer>
		</>
	);
}