// hooks
import { useModal } from '../../contexts/modal.context';
import { useTodoList } from '../../contexts/todo.context';
// utils
import { getLocalization } from '../../utils';
// components
import { DeleteListDialog } from '../dialogs';

interface ActionsButtonProps {
	type: 'add' | 'minus';
}

export const ActionsButton = ({ type }: ActionsButtonProps) => {
	const { lang, activeTab, handleUpdate } = useTodoList();
	const { openModal } = useModal();

	const handleAction = () => {
		if(type === 'add') handleUpdate('addList', { tabId: activeTab });
		else if(type === 'minus') { openModal(<DeleteListDialog />);}
	}

	return (
		<button onClick={handleAction} className='nm-hover'>
			{type === 'add' ? getLocalization(lang, 'btn-note_new') : getLocalization(lang, 'btn-note_delete')}
			<img src={`assets/icon-${type}.png`} style={{ filter: 'invert(1)' }} />
		</button>
	);
}