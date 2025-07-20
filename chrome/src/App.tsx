// packages
import { useEffect, useState } from 'react';
// css
import './index.css';
// contexts/providers
import { ModalProvider } from './contexts/modal.context';
import { PopupProvider } from './contexts/popup.context';
// hooks
import { useTodoList } from './contexts/todo.context';
// utils
import { getDateTimeNow, getFromIndex } from './utils';
// components
import { Copy, Header, Note, TabList, Toolbox } from './components';
import { ActionsButton } from './components/buttons';
// constants
import { NOTE_TYPES } from './constants';

function App() {
	const [datetime, setDatetime] = useState<string>('');
	const { lang, activeTab, activeList, todoList, isLoading, error } = useTodoList();
	const activeNote = todoList?.[activeTab]?.lists?.[activeList]?.note;
	const noteShort = getFromIndex(NOTE_TYPES, 'key', activeNote)?.short;

	function updateTime() {
		const formattedTime = getDateTimeNow(lang);
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
				<PopupProvider>
					<Header />
					<main className='nm-body'>
						<div className='nm-actions nm-layer'>
							<span className='nm-actions__span'>{datetime}</span>
							<div className='nm-actions__tools'>
								<ActionsButton type='add' />
								<ActionsButton type='minus' />
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
				</PopupProvider>
			</ModalProvider>
		</div>
	);
}

export default App;
