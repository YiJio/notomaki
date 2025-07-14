// packages
import { useState } from 'react';
// hooks
import { useTodoList } from '../../contexts/todo.context';
// components
import { Tooltip } from '../tooltip';

interface SaveButtonProps {
	onSave: () => void;
}

export const SaveButton = ({ onSave }: SaveButtonProps) => {
	const { activeTab, todoList } = useTodoList();
	const activeColor = todoList?.[activeTab]?.color;
	const [tip, setTip] = useState('Manual save for peace of mind');

	const handleClick = () => {
		onSave && onSave();
		setTip('Saved successfully!');
		setInterval(() => {
			setTip('Manual save for peace of mind');
		}, 1000);
	}

	return (
		<div className='nm-note__save nm-layer'>
			<Tooltip position='left' offset={56} trigger={<button className={`nm-fg-${activeColor}`} onClick={handleClick}>Save</button>} text={tip} />
		</div>
	);
}