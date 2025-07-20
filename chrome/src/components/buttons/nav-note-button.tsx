// packages
import { useEffect, useState } from 'react';
// hooks
import { useTodoList } from '../../contexts/todo.context';

interface NavNoteButtonProps {
	direction: 'left' | 'right';
}

export const NavNoteButton = ({ direction }: NavNoteButtonProps) => {
	const { activeTab, activeList, setActiveList, hasUnsaved, todoList, handleSaveToStorage } = useTodoList();
	const [numLists, setNumLists] = useState(0);

	useEffect(() => {
		if (todoList && activeTab) {
			//console.log('todos,tab',todoList, activeTab);
			//console.log('lists',todoList[activeTab].lists);
			setNumLists(Object.keys(todoList?.[activeTab]?.lists).length);
		}
	}, [todoList, activeTab]);

	function getSorted(): string[] {
		return Object.keys(todoList[activeTab].lists).sort((a, b) => parseInt(a) - parseInt(b));
	}

	const handleNav = () => {
		if (hasUnsaved) { handleSaveToStorage('list change'); }
		setTimeout(() => {
			const ids = getSorted();
			const index = ids.indexOf(activeList);
			let page = '1';
			if (index === -1) page = ids[0];
			if (direction === 'left') { page = ids[(index - 1 + ids.length) % ids.length]; }
			else { page = ids[(index + 1) % ids.length]; }
			setActiveList(page);
		}, 100);
	}

	return (
		<button onClick={handleNav} className='nm-hover nm-layer' disabled={numLists === 1}>
			<img src={`assets/icon-${direction}.png`} />
		</button>
	);
}
