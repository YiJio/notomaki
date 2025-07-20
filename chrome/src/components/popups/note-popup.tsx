// hooks
import { usePopup } from '../../contexts/popup.context';
import { useTodoList } from '../../contexts/todo.context';
// components
import { PopupOption } from '../popup-option';

export const NotePopup = () => {
	const { closePopup } = usePopup();
	const { activeTab, todoList } = useTodoList();
	const lists = Object.entries(todoList?.[activeTab]?.lists).map(([id, data]) => ({ id, name: data.name, updated: data.updated }));

	return (
		<>
			{lists.map((list) => (
				<PopupOption key={list.id} listId={list.id} listName={list.name} listDate={list.updated} onClose={closePopup} />
			))}
		</>
	);
}