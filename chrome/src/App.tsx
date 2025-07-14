// packages
import { useEffect, useState } from 'react';
// css
import './index.css';
// contexts/providers
import { ModalProvider } from './contexts/modal.context';
// hooks
import { useTodoList } from './contexts/todo.context';
// components
import { Copy, Header, Note, TabList, Toolbox } from './components';
import { NavNoteButton, NewNoteButton } from './components/buttons';
// constants
import { NOTE_TYPES } from './components/constants';

function getFromIndex(array: any[], fieldCheck: string, value: any, returnField?: string | null) {
	const index = array.findIndex((a) => a[fieldCheck] == value);
	if (returnField) return array[index][returnField];
	return array[index];
}

function App() {
	const [datetime, setDatetime] = useState<string>('');
	const { activeTab, activeList, todoList, isLoading, error } = useTodoList();
	const activeNote = todoList?.[activeTab]?.lists?.[activeList]?.note;
	const noteShort = getFromIndex(NOTE_TYPES, 'key', activeNote)?.short;

	function updateTime() {
		const now = new Date();
		const options: any = {
			year: 'numeric', month: '2-digit', day: '2-digit',
			hour: '2-digit', minute: '2-digit'
		};
		const formattedTime = now.toLocaleString('en-US', options).replaceAll('/', '.').replace(',', '');
		setDatetime(formattedTime);
	}

	useEffect(() => {
		const interval = setInterval(updateTime, 1000);
		return () => { clearInterval(interval); }
	}, []);

	useEffect(() => {
		if (isLoading) { console.log('loading...') }
		else if (error) { console.log('error', error); }
	}, [isLoading, error]);

	return (
		<div className='nm-frame nm-container'>
			<ModalProvider>
				<Header />
				<main className='nm-body'>
					<div className='nm-props nm-layer'>
						<div className='nm-props__nav'>
							<NewNoteButton />
							<NavNoteButton direction='left' />
							<span className='nm-props__span'>{datetime}</span>
							<NavNoteButton direction='right' />
						</div>
					</div>
					<div className='nm-folder'>
						<TabList />
						<Note />
						<div className='nm-flex nm-toolboxes nm-layer'>
							<div className='nm-slot'><Toolbox type='notes' /></div>
							<div className='nm-slot'><Toolbox type='swatches' /></div>
							<div className='nm-slot'><Toolbox type='marks' /></div>
						</div>
					</div>
				</main>
				<Copy />
				<div className={`nm-notebook nm-notebook--${noteShort}`} />
			</ModalProvider>
		</div>
	);
}

export default App;
