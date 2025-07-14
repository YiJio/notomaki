// hooks
import { useTodoList } from '../../contexts/todo.context';

export const NewNoteButton = () => {
	const { activeTab, handleUpdate } = useTodoList();

	const handleAddList = () => {
		handleUpdate('addList', { tabId: activeTab });
	}

	return (
		<button onClick={handleAddList} className='nm-hover'>
			New note
			<img src='assets/icon-add.png' style={{ filter: 'invert(1)' }} />
		</button>
	);
}