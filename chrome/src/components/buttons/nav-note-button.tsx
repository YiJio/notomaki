import { useEffect, useState } from 'react';
// hooks
import { useTodoList } from '../../contexts/todo.context';

interface NavNoteButtonProps {
	direction: 'left' | 'right';
}

export const NavNoteButton = ({ direction }: NavNoteButtonProps) => {
	const { activeTab, activeList, todoList, setActiveList } = useTodoList();
	const [numLists, setNumLists] = useState(0);

	useEffect(() => {
		if (todoList && activeTab) {
			console.log(todoList[activeTab].lists);
			setNumLists(Object.keys(todoList[activeTab].lists).length);
		}
	}, [todoList, activeTab]);

	const handleNav = () => {
		// because lists start at 1 and not 0
		let currentPage = parseInt(activeList) - 1;
		let page = currentPage;
		if (direction === 'left') {
			console.log('current', currentPage);
			page = currentPage === 0 ? numLists - 1 : currentPage - 1;
			console.log(page);
		} else {
			page = (currentPage + 1) % numLists;
			console.log(page);
		}
		setActiveList((page + 1).toString());
	}

	return (
		<button onClick={handleNav} className='nm-hover' disabled={numLists === 1}>
			<img src={`assets/icon-${direction}.png`} />
		</button>
	);
}
