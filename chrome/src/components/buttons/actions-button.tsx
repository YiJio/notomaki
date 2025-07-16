// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';
// components
import { DeleteListDialog } from '../dialogs';

interface ActionsButtonProps {
	type: 'add' | 'minus';
}

export const ActionsButton = ({ type }: ActionsButtonProps) => {
	const { activeTab, handleUpdate } = useTodoList();
	const { openModal } = useModal();

	const handleAction = () => {
		if(type === 'add') handleUpdate('addList', { tabId: activeTab });
		else if(type === 'minus') { openModal(<DeleteListDialog />);}
	}

	return (
		<button onClick={handleAction} className='nm-hover'>
			{type === 'add' ? 'New note' : 'Delete note'}
			<img src={`assets/icon-${type}.png`} style={{ filter: 'invert(1)' }} />
		</button>
	);
}