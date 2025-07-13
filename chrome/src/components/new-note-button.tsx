// hooks
import { useTodoList } from '../contexts/todo.context';

export const NewNoteButton = () => {
	const { activeTab, todoList, setActiveList, handleUpdate } = useTodoList();

	const handleAddList = () => {
		handleUpdate('addList', { tabId: activeTab });
		const last = (Object.keys(todoList[activeTab]?.lists).length + 1).toString();
		setActiveList(last);
	}

	return (
		<button onClick={handleAddList} className='nm-hover'>
			New note
			<img src='assets/icon-add.png' style={{ filter: 'invert(1)' }} />
		</button>
	);
}