// packages
import { useEffect, useState } from 'react';
// hooks
import { useTodoList } from '../../contexts/todo.context';
// components
import { Tooltip } from '../tooltip';
import { getLocalization } from '../../utils';

interface SaveButtonProps {
	onSave: () => void;
}

export const SaveButton = ({ onSave }: SaveButtonProps) => {
	const { lang, activeTab, todoList } = useTodoList();
	const activeColor = todoList?.[activeTab]?.color;
	const [tip, setTip] = useState('');

	const handleClick = () => {
		onSave && onSave();
		const string = getLocalization(lang, 't-save_success');
		setTip(string);
		setInterval(() => {
			const string = getLocalization(lang, 't-save_tip');
			setTip(string);
		}, 2000);
	}

	useEffect(() => {
		if(lang) {
			setTip(getLocalization(lang, 't-save_tip'));
		}
	}, [lang]);

	return (
		<div className='nm-note__save nm-layer'>
			<Tooltip position='left' offset={56} trigger={<button className={`nm-fg-${activeColor}`} onClick={handleClick}>
				{getLocalization(lang, 'btn-save')}
			</button>} text={tip} />
		</div>
	);
}